import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { setItemInSessionStorage } from "@/lib/utils";
import { UsernameSchema } from "@/schemas";
import { checkUsernameAvailability, createUsername } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  AtSign,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function Username() {
  const { login, token, otp, username, email } = useAuth();
  const navigate = useNavigate();

  const [usernameInput, setUsernameInput] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedUsername(usernameInput.trim());
    }, 500);

    return () => window.clearTimeout(handler);
  }, [usernameInput]);

  useEffect(() => {
    if (!otp && username) {
      navigate("/get-started/bind-email", { replace: true });
    } else if (!otp) {
      navigate("/get-started/verify-email", { replace: true });
    }
  }, [navigate, otp, username]);

  useEffect(() => {
    if (username && !email) {
      navigate("/get-started/bind-email", { replace: true });
    } else if (username && email) {
      navigate("/get-started/create-wallet", { replace: true });
    }
  }, [navigate, username, email]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(UsernameSchema),
    mode: "onChange",
  });

  const isUsernameValid = Boolean(usernameInput.trim()) && !errors.username;

  const { data: usernameCheckData, isFetching: checkingUsername } = useQuery({
    queryKey: ["checkUsername", debouncedUsername],
    queryFn: () => checkUsernameAvailability(debouncedUsername),
    enabled: Boolean(debouncedUsername) && isUsernameValid,
  });

  const isAvailable = usernameCheckData?.data?.content?.isAvailable === true;

  const isTaken = usernameCheckData?.data?.content?.isAvailable === false;

  const { mutate: createUserNameMutation, isPending: createUsernamePending } =
    useMutation({
      mutationFn: (data) => createUsername(data),
      onSuccess: async (data, variable) => {
        if (data.status === 200) {
          const content = data.data.content;

          setItemInSessionStorage("user", content);

          if (content.authMethod === "WALLET") {
            login({
              token,
              email: null,
              user: null,
              otp: null,
              username: variable.username,
            });

            navigate("/get-started/bind-email", { replace: true });
          } else {
            login({
              token,
              email,
              user: null,
              otp,
              username: variable.username,
            });

            navigate("/get-started/create-wallet", { replace: true });
          }

          reset();
        } else {
          toast.error("Something went wrong");
        }
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message || "Could not create username",
        );
      },
    });

  const handleUsernameChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/\s/g, "");
    e.target.value = value;
    setUsernameInput(value);
  };

  const onSubmit = (data) => {
    if (isTaken) return;
    createUserNameMutation({
      ...data,
      username: data.username.toLowerCase().trim(),
    });
  };

  const disableSubmit =
    createUsernamePending ||
    checkingUsername ||
    !isUsernameValid ||
    isTaken ||
    !isAvailable;

  return (
    <div className="text-left">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1]">
          <AtSign className="h-5 w-5" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-[#101828] md:text-[28px]">
          Choose your username
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#667085] md:text-base">
          This will be your public identity on Contribute.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <CustomInput
            className="h-12 rounded-xl"
            label="Username"
            placeholder="example: taylor"
            type="text"
            autoComplete="username"
            error={errors.username?.message}
            {...register("username", {
              onChange: handleUsernameChange,
            })}
          />

          <div className="min-h-6">
            {checkingUsername ? (
              <p className="flex items-center gap-2 text-sm text-[#667085]">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking username...
              </p>
            ) : isAvailable ? (
              <p className="flex items-center gap-2 text-sm font-medium text-[#027A48]">
                <CheckCircle2 className="h-4 w-4" />
                Username is available
              </p>
            ) : isTaken ? (
              <p className="flex items-center gap-2 text-sm font-medium text-[#B42318]">
                <XCircle className="h-4 w-4" />
                Username is already taken
              </p>
            ) : (
              <p className="text-sm text-[#98A2B3]">
                Use letters, numbers, or underscores.
              </p>
            )}
          </div>
        </div>

        <Button
          className="h-11 w-full rounded-xl bg-[#2F0FD1] text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
          type="submit"
          disabled={disableSubmit}
        >
          {createUsernamePending ? "Creating username..." : "Continue"}
          {!createUsernamePending ? <ArrowRight className="h-4 w-4" /> : null}
        </Button>
      </form>
    </div>
  );
}

export default Username;
