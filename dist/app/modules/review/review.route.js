"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
const authUser = (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.GUIDE);
const authAdmin = (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN);
// Admin: all reviews
router.get('/', authAdmin, review_controller_1.ReviewControllers.getAllReviews);
// My written reviews
router.get('/my-reviews', authUser, review_controller_1.ReviewControllers.getMyReviews);
// Reviews for a specific user (public)
router.get('/user/:userId', review_controller_1.ReviewControllers.getReviewsForUser);
// Single review (public)
router.get('/:id', review_controller_1.ReviewControllers.getReviewById);
// Create a review (authenticated)
router.post('/', authUser, review_controller_1.ReviewControllers.createReview);
// Edit my review
router.patch('/:id', authUser, review_controller_1.ReviewControllers.updateReview);
// Delete (reviewer or admin)
router.delete('/:id', authUser, review_controller_1.ReviewControllers.deleteReview);
exports.ReviewRoutes = router;
