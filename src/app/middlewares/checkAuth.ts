import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization || req.cookies.accessToken;
      //token exists or not
      if (!accessToken) {
        throw new AppError(403, "No Token Received");
      }
      //verify token
      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_SECRET,
      ) as JwtPayload;
      if (!verifiedToken) {
        throw new AppError(403, "Invalid Token");
      }
      //check for role
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to visit this route");
      }
      //set token to req object
      req.user = verifiedToken;
      //pass to next middleware
      next();
    } catch (error) {
      next(error);
    }
  };
