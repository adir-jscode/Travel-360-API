"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const analytics_service_1 = require("./analytics.service");
const getUserStats = (0, catchAsync_1.catchAsync)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield analytics_service_1.AnalyticsServices.getUserStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "User analytics",
        data,
    });
}));
const getTravelPlanStats = (0, catchAsync_1.catchAsync)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield analytics_service_1.AnalyticsServices.getTravelPlanStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Travel plan analytics",
        data,
    });
}));
const getPaymentStats = (0, catchAsync_1.catchAsync)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield analytics_service_1.AnalyticsServices.getPaymentStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Payment analytics",
        data,
    });
}));
const getSubscriptionStats = (0, catchAsync_1.catchAsync)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield analytics_service_1.AnalyticsServices.getSubscriptionStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Subscription analytics",
        data,
    });
}));
const getTripStats = (0, catchAsync_1.catchAsync)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield analytics_service_1.AnalyticsServices.getTripStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Trip analytics",
        data,
    });
}));
const getReviewStats = (0, catchAsync_1.catchAsync)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield analytics_service_1.AnalyticsServices.getReviewStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Review analytics",
        data,
    });
}));
const getJoinRequestStats = (0, catchAsync_1.catchAsync)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield analytics_service_1.AnalyticsServices.getJoinRequestStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Join request analytics",
        data,
    });
}));
const getDashboardSummary = (0, catchAsync_1.catchAsync)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield analytics_service_1.AnalyticsServices.getDashboardSummary();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Dashboard summary",
        data,
    });
}));
exports.AnalyticsController = {
    getUserStats,
    getTravelPlanStats,
    getPaymentStats,
    getSubscriptionStats,
    getTripStats,
    getReviewStats,
    getJoinRequestStats,
    getDashboardSummary,
};
