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
exports.NotificationServices = void 0;
const notification_model_1 = require("./notification.model");
/**
 * Create & persist a notification, then return it so the caller
 * can emit it via Socket.IO.
 */
const createNotification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield notification_model_1.Notification.create(Object.assign(Object.assign({}, payload), { isRead: false }));
    return notification.populate([
        { path: 'sender', select: 'name picture' },
        { path: 'recipient', select: 'name picture' },
    ]);
});
/** Fetch all notifications for a user, most-recent first */
const getMyNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return notification_model_1.Notification.find({ recipient: userId })
        .populate('sender', 'name picture')
        .sort({ createdAt: -1 })
        .lean();
});
/** Mark a single notification as read */
const markAsRead = (notificationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return notification_model_1.Notification.findOneAndUpdate({ _id: notificationId, recipient: userId }, { isRead: true }, { new: true });
});
/** Mark ALL notifications for a user as read */
const markAllAsRead = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return notification_model_1.Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
});
/** Count unread notifications */
const getUnreadCount = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return notification_model_1.Notification.countDocuments({ recipient: userId, isRead: false });
});
/** Delete a notification */
const deleteNotification = (notificationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return notification_model_1.Notification.findOneAndDelete({ _id: notificationId, recipient: userId });
});
exports.NotificationServices = {
    createNotification,
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    deleteNotification,
};
