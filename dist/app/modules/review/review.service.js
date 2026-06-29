"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const socket_1 = require("../../socket/socket");
const notification_interface_1 = require("../notification/notification.interface");
const notification_service_1 = require("../notification/notification.service");
const trip_model_1 = require("../trip/trip.model");
const user_model_1 = require("../user/user.model");
const review_model_1 = require("./review.model");
/** Recalculate and persist the average rating for a user */
const syncUserRating = (revieweeId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const agg = yield review_model_1.Review.aggregate([
        { $match: { reviewee: revieweeId } },
        { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);
    const avg = (_b = (_a = agg[0]) === null || _a === void 0 ? void 0 : _a.avg) !== null && _b !== void 0 ? _b : 0;
    yield user_model_1.User.findByIdAndUpdate(revieweeId, { rating: Math.round(avg * 10) / 10 });
});
// ── Create ───────────────────────────────────────────────────────────────────
const createReview = (reviewerId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (reviewerId === payload.reviewee.toString())
        throw new AppError_1.default(400, 'You cannot review yourself');
    // Verify both users belong to the trip
    const trip = yield trip_model_1.Trip.findOne({
        _id: payload.trip,
        'members.user': { $all: [reviewerId, payload.reviewee] },
    });
    if (!trip)
        throw new AppError_1.default(403, 'Both users must be members of the same trip to review each other');
    const review = yield review_model_1.Review.create(Object.assign(Object.assign({}, payload), { reviewer: reviewerId }));
    yield syncUserRating(payload.reviewee.toString());
    // Real-time notification to reviewee
    const reviewer = yield user_model_1.User.findById(reviewerId).select('name picture');
    const notif = yield notification_service_1.NotificationServices.createNotification({
        recipient: payload.reviewee,
        sender: reviewer._id,
        type: notification_interface_1.NotificationType.NEW_REVIEW,
        title: 'New Review Received ⭐',
        message: `${reviewer === null || reviewer === void 0 ? void 0 : reviewer.name} left you a ${payload.rating}-star review`,
        metadata: { reviewId: review._id, tripId: payload.trip },
    });
    (0, socket_1.emitNotification)(payload.reviewee.toString(), notif.toObject());
    return review.populate([
        { path: 'reviewer', select: 'name picture' },
        { path: 'reviewee', select: 'name picture' },
    ]);
});
// ── Read ─────────────────────────────────────────────────────────────────────
const getReviewsForUser = (revieweeId) => __awaiter(void 0, void 0, void 0, function* () {
    return review_model_1.Review.find({ reviewee: revieweeId })
        .populate('reviewer', 'name picture')
        .sort({ createdAt: -1 })
        .lean();
});
const getMyReviews = (reviewerId) => __awaiter(void 0, void 0, void 0, function* () {
    return review_model_1.Review.find({ reviewer: reviewerId })
        .populate('reviewee', 'name picture')
        .sort({ createdAt: -1 })
        .lean();
});
const getReviewById = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findById(reviewId)
        .populate('reviewer', 'name picture')
        .populate('reviewee', 'name picture');
    if (!review)
        throw new AppError_1.default(404, 'Review not found');
    return review;
});
// ── Update (reviewer only) ───────────────────────────────────────────────────
const updateReview = (reviewerId, reviewId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findOne({ _id: reviewId, reviewer: reviewerId });
    if (!review)
        throw new AppError_1.default(404, 'Review not found or you are not the reviewer');
    if (payload.rating !== undefined)
        review.rating = payload.rating;
    if (payload.comment !== undefined)
        review.comment = payload.comment;
    review.isEdited = true;
    yield review.save();
    yield syncUserRating(review.reviewee.toString());
    return review.populate([
        { path: 'reviewer', select: 'name picture' },
        { path: 'reviewee', select: 'name picture' },
    ]);
});
// ── Delete (reviewer or admin) ───────────────────────────────────────────────
const deleteReview = (requesterId, reviewId, isAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = isAdmin ? { _id: reviewId } : { _id: reviewId, reviewer: requesterId };
    const review = yield review_model_1.Review.findOneAndDelete(filter);
    if (!review)
        throw new AppError_1.default(404, 'Review not found or not authorized');
    yield syncUserRating(review.reviewee.toString());
    return null;
});
// ── Admin: all reviews ───────────────────────────────────────────────────────
const getAllReviews = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const page = parseInt((_a = query.page) !== null && _a !== void 0 ? _a : '1');
    const limit = parseInt((_b = query.limit) !== null && _b !== void 0 ? _b : '10');
    const skip = (page - 1) * limit;
    const [data, total] = yield Promise.all([
        review_model_1.Review.find()
            .populate('reviewer', 'name picture')
            .populate('reviewee', 'name picture')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        review_model_1.Review.countDocuments(),
    ]);
    return { data, meta: { total, page, limit } };
});
exports.ReviewServices = {
    createReview,
    getReviewsForUser,
    getMyReviews,
    getReviewById,
    updateReview,
    deleteReview,
    getAllReviews,
};
