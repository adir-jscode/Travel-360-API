import { Types } from "mongoose";

export enum PAYMENT_STATUS {
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PAYMENT_TYPE {
  SUBSCRIPTION = "SUBSCRIPTION",
  VERIFIED_BADGE = "VERIFIED_BADGE",
}

export interface IPayment {
  user: Types.ObjectId;
  subscription: Types.ObjectId;
  transactionId: string;
  //paymentType: PAYMENT_TYPE;
  amount: number;
  status: PAYMENT_STATUS;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentGatewayData?: any;
  invoiceUrl?: string;
  stripeSessionId?: string;
}
