/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { TravelPlanServices } from "./travelPlan.service";

const generateTravelPlan = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { destination, days } = req.body;
    const aiPlan = await TravelPlanServices.generateTravelPlan(
      destination,
      days,
    );
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: " AI Plan generated successfully",
      data: aiPlan,
    });
  },
);

export const travelPlanControllers = { generateTravelPlan };
