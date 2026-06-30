import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { rateLimiters } from "../../middlewares/rateLimiter";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { AuthControllers } from "./auth.controller";
import {
  changePasswordZodSchema,
  forgotPasswordZodSchema,
  resetPasswordZodSchema,
  userLoginZodSchema,
} from "./auth.validation";

const router = Router();

router.post(
  "/login",
  rateLimiters.authLimiter,
  validateRequest(userLoginZodSchema),
  AuthControllers.credentialLogin,
);
router.post("/google-oauth", AuthControllers.googleOAuthLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.post(
  "/reset-password",
  validateRequest(resetPasswordZodSchema),
  AuthControllers.resetPassword,
);
router.post(
  "/forgot-password",
  rateLimiters.authLimiter,
  validateRequest(forgotPasswordZodSchema),
  AuthControllers.forgotPassword,
);

router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  validateRequest(changePasswordZodSchema),
  AuthControllers.changePassword,
);
export const AuthRoutes = router;
