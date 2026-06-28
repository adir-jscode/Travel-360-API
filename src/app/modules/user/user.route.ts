import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import {
  createUserZodSchema,
  giveRatingZodSchema,
  giveReviewZodSchema,
} from "./user.validation";
const router = Router();

/*Admin operations*/
router.get("/", UserControllers.getAllUsers);
router.delete("/:id", checkAuth(Role.ADMIN), UserControllers.deleteUser);

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser,
);

//  public profile view other users
router.get("/profile/:id", UserControllers.getUserProfile);
// view profile after login
router.get(
  "/profile",
  checkAuth(...Object.values(Role)),
  UserControllers.getUserProfile,
);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);

// all users can update their profile after login
router.patch(
  "/profile",
  checkAuth(...Object.values(Role)),
  multerUpload.single("file"),
  //validateRequest(updateUserZodSchema),
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
