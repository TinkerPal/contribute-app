import { ArrowLeft, Clock3, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

export default function ComingSoonPage({
  title = "Coming soon",
  description = "This feature is not live yet. We are preparing it for launch.",
  badge = "Feature preview",
}) {
  const navigate = useNavigate();

  return (
    <main className="h-full min-h-screen">
      <div className="mx-auto px-2 py-2">
        <section className="relative overflow-hidden rounded-3xl border border-[#EAECF0] bg-white p-6 shadow-sm sm:p-8">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#EEF2FF] blur-3xl" />

          <div className="relative mx-auto flex min-h-[420px] max-w-2xl flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1]">
              <Clock3 className="h-7 w-7" />
            </div>

            <div className="mt-5 inline-flex h-7 items-center gap-2 rounded-full border border-[#E0E7FF] bg-[#F4F7FF] px-2.5 text-xs font-medium text-[#2F0FD1]">
              <Sparkles className="h-3.5 w-3.5" />
              {badge}
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#101828] sm:text-4xl">
              {title}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#667085] sm:text-base">
              {description}
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
