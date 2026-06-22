"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRoutes = void 0;
const checkAuth_1 = require("../../middlewares/checkAuth");
const routes_1 = require("../../routes");
const user_interface_1 = require("../user/user.interface");
const subscription_controller_1 = require("./subscription.controller");
// create
routes_1.router.post("/", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), subscription_controller_1.SubscriptionControllers.createSubscription);
//all subs
// my subs
//by subs id
//booking status update
exports.SubscriptionRoutes = routes_1.router;
