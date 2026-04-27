import jwt from "jsonwebtoken";

 export const generateToken = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
