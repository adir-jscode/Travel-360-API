import { model, Schema } from 'mongoose';
import { IJoinRequest, JoinRequestStatus } from './joinRequest.interface';

const joinRequestSchema = new Schema<IJoinRequest>(
  {
    travelPlan: { type: Schema.Types.ObjectId, ref: 'TravelPlan', required: true, index: true },
    requester:  { type: Schema.Types.ObjectId, ref: 'User',       required: true, index: true },
    host:       { type: Schema.Types.ObjectId, ref: 'User',       required: true, index: true },
    status: {
      type: String,
      enum: Object.values(JoinRequestStatus),
      default: JoinRequestStatus.PENDING,
    },
    message: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true, versionKey: false },
);

// One user can only have one PENDING request per plan
joinRequestSchema.index({ travelPlan: 1, requester: 1 }, { unique: true });

export const JoinRequest = model<IJoinRequest>('JoinRequest', joinRequestSchema);
