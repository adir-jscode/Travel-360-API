"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const subscription_route_1 = require("../modules/subscription/subscription.route");
const subscriptionPlan_route_1 = require("../modules/subscriptionPlan/subscriptionPlan.route");
const travelPlan_route_1 = require("../modules/travelPlan/travelPlan.route");
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
];
moduleRoutes.forEach((route) => exports.router.use(route.path, route.route));
