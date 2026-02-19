/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { setAuthCookie } from "../../../utils/serAuthCookie";
import AppError from "../../errorHelpers/AppError";
import { AuthServices } from "./auth.service";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialLogin(req.body);

    setAuthCookie(res, loginInfo);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User logged in successfully",
      data: loginInfo,
    });
  },
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(400, "Refresh token is not received from cookies!");
    }
    const newAccessToken = await AuthServices.getNewAccessToken(refreshToken);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "New Access Token Issued",
      data: newAccessToken,
    });
  },
);

export const AuthControllers = { credentialLogin, getNewAccessToken };
