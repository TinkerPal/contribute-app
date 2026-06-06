import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, X } from "lucide-react";
import { BsTwitterX } from "react-icons/bs";

const API_URL = "http://localhost:4000";

function SigninWithTwitterModal2({ open, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTwitterLogin() {
    try {
      setIsLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/auth/twitter/init`, {
        method: "GET",
        credentials: "include",
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Unable to start X authentication.");
      }

      window.location.href = `${API_URL}${data.url}`;
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  //   if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/50 px-4 py-6 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-[440px] rounded-[28px] border border-[#EAECF0] bg-white p-5 shadow-2xl md:p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#EAECF0] bg-white text-[#667085] transition hover:bg-[#F8FAFC] hover:text-[#101828]"
          aria-label="Close authentication modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="pt-5 text-left">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1]">
              <BsTwitterX className="h-5 w-5" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-[#101828] md:text-[28px]">
              Welcome back
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#667085] md:text-base">
              Continue securely with your X account.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-3">
            <Button
              type="button"
              onClick={handleTwitterLogin}
              disabled={isLoading}
              variant="outline"
              className="group h-auto w-full justify-between rounded-2xl border border-[#EAECF0] bg-white p-4 text-left shadow-sm transition hover:border-[#2F0FD1]/30 hover:bg-[#F8FAFF] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#101828] text-white">
                  <BsTwitterX className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#101828]">
                    Continue with X
                  </p>
                  <p className="mt-0.5 text-xs leading-5 font-normal text-[#667085]">
                    Sign in using your X / Twitter account.
                  </p>
                </div>
              </div>

              {isLoading ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#2F0FD1]" />
              ) : (
                <ArrowRight className="h-4 w-4 shrink-0 text-[#98A2B3] transition group-hover:translate-x-0.5 group-hover:text-[#2F0FD1]" />
              )}
            </Button>
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-[#98A2B3]">
            You’ll be redirected to X to approve access, then returned here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SigninWithTwitterModal2;
