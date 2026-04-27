import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthticated: false,
};

const authSlice = createSlice({
  name: "Auth",
  initialState: initialState,
  reducers: {
    setAuthUser: (state, action) => {
      ((state.user = action.payload),
        (state.isAuthticated = Boolean(action.payload)));
    },

    clearAuth: (state) => {
      state.user=null
      state.isAuthticated=false
    },
  },
});

export const { setAuthUser, clearAuth } = authSlice.actions;

export default authSlice.reducer;
