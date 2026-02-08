/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { UserServices } from "./user.service";

//register user
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User created successfully",
      data: user,
    });
  },
);

// user profile
const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;
    const profile = await UserServices.getUserProfile(userId);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User profile fetched successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const UserControllers = {
  createUser,
  getUserProfile,
};
