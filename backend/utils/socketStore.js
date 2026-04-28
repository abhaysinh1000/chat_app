const userSocketMap = new Map();

export const addUserSocket = (userId, socketId) => {
  if (!userId || !socketId) return;
  userSocketMap.set(userId.toString(), socketId);
};

export const removeUserSocket = (socketId) => {
  for (const [userId, sId] of userSocketMap.entries()) {
    if (sId === socketId) {
      userSocketMap.delete(userId);
      break;
    }
  }
};

export const getSocketByUserId = (userId) => {
  return userSocketMap.get(userId.toString());
};

export const getOnlineUsers = () => {
  return Array.from(userSocketMap.keys());
};
