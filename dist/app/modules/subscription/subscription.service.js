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
exports.SubscriptionServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const subscriptionPlan_interface_1 = require("../subscriptionPlan/subscriptionPlan.interface");
const subscriptionPlan_model_1 = require("../subscriptionPlan/subscriptionPlan.model");
const user_model_1 = require("../user/user.model");
const subscription_interface_1 = require("./subscription.interface");
const subscription_model_1 = require("./subscription.model");
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
const createSubscription = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = getTransactionId();
    // 1. Initialize today's date
    const currentDate = new Date();
    const oneYear = currentDate.setFullYear(currentDate.getFullYear() + 1);
    const oneMonth = currentDate.setMonth(currentDate.getMonth() + 1);
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!(user === null || user === void 0 ? void 0 : user.phone) || !user.currentLocation) {
            throw new AppError_1.default(400, "Please Update Your Profile to get the subscription");
        }
        const subscriptionPlan = yield subscriptionPlan_model_1.SubscriptionPlan.findById(payload.subscriptionPlan);
        if (!(subscriptionPlan === null || subscriptionPlan === void 0 ? void 0 : subscriptionPlan.price)) {
            throw new AppError_1.default(400, "No Price Found!");
        }
        const subscription = yield subscription_model_1.Subscription.create([
            Object.assign({ user: userId, status: subscription_interface_1.SUBSCRIPTION_STATUS.PENDING }, payload),
        ], { session });
        const payment = yield payment_model_1.Payment.create([
            {
                subscription: subscription[0]._id,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                transactionId: transactionId,
                amount: subscriptionPlan.price,
            },
        ], { session });
        const updatedSubscription = yield subscription_model_1.Subscription.findByIdAndUpdate(subscription[0]._id, {
            payment: payment[0]._id,
            paidAt: currentDate,
            expiresAt: subscriptionPlan.duration === subscriptionPlan_interface_1.SUBSCRIPTION_DURATION.MONTHLY
                ? oneMonth
                : oneYear,
        }, { new: true, runValidators: true, session })
            .populate("user", "name email phone address")
            .populate("subscriptionPlan", "title")
            .populate("payment");
        console.log(updatedSubscription);
        yield session.commitTransaction(); //transaction
        session.endSession();
        return {
            subscription: updatedSubscription,
        };
    }
    catch (error) {
        yield session.abortTransaction(); // rollback
        session.endSession();
        // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
        throw error;
    }
});
exports.SubscriptionServices = { createSubscription };
