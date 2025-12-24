import { Schema } from "mongoose";
import { IAuthProvider, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: string },
    providerId: { type: string },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: string, required: true },
    email: { type: string, required: true, unique: true },
    password: { type: string },
    picture: { type: String },
    bio: { type: String },
    travelInterest: { type: String, required: true },
    visitedCountries: { type: String, required: true },
    currentLocation: { type: String },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    role: {
      type: string,
      enum: Object.values(Role),
      default: Role.USER,
    },

    auths: [authProviderSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
