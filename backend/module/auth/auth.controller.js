import { hashPassword, verifyPassword } from "../../utils/password.utils.js";
import { generateToken, verifyToken } from "../../utils/token.utils.js";
import User from "./auth.model.js";
import RefreshToken from "./auth.token.model.js";
import { cookieConfig, TOKEN_EXPIRY } from "../../config/cookie.config.js";
import verification from "./auth.verification.model.js";
import { sendEmail } from "../../utils/email.js";
import { emailTemplates } from "../../utils/templates.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import crypto from "crypto";
import ResetToken from "./auth.resettoken.model.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("User not exists, please signup", 404);
  }

  const checkPassword = await verifyPassword(password, user.password);

  if (!checkPassword) {
    throw new AppError("Incorrect password", 401);
  }

  const token = await generateToken({ id: user._id });

  await RefreshToken.create({
    userId: user._id,
    token: token.refreshToken,
    expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.cookie("accesstoken", token.accessToken, {
    ...cookieConfig,
    maxAge: TOKEN_EXPIRY.accesstoken,
  });

  res.cookie("refreshToken", token.refreshToken, {
    ...cookieConfig,
    maxAge: TOKEN_EXPIRY.refreshtoken,
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      _id: user._id,
      firstName: user.firstName, // ✅ camelCase
      lastName: user.lastName, // ✅ camelCase
      email: user.email,
      isVerified: user.isVerified,
    },
  });
});

export const signUp = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const checkEmail = await User.findOne({ email });

  if (checkEmail) {
    throw new AppError("User already exists, please login", 400);
  }

  const hashpassword = await hashPassword(password);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashpassword,
  });

  const token = crypto.randomBytes(32).toString("hex");

  await verification.create({
    userId: user._id, // ✅ was user: user._id before, make sure model matches
    token,
    expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  // const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email/${token}`;
  const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email/${token}`;
  console.log("BACKEND_URL value:", process.env.BACKEND_URL);
  console.log("Full verification link:", verificationLink);

  const { subject, html } = emailTemplates.verifyEmail(
    verificationLink,
    user.firstName,
  );

  await sendEmail({
    to: user.email,
    subject,
    html,
  });

  return res.status(201).json({
    success: true,
    message: "User registered. Please verify your email.",
  });
});

export const refreshtoken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  console.log("cookie token:", token);

  const allTokens = await RefreshToken.find();
  console.log(
    "DB tokens:",
    allTokens.map((t) => t.token),
  );

  if (!token) {
    throw new AppError(`Invalid Token `, 403);
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    throw new AppError("Invalid Token ", 403);
  }

  const savedToken = await RefreshToken.findOne({
    userId: decoded.id,
    token: token,
  });

  if (!savedToken) {
    throw new AppError("Invalid Token ", 403);
  }

  if (savedToken.expireAt < new Date()) {
    throw new AppError("Token expired try login ", 404);
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError("Invalid Token ", 403);
  }

  await RefreshToken.deleteMany({ userId: user._id });

  const newRefreshToken = await generateToken({ id: user._id });

  await RefreshToken.create({
    userId: user._id,
    token: newRefreshToken.refreshToken,
    expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.cookie("refreshToken", newRefreshToken.refreshToken, {
    ...cookieConfig,
    maxAge: TOKEN_EXPIRY.refreshtoken,
  });

  res.cookie("accesstoken", newRefreshToken.accessToken, {
    ...cookieConfig,
    maxAge: TOKEN_EXPIRY.accesstoken,
  });

  res.status(200).json({
    success: true,
    message: `Token refresh SuccessFull`,
  });
});

export const sendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("email is required", 403);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("user not exits", 403);
  }

  if (user.isVerified === true) {
    throw new AppError("user already verifired", 403);
  }

  await verification.deleteMany({ userId: user._id });

  const token = crypto.randomBytes(32).toString("hex");

  await verification.create({
    userId: user._id,
    token: token,
    expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email/${token}`;

  const { subject, html } = emailTemplates.verifyEmail(
    verificationLink,
    user.firstName,
  );
  await sendEmail({ to: user.email, subject, html });

  res.status(200).json({
    success: true,
    message: "verification Email send successFull",
  });
});

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      throw new AppError("Invalid request", 400);
    }

    const savedToken = await verification.findOne({ token });

    if (!savedToken) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?verified=false`);
    }

    if (savedToken.expireAt < Date.now()) {
      await verification.deleteOne({ token });
      return res.redirect(`${process.env.FRONTEND_URL}/login?verified=expired`);
    }

    await User.findByIdAndUpdate(savedToken.userId, { isVerified: true });

    await verification.deleteOne({ token });

    // ONLY redirect, no json response before this
    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (error) {
    next(error);
  }
};

export const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("email is required", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not exits", 404);
  }

  // if (user.isVerified === false) {
  //   throw new AppError("Please Verify the Account First ", 403);
  // }

  await ResetToken.deleteMany({ userId: user._id });

  const token = crypto.randomBytes(32).toString("hex");

  await ResetToken.create({
    userId: user._id,
    token: token,
    expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const verificationLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const { subject, html } = emailTemplates.resetPassword(verificationLink);

  await sendEmail({ to: user.email, subject, html });

  return res.status(200).json({
    success: true,
    message: `reset password Link sent to ${user.email}`,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    throw new AppError("Invalid request", 404);
  }

  if (!password) {
    throw new AppError("Enter new Password", 403);
  }

  const savedToken = await ResetToken.findOne({ token });

  if (!savedToken) {
    throw new AppError("Invalid Token", 403);
  }

  if (savedToken.expiredAt < new Date()) {
    throw new AppError("Link expired reset password again ", 403);
  }

  const hashedpassword = await hashPassword(password);

  // Because findByIdAndUpdate expects the id value directly, not an object:
  await User.findByIdAndUpdate(savedToken.userId, {
    password: hashedpassword,
  });

  await ResetToken.deleteOne({ token });

  res.status(200).json({
    success: true,
    message: "password reset SuccessFull",
  });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new AppError("Already logout ", 400);
  }

  await RefreshToken.deleteOne({ token });

  res.clearCookie("accesstoken", cookieConfig);
  res.clearCookie("refreshToken", cookieConfig);

  return res.status(200).json({
    success: true,
    message: "Logout SuccessFull ",
  });
});
