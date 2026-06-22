import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { SubscriptionPlanRoutes } from "../modules/subscriptionPlan/subscriptionPlan.route";
import { TravelPlanRoutes } from "../modules/travelPlan/travelPlan.route";
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
