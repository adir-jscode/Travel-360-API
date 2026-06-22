import { stripe } from "../../config/stripe";
import AppError from "../../errorHelpers/AppError";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { SUBSCRIPTION_DURATION } from "../subscriptionPlan/subscriptionPlan.interface";
import { SubscriptionPlan } from "../subscriptionPlan/subscriptionPlan.model";
import { User } from "../user/user.model";
import { ISubscription, SUBSCRIPTION_STATUS } from "./subscription.interface";
import { Subscription } from "./subscription.model";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const createSubscription = async (
  payload: Partial<ISubscription>,
  userId: string,
  subscriptionPlanId: string,
) => {
  const transactionId = getTransactionId();
  // 1. Initialize today's date
  const currentDate = new Date();

  const oneYear = currentDate.setFullYear(currentDate.getFullYear() + 1);
  const oneMonth = currentDate.setMonth(currentDate.getMonth() + 1);

  const session = await User.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId);
    console.log(user);

    if (!user?.phone || !user.currentLocation) {
      throw new AppError(
        400,
        "Please Update Your Profile to get the subscription",
      );
    }

    const subscriptionPlan =
      await SubscriptionPlan.findById(subscriptionPlanId);
    if (!subscriptionPlan?.price) {
      throw new AppError(400, "No Price Found!");
    }

    const subscription = await Subscription.create(
      [
        {
          user: userId,
          subscriptionPlan: subscriptionPlan._id,
          status: SUBSCRIPTION_STATUS.PENDING,
          ...payload,
        },
      ],
      { session },
    );
    console.log(subscription);

    const payment = await Payment.create(
      [
        {
          user: userId,
          subscription: subscription[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId: transactionId,
          amount: subscriptionPlan.price,
        },
      ],
      { session },
    );

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      subscription[0]._id,
      {
        payment: payment[0]._id,
        paidAt: currentDate,
        expiresAt:
          subscriptionPlan.duration === SUBSCRIPTION_DURATION.MONTHLY
            ? oneMonth
            : oneYear,
      },
      { new: true, runValidators: true, session },
    )
      .populate("user", "name email phone address")
      .populate("subscriptionPlan", "title")
      .populate("payment");

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      customer_email: user.email,

      //success_url: `${envVars.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      success_url: "https://adir.pro.bd",
      //cancel_url: `${envVars.CLIENT_URL}/payment/cancel`,
      cancel_url: "https://adir.pro.bd/#projects",

      metadata: {
        userId: userId,
        paymentId: payment[0]._id.toString(),
        subscriptionId: subscription[0]._id.toString(),
        transactionId,
      },

      line_items: [
        {
          quantity: 1,

          price_data: {
            currency: "usd",

            unit_amount: subscriptionPlan.price * 100,

            product_data: {
              name: subscriptionPlan.title,
            },
          },
        },
      ],
    });

    await Payment.findByIdAndUpdate(
      payment[0]._id,
      {
        stripeSessionId: checkoutSession.id,
      },
      { session },
    );

    await session.commitTransaction(); //transaction
    session.endSession();
    return {
      subscription: updatedSubscription,
      checkoutUrl: checkoutSession.url,
    };
  } catch (error) {
    await session.abortTransaction(); // rollback
    session.endSession();
    // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
    throw error;
  }
};
export const SubscriptionServices = { createSubscription };
