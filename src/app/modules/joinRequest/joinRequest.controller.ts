import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JoinRequestServices } from "./joinRequest.service";

/** POST /api/v1/join-request/:travelPlanId */
const sendJoinRequest = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  console.log(req.params.travelPlanId);
  const travelId = req.params.travelPlanId;
  const data = await JoinRequestServices.sendJoinRequest(
    userId,
    travelId,
    req.body.message,
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Join request sent",
    data,
  });
});

/** PATCH /api/v1/join-request/:id/respond */
const respondToRequest = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  const { action } = req.body; // 'accept' | 'reject'
  const data = await JoinRequestServices.respondToJoinRequest(
    userId,
    req.params.id,
    action,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: `Request ${action}ed`,
    data,
  });
});

/** GET /api/v1/join-request/incoming — requests for host's plans */
const getIncomingRequests = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  console.log("Incoming");
  console.log({ userId });
  const data = await JoinRequestServices.getRequestsForMyPlans(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Incoming requests fetched",
    data,
  });
});

/** GET /api/v1/join-request/outgoing — my sent requests */
const getOutgoingRequests = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  const data = await JoinRequestServices.getMyOutgoingRequests(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Outgoing requests fetched",
    data,
  });
});

/** DELETE /api/v1/join-request/:id */
const cancelJoinRequest = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  await JoinRequestServices.cancelJoinRequest(userId, req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Join request cancelled",
    data: null,
  });
});

export const JoinRequestControllers = {
  sendJoinRequest,
  respondToRequest,
  getIncomingRequests,
  getOutgoingRequests,
  cancelJoinRequest,
};
