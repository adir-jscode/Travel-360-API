import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import {
  createUserZodSchema,
  giveRatingZodSchema,
  giveReviewZodSchema,
  updateUserZodSchema,
} from "./user.validation";
const router = Router();

/*Admin operations*/
router.get("/", checkAuth(Role.ADMIN), UserControllers.getAllUsers);
router.delete("/:id", checkAuth(Role.ADMIN), UserControllers.deleteUser);

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser,
);

//  public profile view other users
router.get(
  "/profile/:id",
  checkAuth(Role.USER),
  UserControllers.getUserProfile,
);
// view profile after login
router.get(
  "/profile",
  checkAuth(...Object.values(Role)),
  UserControllers.getUserProfile,
);

// all users can update their profile after login
router.patch(
  "/profile",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser,
);
/* Post-trip */
router.post(
  "/rating/:id",
  validateRequest(giveRatingZodSchema),
  checkAuth(Role.USER),
  UserControllers.giveRating,
);

router.post(
  "/review/:id",
  validateRequest(giveReviewZodSchema),
  checkAuth(Role.USER),
  UserControllers.giveReview,
);

router.get("/:id/reviews", UserControllers.getRecentReviews);

router.get("/:id/rating", UserControllers.getAverageRating);
export const UserRoutes = router;
