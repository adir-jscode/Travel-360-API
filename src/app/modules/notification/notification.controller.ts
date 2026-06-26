import { JwtPayload } from 'jsonwebtoken';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { NotificationServices } from './notification.service';

const getMyNotifications = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  const data = await NotificationServices.getMyNotifications(userId);
  sendResponse(res, { success: true, statusCode: 200, message: 'Notifications fetched', data });
});

const markAsRead = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  const data = await NotificationServices.markAsRead(req.params.id, userId);
  sendResponse(res, { success: true, statusCode: 200, message: 'Notification marked as read', data });
});

const markAllAsRead = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  await NotificationServices.markAllAsRead(userId);
  sendResponse(res, { success: true, statusCode: 200, message: 'All notifications marked as read', data: null });
});

const getUnreadCount = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  const count = await NotificationServices.getUnreadCount(userId);
  sendResponse(res, { success: true, statusCode: 200, message: 'Unread count', data: { count } });
});

const deleteNotification = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  await NotificationServices.deleteNotification(req.params.id, userId);
  sendResponse(res, { success: true, statusCode: 200, message: 'Notification deleted', data: null });
});

export const NotificationControllers = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
};
