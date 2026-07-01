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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const serAuthCookie_1 = require("../../utils/serAuthCookie");
const auth_service_1 = require("./auth.service");
const credentialLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInfo = yield auth_service_1.AuthServices.credentialLogin(req.body);
    (0, serAuthCookie_1.setAuthCookie)(res, loginInfo);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "User logged in successfully",
        data: loginInfo,
    });
}));
const logout = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "User logged out successfully",
        data: null,
    });
}));
const getNewAccessToken = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(400, "Refresh token is not received from cookies!");
    }
    const newAccessToken = yield auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "New Access Token Issued",
        data: newAccessToken,
    });
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, token, newPassword } = req.body;
    console.log(req.body);
    console.log("id", id);
    console.log(token);
    console.log(newPassword);
    yield auth_service_1.AuthServices.resetPasswordWithToken(id, token, newPassword);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Password Reset Successfully",
        data: null,
    });
}));
const forgotPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield auth_service_1.AuthServices.forgotPassword(email);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Email Sent Successfully",
        data: null,
    });
}));
const googleOAuthLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { name, email, picture, providerId } = req.body;
    if (!name || !email || !providerId) {
        throw new AppError_1.default(400, "name, email and providerId are required");
    }
    const loginInfo = yield auth_service_1.AuthServices.googleOAuthLogin({
        name,
        email,
        picture,
        providerId,
    });
    console.log({ loginInfo });
    (0, serAuthCookie_1.setAuthCookie)(res, loginInfo);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Google OAuth login successful",
        data: loginInfo,
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user;
    yield auth_service_1.AuthServices.changePassword(oldPassword, newPassword, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Password Changed Successfully",
        data: null,
    });
}));
exports.AuthControllers = {
    credentialLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    forgotPassword,
    googleOAuthLogin,
    changePassword,
};
