import { model, Schema } from 'mongoose';
import { ITrip, ITripMember, ITripPhoto, TripStatus } from './trip.interface';

const tripMemberSchema = new Schema<ITripMember>(
  {
    user:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const tripPhotoSchema = new Schema<ITripPhoto>(
  {
    url:        { type: String, required: true },
    publicId:   { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    caption:    { type: String, maxlength: 300 },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const tripSchema = new Schema<ITrip>(
  {
    travelPlan: { type: Schema.Types.ObjectId, ref: 'TravelPlan', required: true, index: true },
    host:       { type: Schema.Types.ObjectId, ref: 'User',       required: true, index: true },
    members:    [tripMemberSchema],
    status: {
      type: String,
      enum: Object.values(TripStatus),
      default: TripStatus.UPCOMING,
    },
    photos: [tripPhotoSchema],
  },
  { timestamps: true, versionKey: false },
);

export { TripStatus };
export const Trip = model<ITrip>('Trip', tripSchema);
