import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { useEffect, useRef } from "react";
import { createWallet } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, RefreshCcw } from "lucide-react";

function CreateWallet() {
  const { username } = useAuth();
  const navigate = useNavigate();
  const { setPublicKey, setNetwork } = useWallet();
  const hasStarted = useRef(false);

  const network = "TESTNET";

  const {
    mutate: createWalletMutation,
    isPending,
    isError,
  } = useMutation({
    mutationFn: () => createWallet(network),
    onSuccess: async (data) => {
      if (data.status === 200) {
        const { publicKey } = data.data.content;

        setPublicKey(publicKey);
        setNetwork({
          network,
          networkPassphrase: "Test SDF Network ; September 2015",
        });

        toast.success("Wallet created successfully");
        navigate("/get-started/wallet-created-success", { replace: true });
      } else {
        toast.error("Something went wrong");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create wallet");
    },
  });

  useEffect(() => {
    if (!username) {
      navigate("/get-started/username", { replace: true });
      return;
    }

    if (!hasStarted.current) {
      hasStarted.current = true;
      createWalletMutation();
    }
  }, [username, navigate, createWalletMutation]);

  const handleRetry = () => {
    hasStarted.current = true;
    createWalletMutation();
  };

  return (
    <div className="text-left">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1]">
          {isError ? (
            <RefreshCcw className="h-5 w-5" />
          ) : (
            <ShieldCheck className="h-5 w-5" />
          )}
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-[#101828] md:text-[28px]">
          {isError ? "Wallet creation failed" : "Creating your wallet"}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#667085] md:text-base">
          {isError
            ? "We could not create your wallet. Please try again."
            : "Please keep this screen open while we prepare your Contribute wallet."}
        </p>
      </div>

      <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 text-center shadow-sm">
        {!isError ? (
          <div className="space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8FAFC]">
              <Loader2 className="h-6 w-6 animate-spin text-[#2F0FD1]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#101828]">
                Setting up wallet
              </p>
              <p className="mt-1 text-sm text-[#667085]">
                Generating account and configuring {network}.
              </p>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            onClick={handleRetry}
            disabled={isPending}
            className="h-11 w-full rounded-xl bg-[#2F0FD1] text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
          >
            {isPending ? "Retrying..." : "Try again"}
            {!isPending ? <RefreshCcw className="h-4 w-4" /> : null}
          </Button>
        )}
      </div>
    </div>
  );
}

export default CreateWallet;
