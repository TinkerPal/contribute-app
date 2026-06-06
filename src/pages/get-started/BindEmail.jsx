import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import CustomInput from "@/components/CustomInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BindEmailSchema } from "@/schemas";
import { useEffect } from "react";
import { bindEmail } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, MailPlus } from "lucide-react";

function BindEmail() {
  const { login, token, email, otp, username } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      navigate("/get-started/username", { replace: true });
    }
  }, [navigate, username]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(BindEmailSchema),
    mode: "onChange",
  });

  const { mutate: sendOTPMutation, isPending: sendOTPPending } = useMutation({
    mutationFn: (data) => bindEmail(data),
    onSuccess: async (data, variables) => {
      if (data.status === 200) {
        login({
          token,
          email: variables.email,
          user: null,
          otp: null,
          username,
        });

        navigate("/get-started/verify-email", { replace: true });
        toast.success("Verification code sent");
      } else {
        toast.error("Something went wrong");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to send code");
    },
  });

  const handleSkip = () => {
    login({
      token,
      email,
      user: null,
      otp,
      username,
    });
  };

  const onSubmit = (data) => {
    sendOTPMutation({
      email: data.email.trim().toLowerCase(),
    });
  };

  return (
    <div className="text-left">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1]">
          <MailPlus className="h-5 w-5" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-[#101828] md:text-[28px]">
          Add your email
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#667085] md:text-base">
          Use an email you can access. We’ll send a verification code to confirm
          it belongs to you.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <CustomInput
          className="h-12 rounded-xl"
          label="Email address"
          placeholder="Enter your email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
          disabled={sendOTPPending}
        />

        <Button
          className="h-11 w-full rounded-xl bg-[#2F0FD1] text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
          type="submit"
          disabled={sendOTPPending}
        >
          {sendOTPPending ? "Sending code..." : "Continue"}
          {!sendOTPPending ? <ArrowRight className="h-4 w-4" /> : null}
        </Button>

        <div className="rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-4 py-3 text-center text-sm text-[#667085]">
          Want to finish this later?{" "}
          <Link
            to="/get-started/account-configuration"
            onClick={handleSkip}
            className="font-semibold text-[#2F0FD1] transition hover:text-[#2409B8]"
          >
            Skip for now
          </Link>
        </div>
      </form>
    </div>
  );
}

export default BindEmail;
