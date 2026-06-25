import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";

export const requirePremium = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.userId;
    const user = await User.findById(userId);

    if (!user?.subscription?.isActive) {
      throw new AppError(403, "Premium subscription required");
    }

    next();
  };
};
