import {
  addUserSocket,
  removeUserSocket,
  getOnlineUsers,
} from "../utils/socketStore.js";

import Conversation from "../models/conversation.model.js";

import { handleMessageEvents } from "./handlers/message.handler.js";
import { handleChannelEvents } from "./handlers/channel.handler.js";
import { handleTypingEvents } from "./handlers/typing.handler.js";

const socketHandler = (io) => {
  io.on("connection", async (socket) => {
    const userId = socket.user.id;

    // store user
    addUserSocket(userId, socket.id);
    console.log("User connected:", userId);

    // join rooms
    const conversations = await Conversation.find({
      members: userId,
    });

    conversations.forEach((conv) => {
      socket.join(conv._id.toString());
    });

    socket.on("join_conversation", (conversationId) => {
      if (!conversationId) return;
      socket.join(conversationId.toString());
    });

    // online users
    io.emit("online_users", getOnlineUsers());

    // =========================
    // HANDLERS
    // =========================
    handleMessageEvents(socket, io, userId);
    handleTypingEvents(socket, userId);
    handleChannelEvents(socket);

    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {
      removeUserSocket(socket.id);

      console.log("User disconnected:", userId);

      io.emit("online_users", getOnlineUsers());
    });
  });
};

export default socketHandler;
