import { useNavigate } from "react-router";
import { Compass, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1]">
          <Compass className="h-6 w-6" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-[#101828]">
          Page not found
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#667085]">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-5 text-sm font-medium text-[#344054] shadow-sm transition hover:bg-[#F9FAFB]"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>

          <button
            onClick={() => navigate("/")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
          >
            Go to dashboard
          </button>
        </div>

        <div className="mt-8 rounded-xl border border-[#EAECF0] bg-white p-4 text-left shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#2F0FD1]">
              <Search className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#101828]">
                Looking for something?
              </p>
              <p className="mt-1 text-sm leading-6 text-[#667085]">
                Browse tasks, explore quests, or return to your dashboard to
                continue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
