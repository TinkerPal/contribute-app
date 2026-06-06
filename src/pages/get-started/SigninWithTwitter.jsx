import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { BsTwitterX } from "react-icons/bs";

function SigninWithTwitter() {
  const API_URL = "http://localhost:4000";

  async function handleTwitterLogin() {
    const res = await fetch(`${API_URL}/auth/twitter/init`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    // console.log("the data is", data);

    if (!data.success) {
      throw new Error(data.message);
    }

    window.location.href = `${API_URL}${data.url}`;
  }

  return (
    <div className="text-left">
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

      <div className="grid gap-3">
        <Button
          onClick={handleTwitterLogin}
          variant="outline"
          className="group h-auto w-full justify-between rounded-2xl border border-[#EAECF0] bg-white p-4 text-left shadow-sm transition hover:border-[#2F0FD1]/30 hover:bg-[#F8FAFF] hover:shadow-md"
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

          <ArrowRight className="h-4 w-4 shrink-0 text-[#98A2B3] transition group-hover:translate-x-0.5 group-hover:text-[#2F0FD1]" />
        </Button>
      </div>
    </div>
  );
}

export default SigninWithTwitter;
