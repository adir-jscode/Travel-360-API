/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TravelPlanServices } from "./travelPlan.service";

const generateTravelPlan = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.userId;
    if (!userId) {
      throw new AppError(401, "Unauthorized");
    }
    const aiPlan = await TravelPlanServices.generateTravelPlan(
      userId,
      req.body,
    );
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: " AI Plan generated successfully",
      data: aiPlan,
    });
  },
);
const createTravelPlan = catchAsync(async (req, res) => {
  const decodedToken = req.user as JwtPayload;

  const result = await TravelPlanServices.createTravelPlan(
    decodedToken.userId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Travel plan created successfully",
    data: result,
  });
});

const updateTravelPlan = catchAsync(async (req, res) => {
  const decodedToken = req.user as JwtPayload;

  const result = await TravelPlanServices.updateTravelPlan(
    decodedToken.userId,
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Travel plan updated successfully",
    data: result,
  });
});

const deleteTravelPlan = catchAsync(async (req, res) => {
  const decodedToken = req.user as JwtPayload;

  await TravelPlanServices.deleteTravelPlan(decodedToken.userId, req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Travel plan deleted successfully",
    data: null,
  });
});

const toggleVisibility = catchAsync(async (req, res) => {
  const decodedToken = req.user as JwtPayload;

  const result = await TravelPlanServices.toggleVisibility(
    decodedToken.userId,
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Visibility updated successfully",
    data: result,
  });
});

export const travelPlanControllers = {
  generateTravelPlan,
  createTravelPlan,
  updateTravelPlan,
  deleteTravelPlan,
  toggleVisibility,
};
