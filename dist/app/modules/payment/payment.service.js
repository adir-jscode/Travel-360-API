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
exports.PaymentServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const subscription_interface_1 = require("../subscription/subscription.interface");
const subscription_model_1 = require("../subscription/subscription.model");
const subscriptionPlan_model_1 = require("../subscriptionPlan/subscriptionPlan.model");
const user_model_1 = require("../user/user.model");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const paymentSuccess = (stripeSession) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Mongo ready state:", mongoose_1.default.connection.readyState);
    console.log("Mongo host:", mongoose_1.default.connection.host);
    const metadata = stripeSession.metadata;
    if (!metadata) {
        throw new AppError_1.default(400, "Stripe metadata missing");
    }
    if (!metadata.paymentId || !metadata.subscriptionId) {
        throw new AppError_1.default(400, "Invalid Stripe session metadata");
    }
    const session = yield payment_model_1.Payment.startSession();
    try {
        session.startTransaction();
        const { paymentId, subscriptionId } = metadata;
        const payment = yield payment_model_1.Payment.findById(paymentId).session(session);
        if (!payment) {
            throw new AppError_1.default(404, "Payment not found");
        }
        /**
         * Prevent duplicate webhook processing
         */
        if (payment.status === payment_interface_1.PAYMENT_STATUS.PAID) {
            yield session.commitTransaction();
            return;
        }
        const subscription = yield subscription_model_1.Subscription.findById(subscriptionId).session(session);
        if (!subscription) {
            throw new AppError_1.default(404, "Subscription not found");
        }
        const user = yield user_model_1.User.findById(metadata.userId).session(session);
        if (!user) {
            throw new AppError_1.default(404, "User not found");
        }
        const subscriptionPlan = yield subscriptionPlan_model_1.SubscriptionPlan.findById(subscription.subscriptionPlan).session(session);
        if (!subscriptionPlan) {
            throw new AppError_1.default(404, "Subscription plan not found");
        }
        const now = new Date();
        const expiresAt = new Date();
        if (subscription.plan === subscription_interface_1.SUBSCRIPTION_PLAN.MONTHLY) {
            expiresAt.setMonth(expiresAt.getMonth() + 1);
        }
        if (subscription.plan === subscription_interface_1.SUBSCRIPTION_PLAN.YEARLY) {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }
        // Payment Update
        payment.status = payment_interface_1.PAYMENT_STATUS.PAID;
        payment.paymentGatewayData = stripeSession;
        yield payment.save({ session });
        // Subscription Update
        subscription.status = subscription_interface_1.SUBSCRIPTION_STATUS.COMPLETE;
        subscription.paidAt = now;
        subscription.expiresAt = expiresAt;
        yield subscription.save({
            session,
        });
        // User Update
        user.subscription = {
            plan: subscriptionPlan.name,
            startDate: now,
            endDate: expiresAt,
            isActive: true,
        };
        yield user.save({ session });
        yield session.commitTransaction();
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const getMyPayments = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ userId });
    const payments = yield payment_model_1.Payment.find({ user: userId })
        .populate({
        path: "subscription",
        select: "plan status paidAt expiresAt subscriptionPlan",
        populate: {
            path: "subscriptionPlan",
            select: "name title price duration",
        },
    })
        .sort({ createdAt: -1 });
    console.log({ payments });
    return payments;
});
exports.PaymentServices = { paymentSuccess, getMyPayments };
