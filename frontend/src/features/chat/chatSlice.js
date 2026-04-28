import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedConversation: null,

  messages: [],

  typingUsers: [],

  onlineUsers: [],

  notifications: [], // for unread / alerts
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // =========================
    // SELECT CHAT
    // =========================
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
      state.messages = []; // reset when switching chat
      state.typingUsers = [];
    },

    // =========================
    // SET MESSAGES (API load)
    // =========================
    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    // =========================
    // ADD MESSAGE (socket)
    // =========================
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    markConversationSeenByUser: (state, action) => {
      const { conversationId, userId } = action.payload;

      if (state.selectedConversation?._id !== conversationId) return;

      state.messages = state.messages.map((message) => {
        const seenBy = message.seenBy || [];
        const hasUser = seenBy.some((id) => String(id) === String(userId));

        if (hasUser) return message;

        return {
          ...message,
          seenBy: [...seenBy, userId],
        };
      });
    },

    // =========================
    // ONLINE USERS
    // =========================
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    // =========================
    // TYPING USERS
    // =========================
    setTyping: (state, action) => {
      const userId = action.payload;

      if (!state.typingUsers.includes(userId)) {
        state.typingUsers.push(userId);
      }
    },

    removeTyping: (state, action) => {
      state.typingUsers = state.typingUsers.filter(
        (id) => id !== action.payload
      );
    },

    // =========================
    // NOTIFICATIONS
    // =========================
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },

    clearNotifications: (state, action) => {
      const conversationId = action.payload;

      state.notifications = state.notifications.filter(
        (n) => n.conversationId !== conversationId
      );
    },
  },
});

export const {
  setSelectedConversation,
  setMessages,
  addMessage,
  markConversationSeenByUser,
  setOnlineUsers,
  setTyping,
  removeTyping,
  addNotification,
  clearNotifications,
} = chatSlice.actions;

export default chatSlice.reducer;
