import User from "../module/auth/auth.model.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/token.utils.js";

export const Auth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accesstoken;

  if (!token) {
    throw new AppError("Unauthrized - no token ", 401);
  }

  const decodedToken = await verifyToken(token);
  const user = await User.findById(decodedToken.id);

  if (!user) {
    throw new AppError("Unauthrized - no token ", 401);
  }

  // if (user.isVerified === false) {
  //   throw new AppError("User is not verified - verify user ", 403);
  // }

  req.user = user;
  next();
});
