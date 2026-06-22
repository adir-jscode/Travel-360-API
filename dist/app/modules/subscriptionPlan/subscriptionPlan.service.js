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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const subscriptionPlan_model_1 = require("./subscriptionPlan.model");
const createSubscriptionPlan = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield subscriptionPlan_model_1.SubscriptionPlan.findOne({
        name: payload.name,
    });
    if (existing) {
        throw new AppError_1.default(409, "Subscription plan already exists");
    }
    return yield subscriptionPlan_model_1.SubscriptionPlan.create(payload);
});
const getAllSubscriptionPlans = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield subscriptionPlan_model_1.SubscriptionPlan.find().sort({
        sortOrder: 1,
    });
});
const getSingleSubscriptionPlan = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const plan = yield subscriptionPlan_model_1.SubscriptionPlan.findById(id);
    if (!plan) {
        throw new AppError_1.default(404, "Subscription plan not found");
    }
    return plan;
});
const updateSubscriptionPlan = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const plan = yield subscriptionPlan_model_1.SubscriptionPlan.findById(id);
    if (!plan) {
        throw new AppError_1.default(404, "Subscription plan not found");
    }
    return yield subscriptionPlan_model_1.SubscriptionPlan.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
});
const deleteSubscriptionPlan = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const plan = yield subscriptionPlan_model_1.SubscriptionPlan.findById(id);
    if (!plan) {
        throw new AppError_1.default(404, "Subscription plan not found");
    }
    yield subscriptionPlan_model_1.SubscriptionPlan.findByIdAndDelete(id);
    return null;
});
exports.SubscriptionPlanServices = {
    createSubscriptionPlan,
    getAllSubscriptionPlans,
    getSingleSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
};
