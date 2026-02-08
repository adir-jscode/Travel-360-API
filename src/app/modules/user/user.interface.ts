export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IAuthProvider {
  provider: "GOOGLE" | "CREDENTIAL";
  providerId: string;
}
export interface IUser {
  name: string;
  email: string;
  password?: string;
  picture?: string;
  bio?: string;
  travelInterest?: string[];
  visitedCountries?: string[];
  currentLocation: string;
  isActive?: IsActive;
  isVerified?: boolean;
  isPremium?: boolean;
  avgRating?: number;
  reviewCount?: number;
  role: Role;
  auths: IAuthProvider[];
}
