import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { travelPlanControllers } from "./travelPlan.controller";
const router = Router();

router.post(
  "/travel-plans",
  checkAuth(Role.USER),
  travelPlanControllers.createTravelPlan,
);

router.patch(
  "/travel-plans/:id",
  checkAuth(Role.USER),
  travelPlanControllers.updateTravelPlan,
);

router.delete(
  "/travel-plans/:id",
  checkAuth(Role.USER),
  travelPlanControllers.deleteTravelPlan,
);

router.patch(
  "/travel-plans/:id/toggle-visibility",
  checkAuth(Role.USER),
  travelPlanControllers.toggleVisibility,
);

export const TravelPlanRoutes = router;
