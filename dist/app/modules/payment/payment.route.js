"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
// Logged-in user's own payment / billing history
router.get("/my-payments", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), payment_controller_1.PaymentControllers.getMyPayments);
exports.PaymentRoutes = router;
