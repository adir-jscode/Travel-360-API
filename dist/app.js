"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const env_1 = require("./app/config/env");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const payment_controller_1 = require("./app/modules/payment/payment.controller");
const routes_1 = require("./app/routes");
const app = (0, express_1.default)();
app.post("/api/v1/payment/webhook", express_1.default.raw({ type: "application/json" }), payment_controller_1.PaymentControllers.handleWebhook);
//middlewares
app.use((0, express_session_1.default)({
    secret: "Your secret",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// BUG FIX 1: Apply CORS with correct origin + credentials config ONCE, before
// routes. The original code called cors() (wildcard, no credentials) first,
// then a properly-configured cors() AFTER the routes — which never ran for
// API requests. This caused cookies/auth headers to be stripped on all requests.
app.use((0, cors_1.default)({
    origin: [env_1.envVars.URL, "http://localhost:3000"],
    credentials: true,
}));
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to travel-360 backend 🚀",
    });
});
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.default);
exports.default = app;
