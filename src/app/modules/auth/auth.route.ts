import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { rateLimiters } from "../../middlewares/rateLimiter";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { AuthControllers } from "./auth.controller";
import { userLoginZodSchema } from "./auth.validation";

const router = Router();

router.post(
  "/login",
  rateLimiters.authLimiter,
  validateRequest(userLoginZodSchema),
  AuthControllers.credentialLogin,
);

router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword,
);
export const AuthRoutes = router;
