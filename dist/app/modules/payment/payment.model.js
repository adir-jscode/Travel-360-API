"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
const paymentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    subscription: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Subscription",
        required: true,
        index: true,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: Object.values(payment_interface_1.PAYMENT_STATUS),
        default: payment_interface_1.PAYMENT_STATUS.UNPAID,
    },
    paymentGatewayData: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    invoiceUrl: {
        type: String,
    },
    stripeSessionId: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
