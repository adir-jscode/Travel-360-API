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
exports.PaymentControllers = void 0;
const env_1 = require("../../config/env");
const stripe_1 = require("../../config/stripe");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const payment_service_1 = require("./payment.service");
const handleWebhook = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers["stripe-signature"];
    if (!sig || Array.isArray(sig)) {
        throw new AppError_1.default(400, "Stripe signature missing");
    }
    let event;
    try {
        event = stripe_1.stripe.webhooks.constructEvent(req.body, sig, env_1.envVars.STRIPE_WEBHOOK_SECRET);
    }
    catch (_a) {
        throw new AppError_1.default(400, "Webhook signature verification failed");
    }
    switch (event.type) {
        case "checkout.session.completed":
            yield payment_service_1.PaymentServices.paymentSuccess(event.data.object);
            break;
        default:
            break;
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Stripe webhook processed successfully",
        data: {
            eventType: event.type,
        },
    });
}));
exports.PaymentControllers = { handleWebhook };
