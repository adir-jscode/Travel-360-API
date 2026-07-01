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
exports.AuthServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const jwt_1 = require("../../utils/jwt");
const sendEmail_1 = require("../../utils/sendEmail");
const userTokens_1 = require("../../utils/userTokens");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const credentialLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.default(400, "Invalid Email Address");
    }
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, isUserExist.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(400, "Incorrect Password");
    }
    if (!isUserExist.isVerified) {
        throw new AppError_1.default(400, "You are not verified");
    }
    if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED ||
        isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(400, `User is ${isUserExist.isActive}`);
    }
    if (isUserExist.isDeleted) {
        throw new AppError_1.default(400, "User is deleted");
    }
    const tokens = (0, userTokens_1.createUserTokens)(isUserExist);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = isUserExist.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: rest,
    };
});
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedRefreshToken = (0, jwt_1.verifyToken)(refreshToken, env_1.envVars.JWT_REFRESH_SECRET);
    const isUserExist = yield user_model_1.User.findOne({
        email: verifiedRefreshToken.email,
    });
    if (!isUserExist) {
        throw new AppError_1.default(400, "User does not exists");
    }
    if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED ||
        isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(400, `User is ${isUserExist.isActive}`);
    }
    if (isUserExist.isDeleted) {
        throw new AppError_1.default(400, "User is deleted");
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_SECRET, env_1.envVars.ACCESS_TOKEN_EXPIRE);
    return { accessToken };
});
const resetPassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError_1.default(400, "user not found");
    }
    const isOldPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(401, "Old password does not match");
    }
    if (newPassword === oldPassword) {
        throw new AppError_1.default(400, "New password must be different from old password");
    }
    const hashNewPassword = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user.password = hashNewPassword;
    yield user.save();
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.default(400, "User does not exist");
    }
    if (!isUserExist.isVerified) {
        throw new AppError_1.default(400, "User is not verified");
    }
    if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED ||
        isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(400, `User is ${isUserExist.isActive}`);
    }
    if (isUserExist.isDeleted) {
        throw new AppError_1.default(400, "User is deleted");
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
        purpose: "PASSWORD_RESET",
    };
    const resetToken = jsonwebtoken_1.default.sign(jwtPayload, env_1.envVars.JWT_SECRET, {
        expiresIn: "10m",
    });
    const resetUILink = `${env_1.envVars.URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
    yield (0, sendEmail_1.sendEmail)({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink,
        },
    });
});
const googleOAuthLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, picture, providerId } = payload;
    if (!email || !name || !providerId) {
        throw new AppError_1.default(400, "Missing required Google OAuth fields");
    }
    let user = yield user_model_1.User.findOne({ email });
    if (!user) {
        // New user — create with GOOGLE provider
        const googleAuthProvider = {
            provider: "GOOGLE",
            providerId,
        };
        user = yield user_model_1.User.create({
            name,
            email,
            picture,
            role: user_interface_1.Role.USER,
            isVerified: true,
            isActive: user_interface_1.IsActive.ACTIVE,
            auths: [googleAuthProvider],
            subscription: { isActive: false },
        });
    }
    else {
        // Existing user — check they're not blocked/deleted
        if (user.isActive === user_interface_1.IsActive.BLOCKED ||
            user.isActive === user_interface_1.IsActive.INACTIVE) {
            throw new AppError_1.default(400, `User is ${user.isActive}`);
        }
        if (user.isDeleted) {
            throw new AppError_1.default(400, "User is deleted");
        }
        // Add GOOGLE provider to auths if not already present
        const alreadyHasGoogle = (_a = user.auths) === null || _a === void 0 ? void 0 : _a.some((a) => a.provider === "GOOGLE");
        if (!alreadyHasGoogle) {
            user.auths = [...(user.auths || []), { provider: "GOOGLE", providerId }];
            yield user.save();
        }
    }
    const tokens = (0, userTokens_1.createUserTokens)(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _b = user.toObject(), { password: _pass } = _b, rest = __rest(_b, ["password"]);
    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: rest,
    };
});
const resetPasswordWithToken = (id, token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    let decoded;
    console.log("service", id, token, newPassword);
    try {
        decoded = (0, jwt_1.verifyToken)(token, env_1.envVars.JWT_SECRET);
    }
    catch (_a) {
        throw new AppError_1.default(401, "Reset link is invalid or has expired");
    }
    if (decoded.purpose !== "PASSWORD_RESET") {
        throw new AppError_1.default(401, "Invalid reset token");
    }
    console.log(decoded.id);
    console.log("id from payload", id);
    if (decoded.userId !== id) {
        throw new AppError_1.default(401, "Reset link is invalid or has expired");
    }
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(400, "User is deleted");
    }
    if (user.isActive === user_interface_1.IsActive.BLOCKED ||
        user.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(400, `User is ${user.isActive}`);
    }
    const isSamePassword = yield bcryptjs_1.default.compare(newPassword, user.password);
    if (isSamePassword) {
        throw new AppError_1.default(400, "New password must be different from old password");
    }
    user.password = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    yield user.save();
});
const changePassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError_1.default(400, "user not found");
    }
    const isOldPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(401, "Old password does not match");
    }
    if (newPassword === oldPassword) {
        throw new AppError_1.default(400, "New password must be different from old password");
    }
    const hashNewPassword = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user.password = hashNewPassword;
    yield user.save();
});
exports.AuthServices = {
    credentialLogin,
    getNewAccessToken,
    resetPassword,
    forgotPassword,
    googleOAuthLogin,
    resetPasswordWithToken,
    changePassword,
};
