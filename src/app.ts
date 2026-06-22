import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import expressSession from "express-session";
import passport from "passport";
import { envVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { PaymentControllers } from "./app/modules/payment/payment.controller";
import { router } from "./app/routes";

const app = express();
app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  PaymentControllers.handleWebhook,
);
//middlewares
app.use(
  expressSession({
    secret: "Your secret",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to travel-360 backend 🚀",
  });
});

app.use(
  cors({
    origin: [envVars.URL as string, "http://localhost:3000"],
    credentials: true,
  }),
);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
