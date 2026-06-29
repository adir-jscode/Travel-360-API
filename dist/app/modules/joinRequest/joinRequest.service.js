"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinRequestServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const socket_1 = require("../../socket/socket");
const notification_interface_1 = require("../notification/notification.interface");
const notification_service_1 = require("../notification/notification.service");
const travelPlan_model_1 = require("../travelPlan/travelPlan.model");
const trip_model_1 = require("../trip/trip.model");
const user_model_1 = require("../user/user.model");
const joinRequest_interface_1 = require("./joinRequest.interface");
const joinRequest_model_1 = require("./joinRequest.model");
const sendJoinRequest = (requesterId, travelPlanId, message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const plan = yield travelPlan_model_1.TravelPlan.findById(travelPlanId).populate("user", "name picture");
    if (!plan)
        throw new AppError_1.default(404, "Travel plan not found");
    const hostId = plan.user._id;
    // BUG FIX 2: ObjectId === string always returns false in JS/TS. Use .toString()
    // so the check actually prevents users from requesting to join their own plans.
    if (hostId.toString() === requesterId)
        throw new AppError_1.default(400, "You cannot join your own travel plan");
    // Prevent duplicate active requests
    const existing = yield joinRequest_model_1.JoinRequest.findOne({
        travelPlan: travelPlanId,
        requester: requesterId,
    });
    if (existing) {
        if (existing.status === joinRequest_interface_1.JoinRequestStatus.PENDING)
            throw new AppError_1.default(409, "You already have a pending request for this plan");
        if (existing.status === joinRequest_interface_1.JoinRequestStatus.ACCEPTED)
            throw new AppError_1.default(409, "You are already a member of this trip");
        // Allow re-request if previously rejected — delete old record first
        yield joinRequest_model_1.JoinRequest.findByIdAndDelete(existing._id);
    }
    const requester = yield user_model_1.User.findById(requesterId).select("name picture");
    if (!requester)
        throw new AppError_1.default(404, "Requester not found");
    const joinRequest = yield joinRequest_model_1.JoinRequest.create({
        travelPlan: travelPlanId,
        requester: requesterId,
        host: hostId,
        message,
    });
    const notif = yield notification_service_1.NotificationServices.createNotification({
        recipient: plan.user,
        sender: requester._id,
        type: notification_interface_1.NotificationType.JOIN_REQUEST,
        title: "New Join Request",
        message: `${requester.name} wants to join your travel plan to ${((_a = plan.destination) === null || _a === void 0 ? void 0 : _a.city) || ((_b = plan.destination) === null || _b === void 0 ? void 0 : _b.country)}`,
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
    (0, socket_1.emitNotification)(hostId.toString(), notif.toObject());
    return joinRequest;
});
const respondToJoinRequest = (hostId, joinRequestId, action) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const joinRequest = yield joinRequest_model_1.JoinRequest.findById(joinRequestId)
        .populate("travelPlan")
        .populate("requester", "name picture email");
    if (!joinRequest)
        throw new AppError_1.default(404, "Join request not found");
    if (joinRequest.host.toString() !== hostId)
        throw new AppError_1.default(403, "Only the host can respond to this request");
    if (joinRequest.status !== joinRequest_interface_1.JoinRequestStatus.PENDING)
        throw new AppError_1.default(400, "This request has already been responded to");
    const newStatus = action === "accept"
        ? joinRequest_interface_1.JoinRequestStatus.ACCEPTED
        : joinRequest_interface_1.JoinRequestStatus.REJECTED;
    joinRequest.status = newStatus;
    yield joinRequest.save();
    const host = yield user_model_1.User.findById(hostId).select("name picture");
    if (!host) {
        throw new AppError_1.default(404, "Host not found");
    }
    const plan = joinRequest.travelPlan;
    const requesterId = (_b = (_a = joinRequest.requester._id) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : joinRequest.requester.toString();
    // ── If accepted → create a Trip document ────────────────────────────────
    if (action === "accept") {
        const tripExists = yield trip_model_1.Trip.findOne({
            travelPlan: plan._id,
            "members.user": requesterId,
        });
        if (!tripExists) {
            // Ensure host is already in the trip or create fresh
            const existingTrip = yield trip_model_1.Trip.findOne({
                travelPlan: plan._id,
                host: hostId,
            });
            if (existingTrip) {
                // Add requester to existing trip
                existingTrip.members.push({
                    user: joinRequest.requester._id,
                    joinedAt: new Date(),
                });
                yield existingTrip.save();
            }
            else {
                // First acceptance — create the trip with host + requester
                yield trip_model_1.Trip.create({
                    travelPlan: plan._id,
                    host: joinRequest.host, // already ObjectId
                    members: [
                        { user: joinRequest.host, joinedAt: new Date() },
                        { user: joinRequest.requester._id, joinedAt: new Date() },
                    ],
                    status: trip_model_1.TripStatus.UPCOMING,
                    photos: [],
                });
            }
        }
    }
    // ── Notify the requester ─────────────────────────────────────────────────
    const notifType = action === "accept"
        ? notification_interface_1.NotificationType.REQUEST_ACCEPTED
        : notification_interface_1.NotificationType.REQUEST_REJECTED;
    const notifMessage = action === "accept"
        ? `${host === null || host === void 0 ? void 0 : host.name} accepted your request to join the travel plan`
        : `${host === null || host === void 0 ? void 0 : host.name} declined your request to join the travel plan`;
    const notif = yield notification_service_1.NotificationServices.createNotification({
        recipient: joinRequest.requester._id,
        sender: host === null || host === void 0 ? void 0 : host._id,
        type: notifType,
        title: action === "accept" ? "Request Accepted 🎉" : "Request Declined",
        message: notifMessage,
        metadata: {
            joinRequestId,
            travelPlanId: plan._id,
        },
    });
    (0, socket_1.emitNotification)(requesterId, notif.toObject());
    return joinRequest;
});
// ── Read helpers ─────────────────────────────────────────────────────────────
const getRequestsForMyPlans = (hostId) => __awaiter(void 0, void 0, void 0, function* () {
    return joinRequest_model_1.JoinRequest.find({ host: hostId })
        .populate("requester", "name picture bio travelInterest rating")
        .populate("travelPlan", "destination startDate endDate travelType")
        .sort({ createdAt: -1 })
        .lean();
});
const getMyOutgoingRequests = (requesterId) => __awaiter(void 0, void 0, void 0, function* () {
    return joinRequest_model_1.JoinRequest.find({ requester: requesterId })
        .populate("travelPlan", "destination startDate endDate travelType")
        .populate("host", "name picture")
        .sort({ createdAt: -1 })
        .lean();
});
const cancelJoinRequest = (requesterId, joinRequestId) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield joinRequest_model_1.JoinRequest.findOne({
        _id: joinRequestId,
        requester: requesterId,
    });
    if (!request)
        throw new AppError_1.default(404, "Join request not found");
    if (request.status !== joinRequest_interface_1.JoinRequestStatus.PENDING)
        throw new AppError_1.default(400, "Only pending requests can be cancelled");
    yield joinRequest_model_1.JoinRequest.findByIdAndDelete(joinRequestId);
    return null;
});
exports.JoinRequestServices = {
    sendJoinRequest,
    respondToJoinRequest,
    getRequestsForMyPlans,
    getMyOutgoingRequests,
    cancelJoinRequest,
};
