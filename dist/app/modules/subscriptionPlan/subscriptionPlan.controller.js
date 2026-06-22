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
exports.SubscriptionPlanControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const subscriptionPlan_service_1 = require("./subscriptionPlan.service");
const createSubscriptionPlan = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscriptionPlan_service_1.SubscriptionPlanServices.createSubscriptionPlan(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Subscription plan created successfully",
        data: result,
    });
}));
const getAllSubscriptionPlans = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscriptionPlan_service_1.SubscriptionPlanServices.getAllSubscriptionPlans();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Subscription plans retrieved successfully",
        data: result,
    });
}));
const getSingleSubscriptionPlan = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscriptionPlan_service_1.SubscriptionPlanServices.getSingleSubscriptionPlan(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Subscription plan retrieved successfully",
        data: result,
    });
}));
const updateSubscriptionPlan = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscriptionPlan_service_1.SubscriptionPlanServices.updateSubscriptionPlan(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Subscription plan updated successfully",
        data: result,
    });
}));
const deleteSubscriptionPlan = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield subscriptionPlan_service_1.SubscriptionPlanServices.deleteSubscriptionPlan(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Subscription plan deleted successfully",
        data: null,
    });
}));
exports.SubscriptionPlanControllers = {
    createSubscriptionPlan,
    getAllSubscriptionPlans,
    getSingleSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
};
