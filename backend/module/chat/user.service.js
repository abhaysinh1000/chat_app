import User from "../auth/auth.model.js";

export const searchUsersService = async (query, currentUserId) => {
  if (!query) return [];

  const users = await User.find({
    _id: { $ne: currentUserId }, // exclude self
    username: { $regex: query, $options: "i" }, // case-insensitive
  })
    .select("_id username")
    .limit(10);

  return users;
};
