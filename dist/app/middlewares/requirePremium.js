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
exports.requirePremium = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const user_model_1 = require("../modules/user/user.model");
const requirePremium = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const decodedToken = req.user;
        const userId = decodedToken.userId;
        const user = yield user_model_1.User.findById(userId);
        if (!((_a = user === null || user === void 0 ? void 0 : user.subscription) === null || _a === void 0 ? void 0 : _a.isActive)) {
            throw new AppError_1.default(403, "Premium subscription required");
        }
        next();
    });
};
exports.requirePremium = requirePremium;
