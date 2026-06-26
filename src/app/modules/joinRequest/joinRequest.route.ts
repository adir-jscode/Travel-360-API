import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { JoinRequestControllers } from './joinRequest.controller';

const router = express.Router();

const auth = checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN, Role.GUIDE);

// Send a join request for a travel plan
router.post('/:travelPlanId', auth, JoinRequestControllers.sendJoinRequest);

// Host: view incoming requests for all his plans
router.get('/incoming', auth, JoinRequestControllers.getIncomingRequests);

// Requester: view my outgoing requests
router.get('/outgoing', auth, JoinRequestControllers.getOutgoingRequests);

// Host: accept or reject a specific request
router.patch('/:id/respond', auth, JoinRequestControllers.respondToRequest);

// Requester: cancel a pending request
router.delete('/:id', auth, JoinRequestControllers.cancelJoinRequest);

export const JoinRequestRoutes = router;
