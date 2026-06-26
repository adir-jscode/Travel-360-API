import { Types } from 'mongoose';

export enum JoinRequestStatus {
  PENDING  = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface IJoinRequest {
  _id?: Types.ObjectId;
  travelPlan: Types.ObjectId;  // which travel plan
  requester:  Types.ObjectId;  // user who wants to join
  host:       Types.ObjectId;  // owner of the travel plan (denormalised for fast lookup)
  status:     JoinRequestStatus;
  message?:   string;          // optional cover-note from requester
  createdAt?: Date;
  updatedAt?: Date;
}
