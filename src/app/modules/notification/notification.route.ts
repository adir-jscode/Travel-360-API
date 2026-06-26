import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { NotificationControllers } from "./notification.controller";

const router = express.Router();

router.get(
  "/",
  checkAuth(Role.USER, Role.ADMIN),
  NotificationControllers.getMyNotifications,
);
router.get(
  "/unread-count",
  checkAuth(Role.USER, Role.ADMIN),
  NotificationControllers.getUnreadCount,
);
router.patch(
  "/mark-all-read",
  checkAuth(Role.USER, Role.ADMIN),
  NotificationControllers.markAllAsRead,
);
router.patch(
  "/:id/read",
  checkAuth(Role.USER, Role.ADMIN),
  NotificationControllers.markAsRead,
);
router.delete(
  "/:id",
  checkAuth(Role.USER, Role.ADMIN),
  NotificationControllers.deleteNotification,
);

export const NotificationRoutes = router;
