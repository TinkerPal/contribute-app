import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  email: null,
  otp: null,
  username: null,
  authMethod: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setOtp: (state, action) => {
      state.otp = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setAuthMethod: (state, action) => {
      state.authMethod = action.payload;
    },
    login: (state, action) => {
      const { token, email, user, otp, username, authMethod } = action.payload;
      state.token = token || null;
      state.user = user || null;
      state.email = email || null;
      state.otp = otp || null;
      state.username = username || null;
      state.authMethod = authMethod || null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.email = null;
      state.otp = null;
      state.username = null;
      state.authMethod = null;
    },
  },
});

export const {
  setUser,
  setToken,
  setEmail,
  setOtp,
  setUsername,
  setAuthMethod,
  login,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
