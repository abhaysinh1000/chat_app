import rateLimter from "express-rate-limit";

export const signupLimiter = rateLimter({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: {
    success: false,
    message: "TO many attempt try again after 15 min",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimter = rateLimter({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: {
    success: false,
    message: "To many request Try again After 15 min",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const forgetPasswordLimiter = rateLimter({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: {
    success: false,
    message: "Too many request try again after 15 min",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const verifyEmailLimiter = rateLimter({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  message: {
    success: false,
    message: "TOO many requrest Try again After 15 min",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
