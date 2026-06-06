import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createTransform,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import walletReducer from "./walletSlice";
import socketfiAuthReducer from "./socketfiAuthSlice";
import authReducer from "./authSlice";

export const socketfiAuthExpiryTransform = createTransform(
  (inboundState) => inboundState,

  (outboundState) => {
    if (outboundState?.expiresAt && Date.now() > outboundState.expiresAt) {
      return {
        session: null,
        accessToken: null,
        expiresAt: null,
      };
    }

    return outboundState;
  },

  {
    whitelist: ["socketfiAuth"],
  },
);

const persistConfig = {
  key: "root",
  storage,
  // whitelist: ["wallet", "auth"],
  whitelist: ["auth", "socketfiAuth"],
  transforms: [socketfiAuthExpiryTransform],
};

const rootReducer = combineReducers({
  wallet: walletReducer,
  auth: authReducer,
  socketfiAuth: socketfiAuthReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
