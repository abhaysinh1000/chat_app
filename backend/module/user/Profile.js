import { email } from "zod";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const Profile = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    data: {
      _id: user._id,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isVerified: user.isVerified,
    },
  });
});
