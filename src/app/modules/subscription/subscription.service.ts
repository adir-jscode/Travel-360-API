import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { ISubscription, SUBSCRIPTION_STATUS } from "./subscription.interface";
import { Subscription } from "./subscription.model";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const createSubscription = async (
  payload: Partial<ISubscription>,
  userId: string,
) => {
  const transactionId = getTransactionId();
  const session = await User.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId);

    if (!user?.phone || !user.currentLocation) {
      throw new AppError(
        400,
        "Please Update Your Profile to get the subscription",
      );
    }

    const subscription = await Subscription.create(
      [
        {
          user: userId,
          status: SUBSCRIPTION_STATUS.PENDING,
          ...payload,
        },
      ],
      { session },
    );

    //  const payment = await Payment.create([{
    //         booking: subscription[0]._id,
    //         status: PAYMENT_STATUS.UNPAID,
    //         transactionId: transactionId,
    //         amount: amount
    //     }], { session })
    await session.commitTransaction(); //transaction
    session.endSession();
  } catch (error) {
    await session.abortTransaction(); // rollback
    session.endSession();
    // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
    throw error;
  }
};
export const SubscriptionServices = { createSubscription };
