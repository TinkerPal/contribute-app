import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  publicKey: "",
  network: "",

  stellarWalletKitIsOpen: false,
  authModalOpen: false,

  isLoading: false,
};

const walletSlice = createSlice({
  name: "wallet",

  initialState,

  reducers: {
    setPublicKey: (state, action) => {
      state.publicKey = action.payload;
    },

    setNetwork: (state, action) => {
      state.network = action.payload;
    },

    setStellarWalletKitIsOpen: (state, action) => {
      state.stellarWalletKitIsOpen = action.payload;
    },

    setAuthModalOpen: (state, action) => {
      state.authModalOpen = action.payload;
    },

    setWalletLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    clearWallet: (state) => {
      state.publicKey = "";
      state.network = "";

      state.stellarWalletKitIsOpen = false;
      state.authModalOpen = false;

      state.isLoading = false;
    },
  },
});

export const {
  setPublicKey,
  setNetwork,
  setStellarWalletKitIsOpen,
  setAuthModalOpen,
  clearWallet,
  setWalletLoading,
} = walletSlice.actions;

export default walletSlice.reducer;
