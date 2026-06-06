import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000";

export function useAuthUser() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userProfile");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("accessToken");
  });

  const [loading, setLoading] = useState(Boolean(accessToken));
  const [error, setError] = useState(null);

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

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch user");
        }

        setUser(data.user);
        localStorage.setItem("userProfile", JSON.stringify(data.user));
      } catch (err) {
        setError(err.message);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userProfile");
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [accessToken]);

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userProfile");
    setAccessToken(null);
    setUser(null);
  }

  return {
    user,
    accessToken,
    isAuthenticated: Boolean(accessToken && user),
    loading,
    error,
    logout,
  };
}
