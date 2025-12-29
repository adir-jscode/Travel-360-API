import { Router } from "express";
import { UserControllers } from "./user.controller";
const router = Router();

router.post("/register", UserControllers.createUser);
router.get("/profile/:id", UserControllers.getUserProfile);

export const UserRoutes = router;
