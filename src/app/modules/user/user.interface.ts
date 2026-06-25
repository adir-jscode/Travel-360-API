import { Types } from "mongoose";
import { SUBSCRIPTION_PLAN } from "../subscriptionPlan/subscriptionPlan.interface";

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

export interface IUserSubscription {
  plan?: SUBSCRIPTION_PLAN;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface IAuthProvider {
  provider: "GOOGLE" | "CREDENTIAL";
  providerId: string;
}

export interface IReview {
  user: Types.ObjectId;
  description: string;
  createdAt: Date;
}

export interface IUserRating {
  user: Types.ObjectId;
  value: number;
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  bio?: string;
  travelInterest?: string[];
  visitedCountries?: string[];
  currentLocation?: string;
  isActive?: IsActive;
  isDeleted?: boolean;
  isVerified?: boolean;
  subscription: IUserSubscription;
  ratings?: IUserRating[];
  rating?: number;
  reviews?: IReview[];
  role: Role;
  auths: IAuthProvider[];
}
