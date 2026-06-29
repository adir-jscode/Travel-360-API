"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinRequestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const joinRequest_controller_1 = require("./joinRequest.controller");
const router = express_1.default.Router();
const auth = (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.GUIDE);
// Send a join request for a travel plan
router.post('/:travelPlanId', auth, joinRequest_controller_1.JoinRequestControllers.sendJoinRequest);
// Host: view incoming requests for all his plans
router.get('/incoming', auth, joinRequest_controller_1.JoinRequestControllers.getIncomingRequests);
// Requester: view my outgoing requests
router.get('/outgoing', auth, joinRequest_controller_1.JoinRequestControllers.getOutgoingRequests);
// Host: accept or reject a specific request
router.patch('/:id/respond', auth, joinRequest_controller_1.JoinRequestControllers.respondToRequest);
// Requester: cancel a pending request
router.delete('/:id', auth, joinRequest_controller_1.JoinRequestControllers.cancelJoinRequest);
exports.JoinRequestRoutes = router;
