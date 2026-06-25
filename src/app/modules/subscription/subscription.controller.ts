import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SubscriptionServices } from "./subscription.service";

const createSubscription = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const userId = decodedToken.userId;
  const subscriptionPlanId = req.params.id;
  const subscription = await SubscriptionServices.createSubscription(
    // req.body,
    userId,
    subscriptionPlanId,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Subscribed successfully",
    data: subscription,
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
