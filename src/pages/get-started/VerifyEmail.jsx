import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSendOtp } from "@/hooks/useSendOtp";
import { maskEmail } from "@/lib/utils";
import { VerifyEmailSchema } from "@/schemas";
import { verifyEmail } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, MailCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const RESEND_OTP_TIME = 60;

function VerifyEmail() {
  const { login, token, email, otp, username } = useAuth();
  const navigate = useNavigate();

  const [secondsLeft, setSecondsLeft] = useState(RESEND_OTP_TIME);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email && username) {
      navigate("/get-started/bind-email", { replace: true });
    } else if (!email) {
      navigate("/get-started", { replace: true });
    }
  }, [navigate, email, username]);

  useEffect(() => {
    if (otp) {
      navigate("/get-started/username", { replace: true });
    }
  }, [navigate, otp]);

  useEffect(() => {
    if (canResend) return;

    if (secondsLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsLeft, canResend]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(VerifyEmailSchema),
  });

  const { mutate: verifyEmailMutation, isPending: verifyEmailPending } =
    useMutation({
      mutationFn: (data) => verifyEmail(data),
      onSuccess: async (data, variable) => {
        if (data.status === 200) {
          const content = data.data.content;

          if (!content.username) {
            login({
              token,
              email,
              user: null,
              otp: variable.otp,
              username: null,
            });

            navigate("/get-started/username", { replace: true });
          } else {
            login({
              token,
              email,
              user: null,
              otp: null,
              username: content.username,
            });

            navigate("/get-started/account-configuration", { replace: true });
          }

          toast.success("Email verified successfully");
          reset();
        } else {
          toast.error("Something went wrong");
        }
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Verification failed");
      },
    });

  const { resendOTPMutation, resendOTPPending } = useSendOtp();

  const isBusy = verifyEmailPending || resendOTPPending;

  const handleResendOTP = () => {
    if (!email || resendOTPPending || !canResend) return;

    resendOTPMutation(
      { email },
      {
        onSuccess: () => {
          setCanResend(false);
          setSecondsLeft(RESEND_OTP_TIME);
          toast.success("Verification code resent");
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || "Could not resend code",
          );
        },
      },
    );
  };

  const onSubmit = (data) => {
    verifyEmailMutation({ ...data, email });
  };

  const formattedTime = `${String(Math.floor(secondsLeft / 60)).padStart(
    2,
    "0",
  )}:${String(secondsLeft % 60).padStart(2, "0")}`;

  if (!email) return null;

  return (
    <div className="text-left">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1]">
          <MailCheck className="h-5 w-5" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-[#101828] md:text-[28px]">
          Check your email
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#667085] md:text-base">
          Enter the six-digit code sent to{" "}
          <span className="font-medium text-[#344054]">{maskEmail(email)}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <CustomInput
          className="h-12 rounded-xl text-center text-lg font-semibold tracking-[0.35em]"
          label="Verification code"
          placeholder="000000"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          error={errors.otp?.message}
          maxLength={6}
          {...register("otp", {
            onChange: (e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
            },
          })}
          disabled={isBusy}
        />

        <Button
          className="h-11 w-full rounded-xl bg-[#2F0FD1] text-sm font-medium shadow-sm transition hover:bg-[#2409B8]"
          type="submit"
          disabled={isBusy}
        >
          {verifyEmailPending ? "Verifying..." : "Verify email"}
          {!verifyEmailPending ? <ArrowRight className="h-4 w-4" /> : null}
        </Button>

        <div className="rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-4 py-3 text-center text-sm text-[#667085]">
          {!canResend ? (
            <span>
              Resend code in{" "}
              <span className="font-semibold text-[#101828]">
                {formattedTime}
              </span>
            </span>
          ) : (
            <span>
              Didn&apos;t receive it?{" "}
              <button
                onClick={handleResendOTP}
                disabled={resendOTPPending}
                type="button"
                className="font-semibold text-[#2F0FD1] transition hover:text-[#2409B8] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
              >
                {resendOTPPending ? "Resending..." : "Resend code"}
              </button>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

export default VerifyEmail;
