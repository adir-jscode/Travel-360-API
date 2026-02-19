import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthControllers } from "./auth.controller";
import { userLoginZodSchema } from "./auth.validation";

const router = Router();

router.post(
  "/login",
  validateRequest(userLoginZodSchema),
  AuthControllers.credentialLogin,
);

router.post("/refresh-token", AuthControllers.getNewAccessToken);

export const AuthRoutes = router;
