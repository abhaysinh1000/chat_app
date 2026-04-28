import { getSocket } from "./socket";
import {
  addMessage,
  setOnlineUsers,
  setTyping,
  removeTyping,
  addNotification,
  markConversationSeenByUser,
} from "./chatSlice";

export const initSocketListeners = (dispatch, getState) => {
  const socket = getSocket();
  if (!socket) return () => {};

  // =========================
  // RECEIVE MESSAGE
  // =========================
  const onReceiveMessage = (message) => {
    const state = getState();
    const selected = state.chat.selectedConversation;

    // if user is inside that chat → add message
    if (selected && selected._id === String(message.conversation)) {
      dispatch(addMessage(message));
      socket.emit("mark_seen", { conversationId: selected._id });
    } else {
      // otherwise → notification
      dispatch(
        addNotification({
          conversationId: message.conversation,
          message,
        })
      );
    }
  };
  socket.on("receive_message", onReceiveMessage);

  // =========================
  // ONLINE USERS
  // =========================
  const onOnlineUsers = (users) => {
    dispatch(setOnlineUsers(users));
  };
  socket.on("online_users", onOnlineUsers);

  // =========================
  // TYPING
  // =========================
  const onTyping = ({ userId, conversationId }) => {
    const selectedId = getState().chat.selectedConversation?._id;
    if (!selectedId || selectedId !== conversationId) return;
    dispatch(setTyping(userId));
  };
  socket.on("typing", onTyping);

  const onStopTyping = ({ userId, conversationId }) => {
    const selectedId = getState().chat.selectedConversation?._id;
    if (!selectedId || selectedId !== conversationId) return;
    dispatch(removeTyping(userId));
  };
  socket.on("stop_typing", onStopTyping);

  const onMessagesSeen = ({ conversationId, userId }) => {
    dispatch(markConversationSeenByUser({ conversationId, userId }));
  };
  socket.on("messages_seen", onMessagesSeen);

  // =========================
  // NOTIFICATIONS
  // =========================
  const onNewNotification = (data) => {
    dispatch(addNotification(data));
  };
  socket.on("new_notification", onNewNotification);

  return () => {
    socket.off("receive_message", onReceiveMessage);
    socket.off("online_users", onOnlineUsers);
    socket.off("typing", onTyping);
    socket.off("stop_typing", onStopTyping);
    socket.off("messages_seen", onMessagesSeen);
    socket.off("new_notification", onNewNotification);
  };
};
