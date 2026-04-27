import express from "express";
import { Auth } from "../../middleware/auth.js";
import {
  createConversation,
  createGroup,
  getConversations,
  joinChannelController,
} from "./message.controller.js";
import { createChannel } from "./message.service.js";

const conversationRouter = express.Router();

// private chat
conversationRouter.post("/", Auth, createConversation);

// get all chats
conversationRouter.get("/", Auth, getConversations);

// group
conversationRouter.post("/group", Auth, createGroup);

// channel
conversationRouter.post("/channel", Auth, createChannel);
conversationRouter.post("/channel/join", Auth, joinChannelController);

export default conversationRouter;
