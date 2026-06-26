import AppError from '../../errorHelpers/AppError';
import { emitNotification } from '../../socket/socket';
import { NotificationType } from '../notification/notification.interface';
import { NotificationServices } from '../notification/notification.service';
import { Trip } from '../trip/trip.model';
import { User } from '../user/user.model';
import { IReview } from './review.interface';
import { Review } from './review.model';

/** Recalculate and persist the average rating for a user */
const syncUserRating = async (revieweeId: string) => {
  const agg = await Review.aggregate([
    { $match: { reviewee: revieweeId } },
    { $group: { _id: null, avg: { $avg: '$rating' } } },
  ]);
  const avg = agg[0]?.avg ?? 0;
  await User.findByIdAndUpdate(revieweeId, { rating: Math.round(avg * 10) / 10 });
};

// ── Create ───────────────────────────────────────────────────────────────────
const createReview = async (
  reviewerId: string,
  payload: Pick<IReview, 'reviewee' | 'trip' | 'rating' | 'comment'>,
) => {
  if (reviewerId === payload.reviewee.toString())
    throw new AppError(400, 'You cannot review yourself');

  // Verify both users belong to the trip
  const trip = await Trip.findOne({
    _id: payload.trip,
    'members.user': { $all: [reviewerId, payload.reviewee] },
  });
  if (!trip) throw new AppError(403, 'Both users must be members of the same trip to review each other');

  const review = await Review.create({ ...payload, reviewer: reviewerId });
  await syncUserRating(payload.reviewee.toString());

  // Real-time notification to reviewee
  const reviewer = await User.findById(reviewerId).select('name picture');
  const notif = await NotificationServices.createNotification({
    recipient: payload.reviewee,
    sender: reviewer!._id,
    type: NotificationType.NEW_REVIEW,
    title: 'New Review Received ⭐',
    message: `${reviewer?.name} left you a ${payload.rating}-star review`,
    metadata: { reviewId: review._id, tripId: payload.trip },
  });
  emitNotification(payload.reviewee.toString(), notif.toObject());

  return review.populate([
    { path: 'reviewer', select: 'name picture' },
    { path: 'reviewee', select: 'name picture' },
  ]);
};

// ── Read ─────────────────────────────────────────────────────────────────────
const getReviewsForUser = async (revieweeId: string) => {
  return Review.find({ reviewee: revieweeId })
    .populate('reviewer', 'name picture')
    .sort({ createdAt: -1 })
    .lean();
};

const getMyReviews = async (reviewerId: string) => {
  return Review.find({ reviewer: reviewerId })
    .populate('reviewee', 'name picture')
    .sort({ createdAt: -1 })
    .lean();
};

const getReviewById = async (reviewId: string) => {
  const review = await Review.findById(reviewId)
    .populate('reviewer', 'name picture')
    .populate('reviewee', 'name picture');
  if (!review) throw new AppError(404, 'Review not found');
  return review;
};

// ── Update (reviewer only) ───────────────────────────────────────────────────
const updateReview = async (
  reviewerId: string,
  reviewId: string,
  payload: Partial<Pick<IReview, 'rating' | 'comment'>>,
) => {
  const review = await Review.findOne({ _id: reviewId, reviewer: reviewerId });
  if (!review) throw new AppError(404, 'Review not found or you are not the reviewer');

  if (payload.rating  !== undefined) review.rating  = payload.rating;
  if (payload.comment !== undefined) review.comment = payload.comment;
  review.isEdited = true;

  await review.save();
  await syncUserRating(review.reviewee.toString());

  return review.populate([
    { path: 'reviewer', select: 'name picture' },
    { path: 'reviewee', select: 'name picture' },
  ]);
};

// ── Delete (reviewer or admin) ───────────────────────────────────────────────
const deleteReview = async (requesterId: string, reviewId: string, isAdmin: boolean) => {
  const filter = isAdmin ? { _id: reviewId } : { _id: reviewId, reviewer: requesterId };
  const review = await Review.findOneAndDelete(filter);
  if (!review) throw new AppError(404, 'Review not found or not authorized');
  await syncUserRating(review.reviewee.toString());
  return null;
};

// ── Admin: all reviews ───────────────────────────────────────────────────────
const getAllReviews = async (query: Record<string, string>) => {
  const page  = parseInt(query.page  ?? '1');
  const limit = parseInt(query.limit ?? '10');
  const skip  = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Review.find()
      .populate('reviewer', 'name picture')
      .populate('reviewee', 'name picture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(),
  ]);

  return { data, meta: { total, page, limit } };
};

export const ReviewServices = {
  createReview,
  getReviewsForUser,
  getMyReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getAllReviews,
};
