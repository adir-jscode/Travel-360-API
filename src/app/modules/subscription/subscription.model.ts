import { model, Schema } from "mongoose";
import {
  ISubscription,
  SUBSCRIPTION_PLAN,
  SUBSCRIPTION_STATUS,
} from "./subscription.interface";

const subscriptionSchema = new Schema<ISubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    plan: {
      type: String,
      enum: Object.values(SUBSCRIPTION_PLAN),
      default: SUBSCRIPTION_PLAN.MONTHLY,
    },
    paidAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(SUBSCRIPTION_STATUS),
      default: SUBSCRIPTION_STATUS.PENDING,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Subscription = model<ISubscription>(
  "Subscription",
  subscriptionSchema,
);
