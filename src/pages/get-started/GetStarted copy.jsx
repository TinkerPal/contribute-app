import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";
import { ConnectWithEmailSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { connectWithEmail } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { ArrowRight, WalletCards } from "lucide-react";
import { SocketFiProvider, useSocketFi } from "@socketfi/react";

function GetStarted() {
  const { login } = useAuth();
  const {
    handleOpenStellarWalletKitModal,
    isLoading: isWalletLoading,
    setWalletLoading,
  } = useWallet();

  const navigate = useNavigate();
  const [revealPassword, setRevealPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isBusy = isGoogleLoading || isWalletLoading;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(ConnectWithEmailSchema),
  });

  const {
    mutate: connectWithEmailMutation,
    isPending: connectWithEmailPending,
  } = useMutation({
    mutationFn: (data) => connectWithEmail(data),
    onSuccess: async (data) => {
      if (data.status === 200) {
        const content = data.data.content;
        const token = content.accessToken?.token;
        const email = content.email;

        if (!content.isVerified) {
          login({ token, email, user: null, otp: null, username: null });
          navigate("/get-started/verify-email");
        } else if (!content.username) {
          login({ token, email, user: null, otp: "123456", username: null });
          navigate("/get-started/username");
        } else {
          login({
            token,
            email: null,
            user: content,
            otp: null,
            username: null,
          });
          navigate("/", { replace: true });
          toast.success("Login successful");
          reset();
        }
      } else {
        toast.error("Something went wrong");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Login failed");
    },
  });

  const onSubmit = (data) => {
    connectWithEmailMutation(data);
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
  };

  const handleWalletLogin = () => {
    handleOpenStellarWalletKitModal();
  };

  useEffect(() => {
    setIsGoogleLoading(false);
    setWalletLoading(false);
  }, []);

  return (
    <div className="text-left">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1]">
          <WalletCards className="h-5 w-5" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-[#101828] md:text-[28px]">
          Welcome back
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#667085] md:text-base">
          Sign in to discover tasks, manage applications, and continue your
          contributor journey.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            disabled={connectWithEmailPending || isBusy}
            className="h-12 w-full justify-center gap-2 rounded-xl border border-[#EAECF0] bg-white text-sm font-medium text-[#101828] shadow-sm transition hover:border-[#D7DDF0] hover:bg-[#F8FAFC]"
            variant="outline"
            onClick={handleWalletLogin}
          >
            {isWalletLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#D0D5DD] border-t-[#2F0FD1]" />
            ) : (
              <img
                className="h-6 w-6 rounded-full"
                src="/cryptoIcons/12000000.svg"
                alt="Wallet"
              />
            )}
            Wallet
          </Button>

          <Button
            disabled={
              connectWithEmailPending ||
              !import.meta.env.VITE_GOOGLE_AUTH_URL ||
              isBusy
            }
            onClick={handleGoogleLogin}
            className="h-12 w-full justify-center gap-2 rounded-xl border border-[#EAECF0] bg-white text-sm font-medium text-[#101828] shadow-sm transition hover:border-[#D7DDF0] hover:bg-[#F8FAFC]"
            variant="outline"
          >
            {isGoogleLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#D0D5DD] border-t-[#2F0FD1]" />
            ) : (
              <FcGoogle className="h-5 w-5" />
            )}
            Google
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[#EAECF0]" />
          <span className="text-xs font-medium text-[#98A2B3]">
            or continue with email
          </span>
          <div className="h-px flex-1 bg-[#EAECF0]" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <CustomInput
            className="h-11 rounded-xl"
            label="Email address"
            autoComplete="email"
            placeholder="Enter your email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
            disabled={connectWithEmailPending || isBusy}
          />

          <CustomInput
            className="h-11 rounded-xl"
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            type={revealPassword ? "text" : "password"}
            icon={revealPassword ? <IoMdEyeOff /> : <IoEye />}
            handleClickIcon={() => setRevealPassword((current) => !current)}
            error={errors.password?.message}
            {...register("password")}
            disabled={connectWithEmailPending || isBusy}
          />

          <Button
            className="mt-2 h-11 w-full rounded-xl bg-[#2F0FD1] text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
            type="submit"
            disabled={connectWithEmailPending || isBusy}
          >
            {connectWithEmailPending ? "Processing..." : "Continue"}
            {!connectWithEmailPending ? (
              <ArrowRight className="h-4 w-4" />
            ) : null}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default GetStarted;
