import z from "zod";
import {
  SUBSCRIPTION_DURATION,
  SUBSCRIPTION_PLAN,
} from "./subscriptionPlan.interface";

export const createSubscriptionPlanZodSchema = z.object({
  name: z.enum(SUBSCRIPTION_PLAN),

  title: z.string().min(2, "Title must be at least 2 characters long").max(50),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(500),

  price: z.number().min(0),

  duration: z.nativeEnum(SUBSCRIPTION_DURATION),

  features: z
    .array(z.string().min(1))
    .min(1, "At least one feature is required"),

  badge: z.string().optional(),

  isActive: z.boolean().optional(),

  sortOrder: z.number().int().optional(),
});

export const updateSubscriptionPlanZodSchema =
  createSubscriptionPlanZodSchema.partial();
