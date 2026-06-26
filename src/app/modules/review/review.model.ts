import { model, Schema } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>(
  {
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reviewee: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    trip:     { type: Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    comment:  { type: String, required: true, trim: true, maxlength: 1000 },
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

// One review per reviewer→reviewee pair per trip
reviewSchema.index({ reviewer: 1, reviewee: 1, trip: 1 }, { unique: true });

export const Review = model<IReview>('Review', reviewSchema);
