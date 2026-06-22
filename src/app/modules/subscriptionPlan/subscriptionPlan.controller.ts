import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SubscriptionPlanServices } from "./subscriptionPlan.service";

const createSubscriptionPlan = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionPlanServices.createSubscriptionPlan(
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Subscription plan created successfully",
      data: result,
    });
  },
);

const getAllSubscriptionPlans = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionPlanServices.getAllSubscriptionPlans();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Subscription plans retrieved successfully",
      data: result,
    });
  },
);

const getSingleSubscriptionPlan = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionPlanServices.getSingleSubscriptionPlan(
      req.params.id,
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Subscription plan retrieved successfully",
      data: result,
    });
  },
);

const updateSubscriptionPlan = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionPlanServices.updateSubscriptionPlan(
      req.params.id,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Subscription plan updated successfully",
      data: result,
    });
  },
);

const deleteSubscriptionPlan = catchAsync(
  async (req: Request, res: Response) => {
    await SubscriptionPlanServices.deleteSubscriptionPlan(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Subscription plan deleted successfully",
      data: null,
    });
  },
);

export const SubscriptionPlanControllers = {
  createSubscriptionPlan,
  getAllSubscriptionPlans,
  getSingleSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
};
