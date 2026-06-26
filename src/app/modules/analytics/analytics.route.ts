import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AnalyticsController } from "./analytics.controller";
const router = express.Router();
router.get("/user", checkAuth(Role.ADMIN), AnalyticsController.getUserStats);

export const AnalyticsRoutes = router;
