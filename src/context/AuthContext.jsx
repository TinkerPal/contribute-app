import { createContext, useEffect, useState } from "react";
import { store } from "@/store";
import { login as reduxLogin } from "@/store/authSlice";

const API_URL = "http://localhost:4000";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("userProfile");
    return saved ? JSON.parse(saved) : null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("accessToken");
  });

  const [loading, setLoading] = useState(true);
  const [passkeyModalIsOpen, setPasskeyModalIsOpen] = useState(false);

  // 🔁 Fetch user on load (or token change)
  useEffect(() => {
    async function fetchUser() {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        setUser(data.user);
        localStorage.setItem("userProfile", JSON.stringify(data.user));
      } catch (err) {
        console.error("Auth fetch failed:", err.message);

        logout(); // 🔥 reset if invalid token
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [accessToken]);

  // 🔐 Login handler (call after Twitter exchange)
  function login({ token, user }) {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userProfile", JSON.stringify(user));

    setAccessToken(token);
    setUser(user);

    store.dispatch(reduxLogin({ token, user }));
  }

  // 🚪 Logout
  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userProfile");

    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: Boolean(user && accessToken),
        loading,
        login,
        logout,
        passkeyModalIsOpen,
        setPasskeyModalIsOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
