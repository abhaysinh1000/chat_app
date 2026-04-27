export const handleTypingEvents = (socket, userId) => {
  socket.on("typing", ({ conversationId }) => {
    if (!conversationId) return;

    socket.to(conversationId).emit("typing", { userId, conversationId });
  });

  socket.on("stop_typing", ({ conversationId }) => {
    if (!conversationId) return;

    socket.to(conversationId).emit("stop_typing", { userId, conversationId });
  });
};
