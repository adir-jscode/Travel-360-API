import AppError from "../../errorHelpers/AppError";
import { ISubscriptionPlan } from "./subscriptionPlan.interface";
import { SubscriptionPlan } from "./subscriptionPlan.model";

const createSubscriptionPlan = async (payload: ISubscriptionPlan) => {
  const existing = await SubscriptionPlan.findOne({
    name: payload.name,
  });

  if (existing) {
    throw new AppError(409, "Subscription plan already exists");
  }

  return await SubscriptionPlan.create(payload);
};

const getAllSubscriptionPlans = async () => {
  return await SubscriptionPlan.find().sort({
    sortOrder: 1,
  });
};

const getSingleSubscriptionPlan = async (id: string) => {
  const plan = await SubscriptionPlan.findById(id);

  if (!plan) {
    throw new AppError(404, "Subscription plan not found");
  }

  return plan;
};

const updateSubscriptionPlan = async (
  id: string,
  payload: Partial<ISubscriptionPlan>,
) => {
  const plan = await SubscriptionPlan.findById(id);

  if (!plan) {
    throw new AppError(404, "Subscription plan not found");
  }

  return await SubscriptionPlan.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteSubscriptionPlan = async (id: string) => {
  const plan = await SubscriptionPlan.findById(id);

  if (!plan) {
    throw new AppError(404, "Subscription plan not found");
  }

  await SubscriptionPlan.findByIdAndDelete(id);

  return null;
};

export const SubscriptionPlanServices = {
  createSubscriptionPlan,
  getAllSubscriptionPlans,
  getSingleSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
};
