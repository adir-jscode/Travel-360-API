import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AnalyticsServices } from "./analytics.service";

const getUserStats = catchAsync(async (_req, res) => {
  const data = await AnalyticsServices.getUserStats();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User analytics",
    data,
  });
});

const getTravelPlanStats = catchAsync(async (_req, res) => {
  const data = await AnalyticsServices.getTravelPlanStats();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Travel plan analytics",
    data,
  });
});

const getPaymentStats = catchAsync(async (_req, res) => {
  const data = await AnalyticsServices.getPaymentStats();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment analytics",
    data,
  });
});

const getSubscriptionStats = catchAsync(async (_req, res) => {
  const data = await AnalyticsServices.getSubscriptionStats();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Subscription analytics",
    data,
  });
});

const getTripStats = catchAsync(async (_req, res) => {
  const data = await AnalyticsServices.getTripStats();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Trip analytics",
    data,
  });
});

const getReviewStats = catchAsync(async (_req, res) => {
  const data = await AnalyticsServices.getReviewStats();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Review analytics",
    data,
  });
});

const getJoinRequestStats = catchAsync(async (_req, res) => {
  const data = await AnalyticsServices.getJoinRequestStats();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Join request analytics",
    data,
  });
});

const getDashboardSummary = catchAsync(async (_req, res) => {
  const data = await AnalyticsServices.getDashboardSummary();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard summary",
    data,
  });
});

export const AnalyticsController = {
  getUserStats,
  getTravelPlanStats,
  getPaymentStats,
  getSubscriptionStats,
  getTripStats,
  getReviewStats,
  getJoinRequestStats,
  getDashboardSummary,
};
