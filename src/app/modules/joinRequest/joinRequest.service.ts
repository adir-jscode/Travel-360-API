/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { emitNotification } from "../../socket/socket";
import { NotificationType } from "../notification/notification.interface";
import { NotificationServices } from "../notification/notification.service";
import { TravelPlan } from "../travelPlan/travelPlan.model";
import { Trip, TripStatus } from "../trip/trip.model";
import { User } from "../user/user.model";
import { JoinRequestStatus } from "./joinRequest.interface";
import { JoinRequest } from "./joinRequest.model";

const sendJoinRequest = async (
  requesterId: string,
  travelPlanId: string,
  message?: string,
) => {
  const plan = await TravelPlan.findById(travelPlanId).populate(
    "user",
    "name picture",
  );
  if (!plan) throw new AppError(404, "Travel plan not found");

  const hostId = (plan.user as any)._id;
  // BUG FIX 2: ObjectId === string always returns false in JS/TS. Use .toString()
  // so the check actually prevents users from requesting to join their own plans.
  if (hostId.toString() === requesterId)
    throw new AppError(400, "You cannot join your own travel plan");

  // Prevent duplicate active requests
  const existing = await JoinRequest.findOne({
    travelPlan: travelPlanId,
    requester: requesterId,
  });
  if (existing) {
    if (existing.status === JoinRequestStatus.PENDING)
      throw new AppError(
        409,
        "You already have a pending request for this plan",
      );
    if (existing.status === JoinRequestStatus.ACCEPTED)
      throw new AppError(409, "You are already a member of this trip");
    // Allow re-request if previously rejected — delete old record first
    await JoinRequest.findByIdAndDelete(existing._id);
  }

  const requester = await User.findById(requesterId).select("name picture");
  if (!requester) throw new AppError(404, "Requester not found");

  const joinRequest = await JoinRequest.create({
    travelPlan: travelPlanId,
    requester: requesterId,
    host: hostId,
    message,
  });

  const notif = await NotificationServices.createNotification({
    recipient: plan.user as unknown as import("mongoose").Types.ObjectId,
    sender: requester._id,
    type: NotificationType.JOIN_REQUEST,
    title: "New Join Request",
    message: `${requester.name} wants to join your travel plan to ${plan.destination?.city || plan.destination?.country}`,
    metadata: {
      joinRequestId: joinRequest._id,
      travelPlanId,
      requesterName: requester.name,
      requesterPicture: requester.picture,
    },
  });

  // BUG FIX 3: Socket rooms are keyed by userId as a STRING. hostId here is a
  // Mongoose ObjectId — emitting to it never reaches any connected socket.
  // Convert to string so io.to(recipientId) finds the correct room.
  emitNotification(hostId.toString(), notif.toObject());

  return joinRequest;
};

const respondToJoinRequest = async (
  hostId: string,
  joinRequestId: string,
  action: "accept" | "reject",
) => {
  const joinRequest = await JoinRequest.findById(joinRequestId)
    .populate("travelPlan")
    .populate("requester", "name picture email");

  if (!joinRequest) throw new AppError(404, "Join request not found");
  if (joinRequest.host.toString() !== hostId)
    throw new AppError(403, "Only the host can respond to this request");
  if (joinRequest.status !== JoinRequestStatus.PENDING)
    throw new AppError(400, "This request has already been responded to");

  const newStatus =
    action === "accept"
      ? JoinRequestStatus.ACCEPTED
      : JoinRequestStatus.REJECTED;

  joinRequest.status = newStatus;
  await joinRequest.save();

  const host = await User.findById(hostId).select("name picture");
  if (!host) {
    throw new AppError(404, "Host not found");
  }
  const plan =
    joinRequest.travelPlan as unknown as import("../travelPlan/travelPlan.interface").ITravelPlan & {
      _id: import("mongoose").Types.ObjectId;
    };
  const requesterId =
    joinRequest.requester._id?.toString() ?? joinRequest.requester.toString();

  // ── If accepted → create a Trip document ────────────────────────────────
  if (action === "accept") {
    const tripExists = await Trip.findOne({
      travelPlan: plan._id,
      "members.user": requesterId,
    });

    if (!tripExists) {
      // Ensure host is already in the trip or create fresh
      const existingTrip = await Trip.findOne({
        travelPlan: plan._id,
        host: hostId,
      });

      if (existingTrip) {
        // Add requester to existing trip
        existingTrip.members.push({
          user: joinRequest.requester._id,
          joinedAt: new Date(),
        });
        await existingTrip.save();
      } else {
        // First acceptance — create the trip with host + requester
        await Trip.create({
          travelPlan: plan._id,
          host: joinRequest.host, // already ObjectId
          members: [
            { user: joinRequest.host, joinedAt: new Date() },
            { user: joinRequest.requester._id, joinedAt: new Date() },
          ],
          status: TripStatus.UPCOMING,
          photos: [],
        });
      }
    }
  }

  // ── Notify the requester ─────────────────────────────────────────────────
  const notifType =
    action === "accept"
      ? NotificationType.REQUEST_ACCEPTED
      : NotificationType.REQUEST_REJECTED;

  const notifMessage =
    action === "accept"
      ? `${host?.name} accepted your request to join the travel plan`
      : `${host?.name} declined your request to join the travel plan`;

  const notif = await NotificationServices.createNotification({
    recipient: joinRequest.requester._id,
    sender: host?._id,
    type: notifType,
    title: action === "accept" ? "Request Accepted 🎉" : "Request Declined",
    message: notifMessage,
    metadata: {
      joinRequestId,
      travelPlanId: plan._id,
    },
  });

  emitNotification(requesterId, notif.toObject());

  return joinRequest;
};

// ── Read helpers ─────────────────────────────────────────────────────────────
const getRequestsForMyPlans = async (hostId: string) => {
  return JoinRequest.find({ host: hostId })
    .populate("requester", "name picture bio travelInterest rating")
    .populate("travelPlan", "destination startDate endDate travelType")
    .sort({ createdAt: -1 })
    .lean();
};

const getMyOutgoingRequests = async (requesterId: string) => {
  return JoinRequest.find({ requester: requesterId })
    .populate("travelPlan", "destination startDate endDate travelType")
    .populate("host", "name picture")
    .sort({ createdAt: -1 })
    .lean();
};

const cancelJoinRequest = async (
  requesterId: string,
  joinRequestId: string,
) => {
  const request = await JoinRequest.findOne({
    _id: joinRequestId,
    requester: requesterId,
  });
  if (!request) throw new AppError(404, "Join request not found");
  if (request.status !== JoinRequestStatus.PENDING)
    throw new AppError(400, "Only pending requests can be cancelled");
  await JoinRequest.findByIdAndDelete(joinRequestId);
  return null;
};

export const JoinRequestServices = {
  sendJoinRequest,
  respondToJoinRequest,
  getRequestsForMyPlans,
  getMyOutgoingRequests,
  cancelJoinRequest,
};
