"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const multer_config_1 = require("../../config/multer.config");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_controller_1 = require("./user.controller");
const user_interface_1 = require("./user.interface");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
/*Admin operations*/
router.get("/", user_controller_1.UserControllers.getAllUsers);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), user_controller_1.UserControllers.deleteUser);
router.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema), user_controller_1.UserControllers.createUser);
//  public profile view other users
router.get("/profile/:id", user_controller_1.UserControllers.getUserProfile);
// view profile after login
router.get("/profile", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.getUserProfile);
router.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.getMe);
// all users can update their profile after login
router.patch("/profile", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), multer_config_1.multerUpload.single("file"), 
//validateRequest(updateUserZodSchema),
user_controller_1.UserControllers.updateUser);
/* Post-trip */
router.post("/rating/:id", (0, validateRequest_1.validateRequest)(user_validation_1.giveRatingZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), user_controller_1.UserControllers.giveRating);
router.post("/review/:id", (0, validateRequest_1.validateRequest)(user_validation_1.giveReviewZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), user_controller_1.UserControllers.giveReview);
router.get("/:id/reviews", user_controller_1.UserControllers.getRecentReviews);
router.get("/:id/rating", user_controller_1.UserControllers.getAverageRating);
exports.UserRoutes = router;
