import React from "react";
import { Megaphone, PenSquare, Send, Sparkles, TrendingUp } from "lucide-react";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const STEPS = [
  {
    icon: TrendingUp,
    title: "Define your target trend",
    description:
      "Describe the conversations, topics, or audience segments you want to engage on your selected social platform.",
  },
  {
    icon: Sparkles,
    title: "Get community suggestions",
    description:
      "Participants suggest relevant trends, post ideas, and campaign angles aligned with your objective.",
  },
  {
    icon: PenSquare,
    title: "Review top submissions",
    description:
      "You review the best entries and choose the ones that best match your brand voice and visibility goals.",
  },
  {
    icon: Send,
    title: "Publish winning content",
    description:
      "Winning submissions can be used for posting under your handle, helping you stay relevant in active conversations.",
  },
];

function MoreAboutBurst({ sheetIsOpen, setSheetIsOpen, triggerClassName }) {
  const isDesktop = useIsDesktop();
  const { requireAuth } = useRequireAuth();

  const side = isDesktop ? "right" : "bottom";

  const handleOpenChange = (open) => {
    if (open) {
      requireAuth(() => setSheetIsOpen(true));
      return;
    }

    setSheetIsOpen(false);
  };

  return (
    <Sheet open={sheetIsOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          className={
            triggerClassName ||
            "h-11 rounded-xl bg-[#EDF2FF] px-6 text-sm font-medium text-[#205CE2] hover:bg-[#2F0FD1] hover:text-white"
          }
        >
          More About Burst
        </Button>
      </SheetTrigger>

      <SheetContent
        side={side}
        className={[
          "overflow-y-auto bg-white px-4 pt-5 pb-6 sm:px-6",
          side === "bottom" ? "h-[85%]" : "sm:max-w-xl",
        ].join(" ")}
      >
        <SheetHeader className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1]">
            <Megaphone className="h-6 w-6" />
          </div>

          <SheetTitle className="text-left text-[28px] font-semibold tracking-tight text-[#09032A]">
            How Burst Works
          </SheetTitle>

          <SheetDescription className="text-left text-[15px] leading-7 text-[#667085]">
            Burst helps brands and builders grow visibility by joining relevant
            social conversations with community-sourced content ideas.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-2xl border border-[#EEF2FF] bg-[#FCFCFD] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F7FF] text-[#2F0FD1]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#2F0FD1]">
                      Step {index + 1}
                    </p>
                    <h3 className="text-base font-semibold text-[#09032A]">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-6 text-[#667085]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          onClick={() => setSheetIsOpen(false)}
          className="mt-6 h-11 w-full rounded-xl bg-[#2F0FD1] text-sm font-medium text-white hover:bg-[#2409B8]"
        >
          Got it
        </Button>
      </SheetContent>
    </Sheet>
  );
}

export default MoreAboutBurst;
