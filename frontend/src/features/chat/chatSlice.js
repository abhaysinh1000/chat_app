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
  setOnlineUsers,
  setTyping,
  removeTyping,
  addNotification,
  clearNotifications,
} = chatSlice.actions;

export default chatSlice.reducer;