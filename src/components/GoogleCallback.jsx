import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services";
import { PiWarningCircle } from "react-icons/pi";

function GoogleCallback() {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasRun = useRef(false);
  const urlToken = searchParams.get("token");

  useEffect(() => {
    login({
      token: urlToken,
      email: null,
      user: null,
      otp: null,
      username: null,
      authMethod: "GOOGLE",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, isError } = useQuery({
    queryKey: ["getUser"],
    queryFn: getUser,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (!data || hasRun.current) return;

    hasRun.current = true;

    const user = data.data.content;

    if (!user.username) {
      login({
        token,
        email: user.email,
        user: null,
        otp: "123456",
        username: null,
        authMethod: "GOOGLE",
      });
      navigate("/get-started/username", { replace: true });
    } else if (!user.bio && !user.lastLogin) {
      login({
        token,
        email: user.email,
        user: null,
        otp: null,
        username: user.username,
        authMethod: "GOOGLE",
      });
      navigate("/get-started/account-configuration", {
        replace: true,
      });
    } else {
      login({
        token,
        email: null,
        user,
        otp: null,
        username: null,
        authMethod: "GOOGLE",
      });
      toast.success("Login successful");
      navigate("/", { replace: true });
    }
  }, [login, data, navigate, token]);

  if (isError) {
    return (
      <div className="flex w-full flex-col items-center justify-center text-center">
        <PiWarningCircle className="mb-3 text-[40px] text-red-500" />
        <p className="text-sm font-medium text-[#6D7A86]">
          Authentication failed
        </p>
        <p className="mt-1 text-xs text-[#1082E4]">
          An unexpected error occurred.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#1082E4]" />
    </div>
  );
}

export default GoogleCallback;
