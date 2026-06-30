import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many failed attempts. Please try again in 1 minute.",
  },
});

export const rateLimiters = { authLimiter };
