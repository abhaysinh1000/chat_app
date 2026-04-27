import express from "express";
import {
  forgetPassword,
  login,
  logout,
  refreshtoken,
  resetPassword,
  sendVerificationEmail,
  signUp,
  verifyEmail,
} from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { loginSchema, signupSchema } from "./auth.schema.js";
import { Auth } from "../../middleware/auth.js";
import {
  forgetPasswordLimiter,
  loginLimter,
  signupLimiter,
  verifyEmailLimiter,
} from "../../middleware/rateLimiter.js";

const authRouter = express.Router();

authRouter.post("/login", loginLimter, validate(loginSchema), login);
authRouter.post("/signup", signupLimiter, validate(signupSchema), signUp);
authRouter.get("/verify-email/:token", verifyEmailLimiter, verifyEmail);
authRouter.get("/refresh-token", refreshtoken);
authRouter.post("/send-email-verification", sendVerificationEmail);
authRouter.post("/forgetPassword", forgetPasswordLimiter, forgetPassword);
authRouter.post("/resetPassword/:token", resetPassword);
authRouter.post("/refresh-token", refreshtoken);
authRouter.post("/logout", logout);

export default authRouter;
