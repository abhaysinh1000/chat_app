import {
  markConversationAsSeen,
  sendMessageServices,
} from "../../module/chat/message.service.js";

export const handleMessageEvents = (socket, io, userId) => {
  // SEND MESSAGE
  socket.on("send_message", async (data, callback) => {
    try {
      const { conversationId, text } = data;

      const message = await sendMessageServices({
        senderId: userId,
        conversationId,
        text,
      });

      io.to(conversationId).emit("receive_message", message);

      socket.to(conversationId).emit("new_notification", {
        conversationId,
        message,
      });

      if (callback) {
        callback({ success: true, data: message });
      }
    } catch (error) {
      console.error("Message error:", error.message);
      if (callback) {
        callback({ success: false, message: error.message });
      }
    }
  });

  // SEEN
  socket.on("mark_seen", async ({ conversationId }) => {
    try {
      await markConversationAsSeen({
        conversationId,
        userId,
      });

      socket.to(conversationId).emit("messages_seen", {
        conversationId,
        userId,
      });
    } catch (error) {
      console.error("Seen error:", error.message);
    }
  });
};
