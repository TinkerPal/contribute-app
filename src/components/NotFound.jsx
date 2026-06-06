import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Compass, ArrowLeft } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md text-center">
        {/* icon */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1]">
          <Compass className="h-6 w-6" />
        </div>

        {/* title */}
        <h1 className="text-3xl font-semibold tracking-tight text-[#101828]">
          Page not found
        </h1>

        {/* subtitle */}
        <p className="mt-3 text-sm leading-6 text-[#667085]">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        {/* actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="h-11 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>

          <Button
            onClick={() => navigate("/")}
            className="h-11 rounded-xl bg-[#2F0FD1] text-white hover:bg-[#2409B8]"
          >
            Go to dashboard
          </Button>
        </div>

        {/* subtle helper */}
        <p className="mt-6 text-xs text-[#98A2B3]">
          If you think this is an error, try refreshing the page.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
