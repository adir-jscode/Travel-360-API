import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AnalyticsController } from "./analytics.controller";

const router = express.Router();
const adminAuth = checkAuth(Role.ADMIN, Role.SUPER_ADMIN);

router.get("/dashboard", adminAuth, AnalyticsController.getDashboardSummary);
router.get("/users", adminAuth, AnalyticsController.getUserStats);
router.get("/travel-plans", adminAuth, AnalyticsController.getTravelPlanStats);
router.get("/payments", adminAuth, AnalyticsController.getPaymentStats);
router.get(
  "/subscriptions",
  adminAuth,
  AnalyticsController.getSubscriptionStats,
);
router.get("/trips", adminAuth, AnalyticsController.getTripStats);
router.get("/reviews", adminAuth, AnalyticsController.getReviewStats);
router.get(
  "/join-requests",
  adminAuth,
  AnalyticsController.getJoinRequestStats,
);

export const AnalyticsRoutes = router;
