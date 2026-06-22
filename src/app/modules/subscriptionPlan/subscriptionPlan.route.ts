import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { SubscriptionPlanControllers } from "./subscriptionPlan.controller";
import {
  createSubscriptionPlanZodSchema,
  updateSubscriptionPlanZodSchema,
} from "./subscriptionPlan.validation";

const router = express.Router();

router.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(createSubscriptionPlanZodSchema),
  SubscriptionPlanControllers.createSubscriptionPlan,
);

router.get("/", SubscriptionPlanControllers.getAllSubscriptionPlans);

router.get(
  "/:id",
  checkAuth(Role.ADMIN),
  SubscriptionPlanControllers.getSingleSubscriptionPlan,
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(updateSubscriptionPlanZodSchema),
  SubscriptionPlanControllers.updateSubscriptionPlan,
);

router.delete("/:id", SubscriptionPlanControllers.deleteSubscriptionPlan);

export const SubscriptionPlanRoutes = router;
