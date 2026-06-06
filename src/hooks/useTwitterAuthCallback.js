import { useEffect, useRef } from "react";

const API_URL = "http://localhost:4000";

export function useTwitterAuthCallback() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function exchangeCode() {
      const params = new URLSearchParams(window.location.search);

      const auth = params.get("auth");
      const code = params.get("code");

      if (auth !== "success" || !code) return;

      const res = await fetch(`${API_URL}/auth/twitter/exchange`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("userProfile", JSON.stringify(data.user));

      // window.history.replaceState({}, document.title, window.location.pathname);

      // if (window.history.length > 1) {
      //   window.history.back();
      // } else {
      //   window.location.replace("/");
      // }

      const redirectTo = sessionStorage.getItem("auth_redirect");
      console.log("VISIBLE?");
      console.warn("WARNING?");
      console.error("ERROR?");

      if (redirectTo) {
        sessionStorage.removeItem("auth_redirect");
        window.location.replace(redirectTo);
      } else {
        window.location.replace("/");
      }
    }

    exchangeCode();
  }, []);
}
