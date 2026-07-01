import mongoose from "mongoose";
import Stripe from "stripe";
import AppError from "../../errorHelpers/AppError";
import {
  SUBSCRIPTION_PLAN,
  SUBSCRIPTION_STATUS,
} from "../subscription/subscription.interface";
import { Subscription } from "../subscription/subscription.model";
import { SubscriptionPlan } from "../subscriptionPlan/subscriptionPlan.model";
import { User } from "../user/user.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const paymentSuccess = async (stripeSession: Stripe.Checkout.Session) => {
  console.log("Mongo ready state:", mongoose.connection.readyState);
  console.log("Mongo host:", mongoose.connection.host);
  const metadata = stripeSession.metadata;

  if (!metadata) {
    throw new AppError(400, "Stripe metadata missing");
  }

  if (!metadata.paymentId || !metadata.subscriptionId) {
    throw new AppError(400, "Invalid Stripe session metadata");
  }

  const session = await Payment.startSession();

  try {
    session.startTransaction();

    const { paymentId, subscriptionId } = metadata;

    const payment = await Payment.findById(paymentId).session(session);

    if (!payment) {
      throw new AppError(404, "Payment not found");
    }

    /**
     * Prevent duplicate webhook processing
     */
    if (payment.status === PAYMENT_STATUS.PAID) {
      await session.commitTransaction();
      return;
    }

    const subscription =
      await Subscription.findById(subscriptionId).session(session);

    if (!subscription) {
      throw new AppError(404, "Subscription not found");
    }

    const user = await User.findById(metadata.userId).session(session);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const subscriptionPlan = await SubscriptionPlan.findById(
      subscription.subscriptionPlan,
    ).session(session);

    if (!subscriptionPlan) {
      throw new AppError(404, "Subscription plan not found");
    }

    const now = new Date();
    const expiresAt = new Date();

    if (subscription.plan === SUBSCRIPTION_PLAN.MONTHLY) {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    if (subscription.plan === SUBSCRIPTION_PLAN.YEARLY) {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    // Payment Update
    payment.status = PAYMENT_STATUS.PAID;
    payment.paymentGatewayData = stripeSession;

    await payment.save({ session });

    // Subscription Update
    subscription.status = SUBSCRIPTION_STATUS.COMPLETE;

    subscription.paidAt = now;
    subscription.expiresAt = expiresAt;

    await subscription.save({
      session,
    });

    // User Update
    user.subscription = {
      plan: subscriptionPlan.name,
      startDate: now,
      endDate: expiresAt,
      isActive: true,
    };

    await user.save({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getMyPayments = async (userId: string) => {
  console.log({ userId });
  const payments = await Payment.find({ user: userId })
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
};

export const PaymentServices = { paymentSuccess, getMyPayments };
