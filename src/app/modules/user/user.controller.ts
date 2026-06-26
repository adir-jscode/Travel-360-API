/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IUser } from "./user.interface";
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
    const userId = req.params.id || (req.user as JwtPayload).userId;
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

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const payload: IUser = {
      ...req.body,
      picture: req.file?.path,
    };
    const updatedUserInfo = await UserServices.updateUser(
      payload,
      decodedToken,
    );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User information updated successfully",
      data: updatedUserInfo,
    });
  },
);

const giveRating = catchAsync(async (req: Request, res: Response) => {
  const reviewerId = (req.user as JwtPayload).userId;

  const targetUserId = req.params.id;

  const { value } = req.body;

  const result = await UserServices.giveRating(targetUserId, reviewerId, value);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Rating submitted successfully",
    data: result,
  });
});

const giveReview = catchAsync(async (req: Request, res: Response) => {
  const reviewerId = (req.user as JwtPayload).userId;

  const targetUserId = req.params.id;

  const { description } = req.body;

  const result = await UserServices.giveReview(
    targetUserId,
    reviewerId,
    description,
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Review submitted successfully",
    data: result,
  });
});

const getAverageRating = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAverageRating(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Average rating retrieved successfully",
    data: result,
  });
});

const getRecentReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getRecentReviews(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query || "";
  const result = await UserServices.getAllUsers(
    query as Record<string, string>,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All Users retrieved successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.deleteUser(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: result,
  });
});
export const UserControllers = {
  createUser,
  getUserProfile,
  updateUser,
  deleteUser,
  giveRating,
  giveReview,
  getAverageRating,
  getRecentReviews,
  getAllUsers,
};
