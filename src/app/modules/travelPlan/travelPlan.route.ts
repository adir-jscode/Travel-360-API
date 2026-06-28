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

//ai plan
router.post(
  "/ai-travel-plans",
  validateRequest(createAiTravelPlanZodSchema),
  checkAuth(Role.USER),
  travelPlanControllers.generateTravelPlan,
);

//create plan
router.post(
  "/travel-plans",
  validateRequest(createTravelPlanZodSchema),
  checkAuth(Role.USER),
  travelPlanControllers.createTravelPlan,
);
//update plan
router.patch(
  "/travel-plans/:id",
  validateRequest(updateTravelPlanZodSchema),
  checkAuth(Role.USER),
  travelPlanControllers.updateTravelPlan,
);
//delete plan
router.delete(
  "/travel-plans/:id",
  checkAuth(Role.USER),
  travelPlanControllers.deleteTravelPlan,
);
//toggle public to private
router.patch(
  "/travel-plans/:id/toggle-visibility",
  checkAuth(Role.USER),
  travelPlanControllers.toggleVisibility,
);

//get all travel plans
router.get(
  "/travel-plans",
  checkAuth(Role.USER, Role.ADMIN),
  travelPlanControllers.getAllTravelPlans,
);
//my travel plan
router.get(
  "/my-travel-plans",
  checkAuth(Role.USER),
  // requirePremium(),
  travelPlanControllers.getMyTravelPlans,
);
router.get("/travel-plans/:id", travelPlanControllers.getTravelPlansById);

export const TravelPlanRoutes = router;
