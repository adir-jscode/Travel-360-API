"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = require("mongoose");
const subscription_interface_1 = require("./subscription.interface");
const subscriptionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subscriptionPlan: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
        required: true,
    },
    payment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Payment",
        required: true,
    },
    plan: {
        type: String,
        enum: Object.values(subscription_interface_1.SUBSCRIPTION_PLAN),
        default: subscription_interface_1.SUBSCRIPTION_PLAN.MONTHLY,
    },
    paidAt: {
        type: Date,
    },
    expiresAt: {
        type: Date,
    },
    status: {
        type: String,
        enum: Object.values(subscription_interface_1.SUBSCRIPTION_STATUS),
        default: subscription_interface_1.SUBSCRIPTION_STATUS.PENDING,
    },
}, { timestamps: true, versionKey: false });
exports.Subscription = (0, mongoose_1.model)("Subscription", subscriptionSchema);
