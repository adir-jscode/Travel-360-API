import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
const router = Router();

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
  "/profile/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser,
);

export const UserRoutes = router;
