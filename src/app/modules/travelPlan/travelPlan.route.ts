import { Router } from "express";
import { travelPlanControllers } from "./travelPlan.controller";
const router = Router();

router.post("/ai-travel", travelPlanControllers.generateTravelPlan);

export const TravelPlanRoutes = router;
