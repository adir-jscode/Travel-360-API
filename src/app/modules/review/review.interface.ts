import { Types } from 'mongoose';

export interface IReview {
  _id?: Types.ObjectId;
  reviewer:  Types.ObjectId;   // user writing the review
  reviewee:  Types.ObjectId;   // user being reviewed
  trip:      Types.ObjectId;   // must belong to a completed trip both users share
  rating:    number;           // 1–5
  comment:   string;
  isEdited:  boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
