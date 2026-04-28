import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io("http://localhost:1000", {
      withCredentials: true,
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
