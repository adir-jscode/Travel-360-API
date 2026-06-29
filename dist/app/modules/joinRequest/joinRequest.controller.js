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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinRequestControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const joinRequest_service_1 = require("./joinRequest.service");
/** POST /api/v1/join-request/:travelPlanId */
const sendJoinRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    console.log(req.params.travelPlanId);
    const travelId = req.params.travelPlanId;
    const data = yield joinRequest_service_1.JoinRequestServices.sendJoinRequest(userId, travelId, req.body.message);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Join request sent",
        data,
    });
}));
/** PATCH /api/v1/join-request/:id/respond */
const respondToRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { action } = req.body; // 'accept' | 'reject'
    const data = yield joinRequest_service_1.JoinRequestServices.respondToJoinRequest(userId, req.params.id, action);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: `Request ${action}ed`,
        data,
    });
}));
/** GET /api/v1/join-request/incoming — requests for host's plans */
const getIncomingRequests = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    console.log("Incoming");
    console.log({ userId });
    const data = yield joinRequest_service_1.JoinRequestServices.getRequestsForMyPlans(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Incoming requests fetched",
        data,
    });
}));
/** GET /api/v1/join-request/outgoing — my sent requests */
const getOutgoingRequests = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const data = yield joinRequest_service_1.JoinRequestServices.getMyOutgoingRequests(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Outgoing requests fetched",
        data,
    });
}));
/** DELETE /api/v1/join-request/:id */
const cancelJoinRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    yield joinRequest_service_1.JoinRequestServices.cancelJoinRequest(userId, req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Join request cancelled",
        data: null,
    });
}));
exports.JoinRequestControllers = {
    sendJoinRequest,
    respondToRequest,
    getIncomingRequests,
    getOutgoingRequests,
    cancelJoinRequest,
};
