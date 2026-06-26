import { INotification, NotificationType } from './notification.interface';
import { Notification } from './notification.model';

/**
 * Create & persist a notification, then return it so the caller
 * can emit it via Socket.IO.
 */
const createNotification = async (payload: Omit<INotification, 'isRead'>) => {
  const notification = await Notification.create({ ...payload, isRead: false });
  return notification.populate([
    { path: 'sender',    select: 'name picture' },
    { path: 'recipient', select: 'name picture' },
  ]);
};

/** Fetch all notifications for a user, most-recent first */
const getMyNotifications = async (userId: string) => {
  return Notification.find({ recipient: userId })
    .populate('sender', 'name picture')
    .sort({ createdAt: -1 })
    .lean();
};

/** Mark a single notification as read */
const markAsRead = async (notificationId: string, userId: string) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true },
  );
};

/** Mark ALL notifications for a user as read */
const markAllAsRead = async (userId: string) => {
  return Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
};

/** Count unread notifications */
const getUnreadCount = async (userId: string) => {
  return Notification.countDocuments({ recipient: userId, isRead: false });
};

/** Delete a notification */
const deleteNotification = async (notificationId: string, userId: string) => {
  return Notification.findOneAndDelete({ _id: notificationId, recipient: userId });
};

export const NotificationServices = {
  createNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
};
