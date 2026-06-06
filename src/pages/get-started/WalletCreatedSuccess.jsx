import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { useState } from "react";
import { PiCopyFill } from "react-icons/pi";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

function WalletCreatedSuccess() {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const [copied, setCopied] = useState(false);

  const formatPublicKey = (key) => {
    if (!key || key.length <= 18) return key || "Wallet address unavailable";
    return `${key.slice(0, 12)}...${key.slice(-12)}`;
  };

  const handleCopy = async () => {
    if (!publicKey) return;

    try {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="text-left">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF3] text-[#027A48]">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-[#101828] md:text-[28px]">
          Wallet created
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#667085] md:text-base">
          Your Contribute wallet is ready. You can now receive rewards and
          interact with tasks securely.
        </p>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#101828]">
                Wallet account ID
              </p>
              <p className="mt-1 text-xs text-[#667085]">
                Save this address for reference.
              </p>
            </div>

            <CheckCircle2 className="h-5 w-5 text-[#027A48]" />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-3 py-3">
            <p className="min-w-0 truncate font-mono text-sm font-medium text-[#101828]">
              {formatPublicKey(publicKey)}
            </p>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!publicKey}
              className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-white px-3 text-sm font-semibold text-[#2F0FD1] shadow-sm transition hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
            >
              {copied ? "Copied" : <PiCopyFill className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          className="h-11 w-full rounded-xl bg-[#2F0FD1] text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
          onClick={() => navigate("/get-started/account-configuration")}
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default WalletCreatedSuccess;
