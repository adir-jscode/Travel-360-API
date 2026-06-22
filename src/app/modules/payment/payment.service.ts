import Stripe from "stripe";
import AppError from "../../errorHelpers/AppError";
import {
  SUBSCRIPTION_PLAN,
  SUBSCRIPTION_STATUS,
} from "../subscription/subscription.interface";
import { Subscription } from "../subscription/subscription.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const paymentSuccess = async (stripeSession: Stripe.Checkout.Session) => {
  const metadata = stripeSession.metadata;
  console.log("on the service");
  if (!metadata) {
    throw new AppError(400, "Stripe metadata missing");
  }
  if (!metadata?.paymentId || !metadata?.subscriptionId) {
    throw new AppError(400, "Invalid Stripe session metadata");
  }

  const { paymentId, subscriptionId } = metadata;
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new AppError(400, "No payment Found!");
  }

  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    throw new AppError(404, "No payment Found!");
  }

  if (payment?.status === PAYMENT_STATUS.PAID) {
    return;
  }
  payment.status = PAYMENT_STATUS.PAID;

  payment.paymentGatewayData = stripeSession;

  await payment.save();

  console.log("payment data saved!!");
  const now = new Date();

  const expiresAt = new Date();

  if (subscription?.plan === SUBSCRIPTION_PLAN.MONTHLY) {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  }
  if (subscription?.plan === SUBSCRIPTION_PLAN.YEARLY) {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  }
  subscription.status = SUBSCRIPTION_STATUS.COMPLETE;

  subscription.paidAt = now;

  subscription.expiresAt = expiresAt;

  await subscription.save();

  console.log("subs data saved!!");
};

export const PaymentServices = { paymentSuccess };
