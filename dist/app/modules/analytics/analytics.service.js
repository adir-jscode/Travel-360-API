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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsServices = void 0;
const joinRequest_interface_1 = require("../joinRequest/joinRequest.interface");
const joinRequest_model_1 = require("../joinRequest/joinRequest.model");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const review_model_1 = require("../review/review.model");
const subscription_interface_1 = require("../subscription/subscription.interface");
const subscription_model_1 = require("../subscription/subscription.model");
const travelPlan_model_1 = require("../travelPlan/travelPlan.model");
const trip_model_1 = require("../trip/trip.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
// ── User stats ───────────────────────────────────────────────────────────────
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalUsers, totalActiveUsers, totalInActiveUsers, newUsersLast7Days, newUsersLast30Days, usersByRole,] = yield Promise.all([
        user_model_1.User.countDocuments(),
        user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.ACTIVE }),
        user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.INACTIVE }),
        user_model_1.User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        user_model_1.User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        user_model_1.User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    ]);
    return {
        totalUsers,
        totalActiveUsers,
        totalInActiveUsers,
        newUsersLast7Days,
        newUsersLast30Days,
        usersByRole,
    };
});
// ── Travel plan stats ────────────────────────────────────────────────────────
const getTravelPlanStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalPlans, plansLast7Days, plansLast30Days, plansByType, plansByVisibility,] = yield Promise.all([
        travelPlan_model_1.TravelPlan.countDocuments(),
        travelPlan_model_1.TravelPlan.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        travelPlan_model_1.TravelPlan.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        travelPlan_model_1.TravelPlan.aggregate([
            { $group: { _id: "$travelType", count: { $sum: 1 } } },
        ]),
        travelPlan_model_1.TravelPlan.aggregate([
            { $group: { _id: "$visibility", count: { $sum: 1 } } },
        ]),
    ]);
    // Top 10 most popular destinations
    const topDestinations = yield travelPlan_model_1.TravelPlan.aggregate([
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
});
// ── Payment stats ────────────────────────────────────────────────────────────
const getPaymentStats = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const [totalPayments, paidPayments, unpaidPayments, paymentsLast7Days, paymentsLast30Days, totalRevenue, revenueLast30Days,] = yield Promise.all([
        payment_model_1.Payment.countDocuments(),
        payment_model_1.Payment.countDocuments({ status: payment_interface_1.PAYMENT_STATUS.PAID }),
        payment_model_1.Payment.countDocuments({ status: payment_interface_1.PAYMENT_STATUS.UNPAID }),
        payment_model_1.Payment.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        payment_model_1.Payment.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        payment_model_1.Payment.aggregate([
            { $match: { status: payment_interface_1.PAYMENT_STATUS.PAID } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        payment_model_1.Payment.aggregate([
            {
                $match: {
                    status: payment_interface_1.PAYMENT_STATUS.PAID,
                    createdAt: { $gte: thirtyDaysAgo },
                },
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
    ]);
    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    const revenueByMonth = yield payment_model_1.Payment.aggregate([
        {
            $match: {
                status: payment_interface_1.PAYMENT_STATUS.PAID,
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
        totalRevenue: (_b = (_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) !== null && _b !== void 0 ? _b : 0,
        revenueLast30Days: (_d = (_c = revenueLast30Days[0]) === null || _c === void 0 ? void 0 : _c.total) !== null && _d !== void 0 ? _d : 0,
        revenueByMonth,
    };
});
// ── Subscription stats ───────────────────────────────────────────────────────
const getSubscriptionStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalSubscriptions, activeSubscriptions, pendingSubscriptions, subsLast7Days, subsLast30Days, subsByPlan,] = yield Promise.all([
        subscription_model_1.Subscription.countDocuments(),
        subscription_model_1.Subscription.countDocuments({ status: subscription_interface_1.SUBSCRIPTION_STATUS.COMPLETE }),
        subscription_model_1.Subscription.countDocuments({ status: subscription_interface_1.SUBSCRIPTION_STATUS.PENDING }),
        subscription_model_1.Subscription.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        subscription_model_1.Subscription.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        subscription_model_1.Subscription.aggregate([{ $group: { _id: "$plan", count: { $sum: 1 } } }]),
    ]);
    return {
        totalSubscriptions,
        activeSubscriptions,
        pendingSubscriptions,
        subsLast7Days,
        subsLast30Days,
        subsByPlan,
    };
});
// ── Trip stats ───────────────────────────────────────────────────────────────
const getTripStats = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const [totalTrips, tripsByStatus, tripsLast30Days, avgMembersPerTrip, totalPhotosUploaded,] = yield Promise.all([
        trip_model_1.Trip.countDocuments(),
        trip_model_1.Trip.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        trip_model_1.Trip.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        trip_model_1.Trip.aggregate([
            { $group: { _id: null, avg: { $avg: { $size: "$members" } } } },
        ]),
        trip_model_1.Trip.aggregate([
            { $group: { _id: null, total: { $sum: { $size: "$photos" } } } },
        ]),
    ]);
    return {
        totalTrips,
        tripsByStatus,
        tripsLast30Days,
        avgMembersPerTrip: Math.round(((_b = (_a = avgMembersPerTrip[0]) === null || _a === void 0 ? void 0 : _a.avg) !== null && _b !== void 0 ? _b : 0) * 10) / 10,
        totalPhotosUploaded: (_d = (_c = totalPhotosUploaded[0]) === null || _c === void 0 ? void 0 : _c.total) !== null && _d !== void 0 ? _d : 0,
    };
});
// ── Review & rating stats ────────────────────────────────────────────────────
const getReviewStats = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const [totalReviews, reviewsLast30Days, ratingDistribution, avgRatingOverall,] = yield Promise.all([
        review_model_1.Review.countDocuments(),
        review_model_1.Review.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        review_model_1.Review.aggregate([
            { $group: { _id: "$rating", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]),
        review_model_1.Review.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]),
    ]);
    return {
        totalReviews,
        reviewsLast30Days,
        ratingDistribution,
        avgRatingOverall: Math.round(((_b = (_a = avgRatingOverall[0]) === null || _a === void 0 ? void 0 : _a.avg) !== null && _b !== void 0 ? _b : 0) * 10) / 10,
    };
});
// ── Join request stats ───────────────────────────────────────────────────────
const getJoinRequestStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [total, pending, accepted, rejected, last30Days] = yield Promise.all([
        joinRequest_model_1.JoinRequest.countDocuments(),
        joinRequest_model_1.JoinRequest.countDocuments({ status: joinRequest_interface_1.JoinRequestStatus.PENDING }),
        joinRequest_model_1.JoinRequest.countDocuments({ status: joinRequest_interface_1.JoinRequestStatus.ACCEPTED }),
        joinRequest_model_1.JoinRequest.countDocuments({ status: joinRequest_interface_1.JoinRequestStatus.REJECTED }),
        joinRequest_model_1.JoinRequest.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);
    return { total, pending, accepted, rejected, last30Days };
});
// ── Admin dashboard summary ──────────────────────────────────────────────────
const getDashboardSummary = () => __awaiter(void 0, void 0, void 0, function* () {
    const [users, plans, payments, subscriptions, trips, reviews, joinRequests] = yield Promise.all([
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
});
exports.AnalyticsServices = {
    getUserStats,
    getTravelPlanStats,
    getPaymentStats,
    getSubscriptionStats,
    getTripStats,
    getReviewStats,
    getJoinRequestStats,
    getDashboardSummary,
};
