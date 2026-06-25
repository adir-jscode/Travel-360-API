"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interface_1 = require("../user/user.interface");
const subscriptionPlan_controller_1 = require("./subscriptionPlan.controller");
const subscriptionPlan_validation_1 = require("./subscriptionPlan.validation");
const router = express_1.default.Router();
router.post("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(subscriptionPlan_validation_1.createSubscriptionPlanZodSchema), subscriptionPlan_controller_1.SubscriptionPlanControllers.createSubscriptionPlan);
router.get("/", subscriptionPlan_controller_1.SubscriptionPlanControllers.getAllSubscriptionPlans);
router.get("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), subscriptionPlan_controller_1.SubscriptionPlanControllers.getSingleSubscriptionPlan);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(subscriptionPlan_validation_1.updateSubscriptionPlanZodSchema), subscriptionPlan_controller_1.SubscriptionPlanControllers.updateSubscriptionPlan);
router.delete("/:id", subscriptionPlan_controller_1.SubscriptionPlanControllers.deleteSubscriptionPlan);
exports.SubscriptionPlanRoutes = router;
