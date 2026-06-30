import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import Stripe from "stripe";
import { envVars } from "../../config/env";
import { stripe } from "../../config/stripe";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  if (!sig || Array.isArray(sig)) {
    throw new AppError(400, "Stripe signature missing");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      envVars.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    throw new AppError(400, "Webhook signature verification failed");
  }

  switch (event.type) {
    case "checkout.session.completed":
      await PaymentServices.paymentSuccess(
        event.data.object as Stripe.Checkout.Session,
      );
      break;

    default:
      break;
  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Stripe webhook processed successfully",
    data: {
      eventType: event.type,
    },
  });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const payments = await PaymentServices.getMyPayments(decodedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment history retrieved successfully",
    data: payments,
  });
});
export const PaymentControllers = { handleWebhook, getMyPayments };
