import { Types } from "mongoose";

export enum NotificationType {
  JOIN_REQUEST = "JOIN_REQUEST",
  REQUEST_ACCEPTED = "REQUEST_ACCEPTED",
  REQUEST_REJECTED = "REQUEST_REJECTED",
  TRIP_UPDATE = "TRIP_UPDATE",
  NEW_REVIEW = "NEW_REVIEW",
}

export interface INotification {
  recipient: Types.ObjectId; // user who receives notification
  sender: Types.ObjectId; // user who triggered it
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, unknown>; // e.g. { joinRequestId, travelPlanId, tripId }
  createdAt?: Date;
  updatedAt?: Date;
}
