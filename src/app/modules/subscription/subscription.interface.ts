import { Types } from "mongoose";

export enum SUBSCRIPTION_STATUS {
  PENDING = "PENDING",
  CANCEL = "CANCEL",
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
}

export enum SUBSCRIPTION_PLAN {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}
export interface ISubscription {
  user: Types.ObjectId; //decoded
  subscriptionPlan: Types.ObjectId;
  payment?: Types.ObjectId;
  plan?: SUBSCRIPTION_PLAN; // input
  paidAt?: Date; // generate
  expiresAt?: Date; // generate
  status: SUBSCRIPTION_STATUS;
}
