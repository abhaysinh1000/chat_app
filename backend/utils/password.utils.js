import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (plain_password, hash_password) => {
  return await bcrypt.compare(plain_password, hash_password);
};
