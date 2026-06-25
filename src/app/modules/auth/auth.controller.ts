/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/serAuthCookie";
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
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User logged out successfully",
      data: null,
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

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user as JwtPayload;
    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Password Changed Successfully",
      data: null,
    });
  },
);

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    await AuthServices.forgotPassword(email);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Email Sent Successfully",
      data: null,
    });
  },
);

export const AuthControllers = {
  credentialLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  forgotPassword,
};
