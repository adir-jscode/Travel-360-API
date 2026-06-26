import { Types } from 'mongoose';

export interface ITripMember {
  user: Types.ObjectId;
  joinedAt: Date;
}

export interface ITripPhoto {
  _id?: Types.ObjectId;
  url: string;
  publicId: string;           // Cloudinary public_id for deletion
  uploadedBy: Types.ObjectId;
  caption?: string;
  uploadedAt: Date;
}

export enum TripStatus {
  UPCOMING   = 'UPCOMING',
  ONGOING    = 'ONGOING',
  COMPLETED  = 'COMPLETED',
  CANCELLED  = 'CANCELLED',
}

export interface ITrip {
  _id?: Types.ObjectId;
  travelPlan: Types.ObjectId;
  host: Types.ObjectId;
  members: ITripMember[];
  status: TripStatus;
  photos: ITripPhoto[];
  createdAt?: Date;
  updatedAt?: Date;
}
