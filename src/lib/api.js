import axios from "axios";
import { store } from "@/store";
import { logout } from "@/store/authSlice";
import { removeItemFromLocalStorage } from "@/lib/utils";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes("/auth/");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      store.dispatch(logout());
      removeItemFromLocalStorage("accessToken");
      removeItemFromLocalStorage("user");
      removeItemFromLocalStorage("network");
      removeItemFromLocalStorage("publicKey");

      // const currentPath = window.location.pathname;
      // const redirectUrl =
      //   currentPath !== "/"
      //     ? `?redirect=${encodeURIComponent(currentPath)}`
      //     : "";
      window.location.href = `/get-started`;
    }

    return Promise.reject(error);
  },
);

export default api;
