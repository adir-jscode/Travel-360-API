import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { travelPlanControllers } from "./travelPlan.controller";
import {
  createAiTravelPlanZodSchema,
  createTravelPlanZodSchema,
  updateTravelPlanZodSchema,
} from "./travelPlan.validation";
const router = Router();
router.post(
  "/ai-travel-plans",
  validateRequest(createAiTravelPlanZodSchema),
  checkAuth(Role.USER),
  travelPlanControllers.generateTravelPlan,
);
router.post(
  "/travel-plans",
  validateRequest(createTravelPlanZodSchema),
  checkAuth(Role.USER),
  travelPlanControllers.createTravelPlan,
);

router.patch(
  "/travel-plans/:id",
  validateRequest(updateTravelPlanZodSchema),
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

router.get(
  "/travel-plans",
  checkAuth(Role.USER, Role.ADMIN),
  travelPlanControllers.getAllTravelPlans,
);

export const TravelPlanRoutes = router;
