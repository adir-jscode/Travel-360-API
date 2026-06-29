"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const user_service_1 = require("./user.service");
//register user
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserServices.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "User created successfully",
        data: user,
    });
}));
// user profile
const getUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id || req.user.userId;
        const profile = yield user_service_1.UserServices.getUserProfile(userId);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "User profile fetched successfully",
            data: profile,
        });
    }
    catch (error) {
        next(error);
    }
});
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id || req.user.userId;
        console.log(userId);
        const profile = yield user_service_1.UserServices.getMe(userId);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "User profile fetched successfully",
            data: profile,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    console.log(req.body);
    const payload = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;
    if (req.file) {
        payload.picture = req.file.path;
    }
    console.log({ payload });
    const updatedUserInfo = yield user_service_1.UserServices.updateUser(payload, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "User information updated successfully",
        data: updatedUserInfo,
    });
}));
const giveRating = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewerId = req.user.userId;
    const targetUserId = req.params.id;
    const { value } = req.body;
    const result = yield user_service_1.UserServices.giveRating(targetUserId, reviewerId, value);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Rating submitted successfully",
        data: result,
    });
}));
const giveReview = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewerId = req.user.userId;
    const targetUserId = req.params.id;
    const { description } = req.body;
    const result = yield user_service_1.UserServices.giveReview(targetUserId, reviewerId, description);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Review submitted successfully",
        data: result,
    });
}));
const getAverageRating = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getAverageRating(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Average rating retrieved successfully",
        data: result,
    });
}));
const getRecentReviews = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getRecentReviews(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Reviews retrieved successfully",
        data: result,
    });
}));
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query || "";
    console.log({ query });
    const result = yield user_service_1.UserServices.getAllUsers(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "All Users retrieved successfully",
        data: result,
    });
}));
const deleteUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.deleteUser(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "User deleted successfully",
        data: result,
    });
}));
exports.UserControllers = {
    createUser,
    getUserProfile,
    updateUser,
    deleteUser,
    giveRating,
    giveReview,
    getAverageRating,
    getRecentReviews,
    getAllUsers,
    getMe,
};
