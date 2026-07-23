import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { ReviewControllers } from "./review.controller";

const router = express.Router();

const authUser = checkAuth(Role.USER, Role.ADMIN);
const authAdmin = checkAuth(Role.ADMIN, Role.SUPER_ADMIN);

// Admin: all reviews
router.get("/", authAdmin, ReviewControllers.getAllReviews);

// My written reviews
router.get("/my-reviews", authUser, ReviewControllers.getMyReviews);

// Reviews for a specific user (public)
router.get("/user/:userId", ReviewControllers.getReviewsForUser);

// Single review (public)
router.get("/:id", ReviewControllers.getReviewById);

// Create a review (authenticated)
router.post("/", authUser, ReviewControllers.createReview);

// Edit my review
router.patch("/:id", authUser, ReviewControllers.updateReview);

// Delete (reviewer or admin)
router.delete("/:id", authUser, ReviewControllers.deleteReview);

export const ReviewRoutes = router;
