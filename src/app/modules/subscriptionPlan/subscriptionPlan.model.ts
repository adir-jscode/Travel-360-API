import mongoose, { model } from "mongoose";
import {
  ISubscriptionPlan,
  SUBSCRIPTION_DURATION,
  SUBSCRIPTION_PLAN,
} from "./subscriptionPlan.interface";

const subscriptionPlanSchema = new mongoose.Schema<ISubscriptionPlan>(
  {
    name: {
      type: String,
      enum: Object.values(SUBSCRIPTION_PLAN),
      default: SUBSCRIPTION_PLAN.EXPLORER,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: String,
      enum: Object.values(SUBSCRIPTION_DURATION),
      required: true,
    },

    features: {
      type: [String],
      default: [],
    },

    badge: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SubscriptionPlan = model<ISubscriptionPlan>(
  "SubscriptionPlan",
  subscriptionPlanSchema,
);
