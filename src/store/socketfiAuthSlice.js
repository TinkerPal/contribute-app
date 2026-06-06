import { createSlice } from "@reduxjs/toolkit";

// const ONE_HOUR = 60 * 60 * 1000;
const TTL = 10 * 1000;

const initialState = {
  userProfile: null,
  accessToken: null,
  expiresAt: null,
};

const socketfiAuthSlice = createSlice({
  name: "socketfiAuth",

  initialState,

  reducers: {
    setSocketfiSession: (state, action) => {
      state.userProfile = action.payload?.userProfile || null;

      state.accessToken = action.payload?.accessToken || null;

      state.expiresAt = Date.now() + TTL;
    },

    clearSocketfiSession: (state) => {
      state.userProfile = null;
      state.accessToken = null;
      state.expiresAt = null;
    },
  },
});

export const { setSocketfiSession, clearSocketfiSession } =
  socketfiAuthSlice.actions;

export default socketfiAuthSlice.reducer;
