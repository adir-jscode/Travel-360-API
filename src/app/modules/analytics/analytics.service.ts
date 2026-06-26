import { JoinRequestStatus } from "../joinRequest/joinRequest.interface";
import { JoinRequest } from "../joinRequest/joinRequest.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Review } from "../review/review.model";
import { SUBSCRIPTION_STATUS } from "../subscription/subscription.interface";
import { Subscription } from "../subscription/subscription.model";
import { TravelPlan } from "../travelPlan/travelPlan.model";
import { Trip } from "../trip/trip.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

// ── User stats ───────────────────────────────────────────────────────────────
const getUserStats = async () => {
  const [
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    newUsersLast7Days,
    newUsersLast30Days,
    usersByRole,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: IsActive.ACTIVE }),
    User.countDocuments({ isActive: IsActive.INACTIVE }),
    User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
  ]);

  return {
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    newUsersLast7Days,
    newUsersLast30Days,
    usersByRole,
  };
};

// ── Travel plan stats ────────────────────────────────────────────────────────
const getTravelPlanStats = async () => {
  const [
    totalPlans,
    plansLast7Days,
    plansLast30Days,
    plansByType,
    plansByVisibility,
  ] = await Promise.all([
    TravelPlan.countDocuments(),
    TravelPlan.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    TravelPlan.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    TravelPlan.aggregate([
      { $group: { _id: "$travelType", count: { $sum: 1 } } },
    ]),
    TravelPlan.aggregate([
      { $group: { _id: "$visibility", count: { $sum: 1 } } },
    ]),
  ]);

  // Top 10 most popular destinations
  const topDestinations = await TravelPlan.aggregate([
    {
      $group: {
        _id: { country: "$destination.country", city: "$destination.city" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  return {
    totalPlans,
    plansLast7Days,
    plansLast30Days,
    plansByType,
    plansByVisibility,
    topDestinations,
  };
};

// ── Payment stats ────────────────────────────────────────────────────────────
const getPaymentStats = async () => {
  const [
    totalPayments,
    paidPayments,
    unpaidPayments,
    paymentsLast7Days,
    paymentsLast30Days,
    totalRevenue,
    revenueLast30Days,
  ] = await Promise.all([
    Payment.countDocuments(),
    Payment.countDocuments({ status: PAYMENT_STATUS.PAID }),
    Payment.countDocuments({ status: PAYMENT_STATUS.UNPAID }),
    Payment.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Payment.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Payment.aggregate([
      { $match: { status: PAYMENT_STATUS.PAID } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Payment.aggregate([
      {
        $match: {
          status: PAYMENT_STATUS.PAID,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  // Revenue by month (last 6 months)
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  const revenueByMonth = await Payment.aggregate([
    {
      $match: {
        status: PAYMENT_STATUS.PAID,
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        revenue: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  return {
    totalPayments,
    paidPayments,
    unpaidPayments,
    paymentsLast7Days,
    paymentsLast30Days,
    totalRevenue: totalRevenue[0]?.total ?? 0,
    revenueLast30Days: revenueLast30Days[0]?.total ?? 0,
    revenueByMonth,
  };
};

// ── Subscription stats ───────────────────────────────────────────────────────
const getSubscriptionStats = async () => {
  const [
    totalSubscriptions,
    activeSubscriptions,
    pendingSubscriptions,
    subsLast7Days,
    subsLast30Days,
    subsByPlan,
  ] = await Promise.all([
    Subscription.countDocuments(),
    Subscription.countDocuments({ status: SUBSCRIPTION_STATUS.COMPLETE }),
    Subscription.countDocuments({ status: SUBSCRIPTION_STATUS.PENDING }),
    Subscription.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Subscription.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Subscription.aggregate([{ $group: { _id: "$plan", count: { $sum: 1 } } }]),
  ]);

  return {
    totalSubscriptions,
    activeSubscriptions,
    pendingSubscriptions,
    subsLast7Days,
    subsLast30Days,
    subsByPlan,
  };
};

// ── Trip stats ───────────────────────────────────────────────────────────────
const getTripStats = async () => {
  const [
    totalTrips,
    tripsByStatus,
    tripsLast30Days,
    avgMembersPerTrip,
    totalPhotosUploaded,
  ] = await Promise.all([
    Trip.countDocuments(),
    Trip.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Trip.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Trip.aggregate([
      { $group: { _id: null, avg: { $avg: { $size: "$members" } } } },
    ]),
    Trip.aggregate([
      { $group: { _id: null, total: { $sum: { $size: "$photos" } } } },
    ]),
  ]);

  return {
    totalTrips,
    tripsByStatus,
    tripsLast30Days,
    avgMembersPerTrip: Math.round((avgMembersPerTrip[0]?.avg ?? 0) * 10) / 10,
    totalPhotosUploaded: totalPhotosUploaded[0]?.total ?? 0,
  };
};

// ── Review & rating stats ────────────────────────────────────────────────────
const getReviewStats = async () => {
  const [
    totalReviews,
    reviewsLast30Days,
    ratingDistribution,
    avgRatingOverall,
  ] = await Promise.all([
    Review.countDocuments(),
    Review.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Review.aggregate([
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Review.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]),
  ]);

  return {
    totalReviews,
    reviewsLast30Days,
    ratingDistribution,
    avgRatingOverall: Math.round((avgRatingOverall[0]?.avg ?? 0) * 10) / 10,
  };
};

// ── Join request stats ───────────────────────────────────────────────────────
const getJoinRequestStats = async () => {
  const [total, pending, accepted, rejected, last30Days] = await Promise.all([
    JoinRequest.countDocuments(),
    JoinRequest.countDocuments({ status: JoinRequestStatus.PENDING }),
    JoinRequest.countDocuments({ status: JoinRequestStatus.ACCEPTED }),
    JoinRequest.countDocuments({ status: JoinRequestStatus.REJECTED }),
    JoinRequest.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
  ]);

  return { total, pending, accepted, rejected, last30Days };
};

// ── Admin dashboard summary ──────────────────────────────────────────────────
const getDashboardSummary = async () => {
  const [users, plans, payments, subscriptions, trips, reviews, joinRequests] =
    await Promise.all([
      getUserStats(),
      getTravelPlanStats(),
      getPaymentStats(),
      getSubscriptionStats(),
      getTripStats(),
      getReviewStats(),
      getJoinRequestStats(),
    ]);

  return {
    users,
    plans,
    payments,
    subscriptions,
    trips,
    reviews,
    joinRequests,
  };
};

export const AnalyticsServices = {
  getUserStats,
  getTravelPlanStats,
  getPaymentStats,
  getSubscriptionStats,
  getTripStats,
  getReviewStats,
  getJoinRequestStats,
  getDashboardSummary,
};
