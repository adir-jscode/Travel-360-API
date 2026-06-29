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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const user_interface_1 = require("../user/user.interface");
const review_service_1 = require("./review.service");
const createReview = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const data = yield review_service_1.ReviewServices.createReview(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 201, message: 'Review created', data });
}));
const getReviewsForUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield review_service_1.ReviewServices.getReviewsForUser(req.params.userId);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 200, message: 'Reviews fetched', data });
}));
const getMyReviews = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const data = yield review_service_1.ReviewServices.getMyReviews(userId);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 200, message: 'My reviews fetched', data });
}));
const getReviewById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield review_service_1.ReviewServices.getReviewById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 200, message: 'Review fetched', data });
}));
const updateReview = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const data = yield review_service_1.ReviewServices.updateReview(userId, req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 200, message: 'Review updated', data });
}));
const deleteReview = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = req.user;
    const isAdmin = [user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN].includes(decoded.role);
    yield review_service_1.ReviewServices.deleteReview(decoded.userId, req.params.id, isAdmin);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 200, message: 'Review deleted', data: null });
}));
const getAllReviews = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, meta } = yield review_service_1.ReviewServices.getAllReviews(req.query);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: 200, message: 'All reviews fetched', data, meta });
}));
exports.ReviewControllers = {
    createReview,
    getReviewsForUser,
    getMyReviews,
    getReviewById,
    updateReview,
    deleteReview,
    getAllReviews,
};
