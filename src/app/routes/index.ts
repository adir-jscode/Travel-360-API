import { Router } from "express";
import { AnalyticsRoutes } from "../modules/analytics/analytics.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { JoinRequestRoutes } from "../modules/joinRequest/joinRequest.route";
import { NotificationRoutes } from "../modules/notification/notification.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { SubscriptionRoutes } from "../modules/subscription/subscription.route";
import { SubscriptionPlanRoutes } from "../modules/subscriptionPlan/subscriptionPlan.route";
import { TravelPlanRoutes } from "../modules/travelPlan/travelPlan.route";
import { TripRoutes } from "../modules/trip/trip.route";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/travel-plan",
    route: TravelPlanRoutes,
  },
  {
    path: "/subscription-plan",
    route: SubscriptionPlanRoutes,
  },
  {
    path: "/subscription",
    route: SubscriptionRoutes,
  },
  {
    path: "/analytics",
    route: AnalyticsRoutes,
  },
  { path: "/notification", route: NotificationRoutes },
  { path: "/trip", route: TripRoutes },
  { path: "/join-request", route: JoinRequestRoutes },
  { path: "/review", route: ReviewRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
