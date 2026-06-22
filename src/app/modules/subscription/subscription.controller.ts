import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createSubscription = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    data: null,
  });
});
const getAllSubscription = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    data: null,
  });
});
const getUserSubscription = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    data: null,
  });
});
const updateSubscriptionStatus = catchAsync(
  async (req: Request, res: Response) => {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User logged in successfully",
      data: null,
    });
  },
);
const getSubscriptionById = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    data: null,
  });
});

export const SubscriptionControllers = {
  createSubscription,
  getAllSubscription,
  getUserSubscription,
  updateSubscriptionStatus,
  getSubscriptionById,
};
