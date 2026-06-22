"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubscriptionPlanZodSchema = exports.createSubscriptionPlanZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const subscriptionPlan_interface_1 = require("./subscriptionPlan.interface");
exports.createSubscriptionPlanZodSchema = zod_1.default.object({
    name: zod_1.default.enum(subscriptionPlan_interface_1.SUBSCRIPTION_PLAN),
    title: zod_1.default.string().min(2, "Title must be at least 2 characters long").max(50),
    description: zod_1.default
        .string()
        .min(10, "Description must be at least 10 characters long")
        .max(500),
    price: zod_1.default.number().min(0),
    duration: zod_1.default.nativeEnum(subscriptionPlan_interface_1.SUBSCRIPTION_DURATION),
    features: zod_1.default
        .array(zod_1.default.string().min(1))
        .min(1, "At least one feature is required"),
    badge: zod_1.default.string().optional(),
    isActive: zod_1.default.boolean().optional(),
    sortOrder: zod_1.default.number().int().optional(),
});
exports.updateSubscriptionPlanZodSchema = exports.createSubscriptionPlanZodSchema.partial();
