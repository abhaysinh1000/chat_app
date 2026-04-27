const isProduction = process.env.NODE_ENV === "production";

export const cookieConfig = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",
};

export const TOKEN_EXPIRY = {
  accesstoken: 30 * 60 * 1000,
  refreshtoken: 7 * 24 * 60 * 60 * 1000,
};
