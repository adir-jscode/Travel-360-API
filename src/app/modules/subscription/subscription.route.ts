import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";

import { Role } from "../user/user.interface";
import { SubscriptionControllers } from "./subscription.controller";
const router = Router();
// create
router.post(
  "/:id",
  checkAuth(...Object.values(Role)),
  SubscriptionControllers.createSubscription,
);
//all subs

// my subs

//by subs id

//booking status update
export const SubscriptionRoutes = router;
