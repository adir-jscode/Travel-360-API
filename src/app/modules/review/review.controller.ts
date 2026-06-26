import { JwtPayload } from 'jsonwebtoken';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { Role } from '../user/user.interface';
import { ReviewServices } from './review.service';

const createReview = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  const data = await ReviewServices.createReview(userId, req.body);
  sendResponse(res, { success: true, statusCode: 201, message: 'Review created', data });
});

const getReviewsForUser = catchAsync(async (req, res) => {
  const data = await ReviewServices.getReviewsForUser(req.params.userId);
  sendResponse(res, { success: true, statusCode: 200, message: 'Reviews fetched', data });
});

const getMyReviews = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  const data = await ReviewServices.getMyReviews(userId);
  sendResponse(res, { success: true, statusCode: 200, message: 'My reviews fetched', data });
});

const getReviewById = catchAsync(async (req, res) => {
  const data = await ReviewServices.getReviewById(req.params.id);
  sendResponse(res, { success: true, statusCode: 200, message: 'Review fetched', data });
});

const updateReview = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  const data = await ReviewServices.updateReview(userId, req.params.id, req.body);
  sendResponse(res, { success: true, statusCode: 200, message: 'Review updated', data });
});

const deleteReview = catchAsync(async (req, res) => {
  const decoded = req.user as JwtPayload;
  const isAdmin = [Role.ADMIN, Role.SUPER_ADMIN].includes(decoded.role);
  await ReviewServices.deleteReview(decoded.userId, req.params.id, isAdmin);
  sendResponse(res, { success: true, statusCode: 200, message: 'Review deleted', data: null });
});

const getAllReviews = catchAsync(async (req, res) => {
  const { data, meta } = await ReviewServices.getAllReviews(req.query as Record<string, string>);
  sendResponse(res, { success: true, statusCode: 200, message: 'All reviews fetched', data, meta });
});

export const ReviewControllers = {
  createReview,
  getReviewsForUser,
  getMyReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getAllReviews,
};
