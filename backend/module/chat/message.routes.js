import express from "express";
// import {
//   sendMessage,
//   getmessage,
// } from "./message.controller.js";
import { Auth } from "../../middleware/auth.js";
import { getmessage, sendMessage } from "./message.controller.js";

const messageRouter = express.Router();

// send message
messageRouter.post("/", Auth, sendMessage);

// get messages
messageRouter.get("/:conversationId", Auth, getmessage);

export default messageRouter;
