"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const analytics_route_1 = require("../modules/analytics/analytics.route");
const auth_route_1 = require("../modules/auth/auth.route");
const joinRequest_route_1 = require("../modules/joinRequest/joinRequest.route");
const notification_route_1 = require("../modules/notification/notification.route");
const payment_route_1 = require("../modules/payment/payment.route");
const review_route_1 = require("../modules/review/review.route");
const subscription_route_1 = require("../modules/subscription/subscription.route");
const subscriptionPlan_route_1 = require("../modules/subscriptionPlan/subscriptionPlan.route");
const travelPlan_route_1 = require("../modules/travelPlan/travelPlan.route");
const trip_route_1 = require("../modules/trip/trip.route");
const user_route_1 = require("../modules/user/user.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/travel-plan",
        route: travelPlan_route_1.TravelPlanRoutes,
    },
    {
        path: "/subscription-plan",
        route: subscriptionPlan_route_1.SubscriptionPlanRoutes,
    },
    {
        path: "/subscription",
        route: subscription_route_1.SubscriptionRoutes,
    },
    {
        path: "/analytics",
        route: analytics_route_1.AnalyticsRoutes,
    },
    { path: "/notification", route: notification_route_1.NotificationRoutes },
    { path: "/trip", route: trip_route_1.TripRoutes },
    { path: "/join-request", route: joinRequest_route_1.JoinRequestRoutes },
    { path: "/review", route: review_route_1.ReviewRoutes },
    { path: "/payment", route: payment_route_1.PaymentRoutes },
];
moduleRoutes.forEach((route) => exports.router.use(route.path, route.route));
