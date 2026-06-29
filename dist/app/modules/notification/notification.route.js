"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const notification_controller_1 = require("./notification.controller");
const router = express_1.default.Router();
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN), notification_controller_1.NotificationControllers.getMyNotifications);
router.get("/unread-count", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN), notification_controller_1.NotificationControllers.getUnreadCount);
router.patch("/mark-all-read", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN), notification_controller_1.NotificationControllers.markAllAsRead);
router.patch("/:id/read", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN), notification_controller_1.NotificationControllers.markAsRead);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN), notification_controller_1.NotificationControllers.deleteNotification);
exports.NotificationRoutes = router;
