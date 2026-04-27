import express from "express";
import authRouter from "../module/auth/auth.routes.js";
import userRouter from "../module/user/user.routes.js";
import messageRouter from "../module/chat/message.routes.js";
import conversationRouter from "../module/chat/conversation.routes.js";

const mainRoute = express.Router();

mainRoute.use("/auth", authRouter);
mainRoute.use("/user", userRouter);



mainRoute.use("/message", messageRouter);
mainRoute.use("/conversation", conversationRouter);

export default mainRoute;
