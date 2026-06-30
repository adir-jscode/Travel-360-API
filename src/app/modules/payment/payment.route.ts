import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { PaymentControllers } from "./payment.controller";

const router = Router();

// Logged-in user's own payment / billing history
router.get(
  "/my-payments",
  checkAuth(...Object.values(Role)),
  PaymentControllers.getMyPayments,
);

export const PaymentRoutes = router;
