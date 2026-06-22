import { Types } from "mongoose";

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
  ratings?: IUserRating[];
  rating?: number;
  reviews?: IReview[];
  role: Role;
  auths: IAuthProvider[];
}
