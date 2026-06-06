import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import {
  ArrowRight,
  KeyRound,
  ShieldCheck,
  WalletCards,
  X,
} from "lucide-react";
import { useSocketFi } from "@socketfi/react";

export default function ConnectWalletModal({ open, onClose }) {
  const socketfi = useSocketFi();

  const {
    authModalOpen,
    closeAuthModal,
    handleOpenStellarWalletKitModal,
    isLoading: isWalletLoading,
    setWalletLoading,
    publicKey,
  } = useWallet();

  const isBusy = isWalletLoading;

  const handleWalletLogin = () => {
    handleOpenStellarWalletKitModal();
  };

  async function handleSocketFiLogin() {
    console.log("this was clicked");

    const res = await socketfi.openAuthPopup();

    console.log("the async function is", res);
  }

  useEffect(() => {
    setWalletLoading(false);
  }, [setWalletLoading]);

  if (!authModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/50 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-[#EAECF0] bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#EAECF0] bg-white text-[#667085] transition hover:bg-[#F9FAFB] hover:text-[#101828]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-left">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1]">
              <WalletCards className="h-5 w-5" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-[#101828] md:text-[28px]">
              Welcome back
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#667085] md:text-base">
              Continue securely with your Stellar wallet or SocketFi Passkey.
            </p>
          </div>

          <div className="grid gap-3">
            <Button
              disabled={isBusy}
              onClick={handleSocketFiLogin}
              variant="outline"
              className="group h-auto w-full justify-between rounded-2xl border border-[#EAECF0] bg-white p-4 text-left shadow-sm transition hover:border-[#2F0FD1]/30 hover:bg-[#F8FAFF] hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F0FD1]">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#101828]">
                    Continue with Passkey
                  </p>
                  <p className="mt-0.5 text-xs leading-5 font-normal text-[#667085]">
                    Sign in securely with SocketFi Passkey.
                  </p>
                </div>
              </div>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2F4F7] text-[#667085] transition group-hover:bg-[#EEF2FF] group-hover:text-[#2F0FD1]">
                <KeyRound className="h-4 w-4" />
              </div>
            </Button>

            <Button
              disabled={isBusy}
              onClick={handleWalletLogin}
              variant="outline"
              className="group h-auto w-full justify-between rounded-2xl border border-[#EAECF0] bg-white p-4 text-left shadow-sm transition hover:border-[#2F0FD1]/30 hover:bg-[#F8FAFF] hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#EAECF0] bg-[#FCFCFD]">
                  {isWalletLoading ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#D0D5DD] border-t-[#2F0FD1]" />
                  ) : (
                    <img
                      className="h-6 w-6 rounded-full"
                      src="/cryptoIcons/12000000.svg"
                      alt="Stellar wallet"
                    />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#101828]">
                    Continue with Wallet Keys
                  </p>
                  <p className="mt-0.5 text-xs leading-5 font-normal text-[#667085]">
                    Connect using your Stellar wallet keys.
                  </p>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-[#98A2B3] transition group-hover:translate-x-0.5 group-hover:text-[#2F0FD1]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
