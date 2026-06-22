import { Types } from "mongoose";

export enum SUBSCRIPTION_PLAN {
  EXPLORER = "EXPLORER",
  WANDERER = "WANDERER",
  VOYAGER = "VOYAGER",
}

export enum SUBSCRIPTION_DURATION {
  FOREVER = "FOREVER",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export interface ISubscriptionPlan {
  _id?: Types.ObjectId;

  name: SUBSCRIPTION_PLAN;

  title: string;

  description: string;

  price: number;

  duration: SUBSCRIPTION_DURATION;

  features: string[];

  isActive: boolean;

  badge?: string;

  sortOrder: number;
}
