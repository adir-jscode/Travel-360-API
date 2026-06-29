"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelPlanRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interface_1 = require("../user/user.interface");
const travelPlan_controller_1 = require("./travelPlan.controller");
const travelPlan_validation_1 = require("./travelPlan.validation");
const router = (0, express_1.Router)();
//ai plan
router.post("/ai-travel-plans", (0, validateRequest_1.validateRequest)(travelPlan_validation_1.createAiTravelPlanZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), travelPlan_controller_1.travelPlanControllers.generateTravelPlan);
//create plan
router.post("/travel-plans", (0, validateRequest_1.validateRequest)(travelPlan_validation_1.createTravelPlanZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), travelPlan_controller_1.travelPlanControllers.createTravelPlan);
//update plan
router.patch("/travel-plans/:id", (0, validateRequest_1.validateRequest)(travelPlan_validation_1.updateTravelPlanZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), travelPlan_controller_1.travelPlanControllers.updateTravelPlan);
//delete plan
router.delete("/travel-plans/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), travelPlan_controller_1.travelPlanControllers.deleteTravelPlan);
//toggle public to private
router.patch("/travel-plans/:id/toggle-visibility", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), travelPlan_controller_1.travelPlanControllers.toggleVisibility);
//get all travel plans
router.get("/travel-plans", 
//checkAuth(Role.USER, Role.ADMIN),
travelPlan_controller_1.travelPlanControllers.getAllTravelPlans);
//my travel plan
router.get("/my-travel-plans", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), 
// requirePremium(),
travelPlan_controller_1.travelPlanControllers.getMyTravelPlans);
router.get("/travel-plans/:id", travelPlan_controller_1.travelPlanControllers.getTravelPlansById);
exports.TravelPlanRoutes = router;
