import { verifyToken } from "../utils/token.utils.js";



const socketAuthMiddleware = async (socket, next) => {
  try {
    // read cookie
    const cookieHeader = socket.request.headers.cookie || "";

    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("accesstoken="))
      ?.split("=")[1];

    if (!token) {
      return next(new Error("Unauthorized: No token"));
    }

    const decoded = verifyToken(token);

    socket.user = { _id: decoded.id };

    next();
  } catch (err) {
    next(new Error("Invalid Token"));
  }
};

export default socketAuthMiddleware;