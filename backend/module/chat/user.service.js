import User from "../auth/auth.model.js";

export const searchUsersService = async (query, currentUserId) => {
  if (!query) return [];

  const regex = new RegExp(query, "i");

  const users = await User.find({
    _id: { $ne: currentUserId },
    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
  })
    .select("_id firstName lastName email")
    .limit(10);

  return users;
};
