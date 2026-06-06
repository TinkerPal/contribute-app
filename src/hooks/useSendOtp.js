import { resendOTP } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useSendOtp = () => {
  const { mutate: resendOTPMutation, isPending: resendOTPPending } =
    useMutation({
      mutationFn: (data) => resendOTP(data),
      onSuccess: async (data) => {
        if (data.status === 200) {
          toast.success("OTP sent successfully");
        } else {
          toast.error("Something went wrong");
        }
      },
      onError: (error) => {
        console.error("Error:", error.response.data.message);
        toast.error(error.response.data.message);
      },
    });

  return { resendOTPMutation, resendOTPPending };
};
