import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { SubscriptionPlanControllers } from "./subscriptionPlan.controller";
import {
  createSubscriptionPlanZodSchema,
  updateSubscriptionPlanZodSchema,
} from "./subscriptionPlan.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(createSubscriptionPlanZodSchema),
  SubscriptionPlanControllers.createSubscriptionPlan,
);

router.get("/", SubscriptionPlanControllers.getAllSubscriptionPlans);

router.get("/:id", SubscriptionPlanControllers.getSingleSubscriptionPlan);

router.patch(
  "/:id",
  validateRequest(updateSubscriptionPlanZodSchema),
  SubscriptionPlanControllers.updateSubscriptionPlan,
);

router.delete("/:id", SubscriptionPlanControllers.deleteSubscriptionPlan);

export const SubscriptionPlanRoutes = router;
