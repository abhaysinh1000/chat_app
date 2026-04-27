export const handleChannelEvents = (socket) => {
  socket.on("join_channel", ({ channelId }) => {
    socket.join(channelId);
  });
};