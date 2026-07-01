"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordZodSchema = exports.resetPasswordZodSchema = exports.forgotPasswordZodSchema = exports.restPasswordZodSchema = exports.userLoginZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userLoginZodSchema = zod_1.default.object({
    email: zod_1.default
        .string({ error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    password: zod_1.default
        .string({ error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }),
});
exports.restPasswordZodSchema = zod_1.default.object({
    oldPassword: zod_1.default
        .string({ error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }),
    newPassword: zod_1.default
        .string({ error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }),
});
exports.forgotPasswordZodSchema = zod_1.default.object({
    email: zod_1.default
        .string({ error: "Email must be string" })
        .email({ message: "Invalid email address format." }),
});
const strongPasswordZodSchema = zod_1.default
    .string({ error: "Password must be string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
    message: "Password must contain at least 1 uppercase letter.",
})
    .regex(/^(?=.*[!@#$%^&*])/, {
    message: "Password must contain at least 1 special character.",
})
    .regex(/^(?=.*\d)/, {
    message: "Password must contain at least 1 number.",
});
exports.resetPasswordZodSchema = zod_1.default.object({
    id: zod_1.default.string({ error: "User id is required" }).min(1, {
        message: "User id is required",
    }),
    token: zod_1.default.string({ error: "Reset token is required" }).min(1, {
        message: "Reset token is required",
    }),
    newPassword: strongPasswordZodSchema,
});
exports.changePasswordZodSchema = zod_1.default.object({
    oldPassword: strongPasswordZodSchema,
    newPassword: strongPasswordZodSchema,
});
