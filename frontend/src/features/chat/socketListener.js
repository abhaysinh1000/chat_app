import { getSocket } from "./socket";
import {
  addMessage,
  setOnlineUsers,
  setTyping,
  removeTyping,
  addNotification,
} from "./chatSlice";

export const initSocketListeners = (dispatch, getState) => {
  const socket = getSocket();
  if (!socket) return;

  // =========================
  // RECEIVE MESSAGE
  // =========================
  socket.on("receive_message", (message) => {
    const state = getState();
    const selected = state.chat.selectedConversation;

    // if user is inside that chat → add message
    if (selected && selected._id === message.conversation) {
      dispatch(addMessage(message));
    } else {
      // otherwise → notification
      dispatch(
        addNotification({
          conversationId: message.conversation,
          message,
        })
      );
    }
  });

  // =========================
  // ONLINE USERS
  // =========================
  socket.on("online_users", (users) => {
    dispatch(setOnlineUsers(users));
  });

  // =========================
  // TYPING
  // =========================
  socket.on("typing", ({ userId }) => {
    dispatch(setTyping(userId));
  });

  socket.on("stop_typing", ({ userId }) => {
    dispatch(removeTyping(userId));
  });

  // =========================
  // NOTIFICATIONS
  // =========================
  socket.on("new_notification", (data) => {
    dispatch(addNotification(data));
  });
};
