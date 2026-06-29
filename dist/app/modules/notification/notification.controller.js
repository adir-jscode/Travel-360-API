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
exports.NotificationControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const notification_service_1 = require("./notification.service");
const getMyNotifications = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const data = yield notification_service_1.NotificationServices.getMyNotifications(userId);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 200, message: 'Notifications fetched', data });
}));
const markAsRead = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const data = yield notification_service_1.NotificationServices.markAsRead(req.params.id, userId);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 200, message: 'Notification marked as read', data });
}));
const markAllAsRead = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    yield notification_service_1.NotificationServices.markAllAsRead(userId);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 200, message: 'All notifications marked as read', data: null });
}));
const getUnreadCount = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const count = yield notification_service_1.NotificationServices.getUnreadCount(userId);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 200, message: 'Unread count', data: { count } });
}));
const deleteNotification = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    yield notification_service_1.NotificationServices.deleteNotification(req.params.id, userId);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 200, message: 'Notification deleted', data: null });
}));
exports.NotificationControllers = {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    deleteNotification,
};
