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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
/*
{
req.user
[1]   userId: '69956a605e7f179f61b8972f',
[1]   email: 'adir25new0@gmail.com',
[1]   role: 'USER',
[1]   iat: 1781771110,
[1]   exp: 1781857510
[1] }


*/
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(400, "User is already exists");
    }
    //hashing password
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = {
        provider: "CREDENTIAL",
        providerId: email,
    };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, auths: [authProvider] }, rest));
    return user;
});
//all users
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({});
    const totalUsers = yield user_model_1.User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers,
        },
    };
});
// public profile view other users
const getUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password -isDeleted -isActive -isVerified -createdAt -updatedAt -auths");
    if (!user) {
        throw new AppError_1.default(400, "User not found");
    }
    if (user.role === user_interface_1.Role.ADMIN ||
        user.role === user_interface_1.Role.SUPER_ADMIN ||
        user.role === user_interface_1.Role.GUIDE) {
        throw new AppError_1.default(403, "You are not authorized to access this profile");
    }
    return user;
});
const updateUser = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decodedToken.userId;
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(400, "User not found");
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
            throw new AppError_1.default(403, "You are not authorized");
        }
        if (payload.role === user_interface_1.Role.SUPER_ADMIN && decodedToken.role === user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(403, "You are not authorized");
        }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
            throw new AppError_1.default(403, "You are not authorized");
        }
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    const updatedUserInfo = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedUserInfo;
});
// give user a rating between 1 to 5
const giveRating = (targetUserId, reviewerId, value) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (value < 1 || value > 5) {
        throw new AppError_1.default(400, "Rating must be between 1 and 5");
    }
    const targetUser = yield user_model_1.User.findById(targetUserId);
    if (!targetUser) {
        throw new AppError_1.default(404, "User not found");
    }
    const existingRating = (_a = targetUser.ratings) === null || _a === void 0 ? void 0 : _a.find((rating) => rating.user.toString() === reviewerId);
    if (existingRating) {
        existingRating.value = value;
    }
    else {
        (_b = targetUser.ratings) === null || _b === void 0 ? void 0 : _b.push({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user: reviewerId,
            value,
        });
    }
    const total = ((_c = targetUser.ratings) === null || _c === void 0 ? void 0 : _c.reduce((sum, rating) => sum + rating.value, 0)) || 0;
    targetUser.rating = total / (((_d = targetUser.ratings) === null || _d === void 0 ? void 0 : _d.length) || 1);
    yield targetUser.save();
    return targetUser;
});
//give user a review
const giveReview = (targetUserId, reviewerId, description) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const targetUser = yield user_model_1.User.findById(targetUserId);
    if (!targetUser) {
        throw new AppError_1.default(404, "User not found");
    }
    (_a = targetUser.reviews) === null || _a === void 0 ? void 0 : _a.push({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: reviewerId,
        description,
        createdAt: new Date(),
    });
    yield targetUser.save();
    return targetUser;
});
// calculate average rating
const getAverageRating = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    return {
        averageRating: user.rating || 0,
    };
});
// get recent reviews
const getRecentReviews = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.User.findById(userId).populate("reviews.user", "name picture");
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    const recentReviews = (_a = user.reviews) === null || _a === void 0 ? void 0 : _a.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
    return recentReviews;
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndDelete(userId);
    return result;
});
exports.UserServices = {
    createUser,
    getUserProfile,
    getAllUsers,
    updateUser,
    deleteUser,
    giveRating,
    giveReview,
    getAverageRating,
    getRecentReviews,
};
