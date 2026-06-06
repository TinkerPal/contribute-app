import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import GrowthQuest from "./GrowthQuest";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import OnChainQuest from "./OnChainQuest";
import TechnicalQuest from "./TechnicalQuest";
import { useRequireAuth } from "@/hooks/useRequireAuth";

function NewQuest({
  sheetIsOpen,
  setSheetIsOpen,
  setOpenQuestSuccess,
  communityId,
  triggerClassName,
}) {
  const isDesktop = useIsDesktop();
  const { requireAuth } = useRequireAuth();

  const side = isDesktop ? "right" : "bottom";

  const handleOpenChange = (open) => {
    if (open) {
      requireAuth(() => setSheetIsOpen(true));
    } else {
      setSheetIsOpen(false);
    }
  };

  return (
    <Sheet open={sheetIsOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          className={
            triggerClassName ||
            "h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
          }
        >
          Create Quest
        </Button>
      </SheetTrigger>

      <SheetContent
        side={side}
        className={[
          "overflow-y-auto bg-white px-4 pt-5 pb-6 sm:px-6",
          side === "bottom" ? "h-[85%]" : "sm:max-w-xl",
        ].join(" ")}
      >
        <SheetHeader className="space-y-2">
          <SheetTitle className="text-left text-[28px] font-semibold tracking-tight text-[#09032A]">
            Create New Quest
          </SheetTitle>
          <SheetDescription className="text-left text-[15px] leading-7 text-[#667085]">
            Choose the type of quest you want to create for this community.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <GrowthQuest
            setSheetIsOpen={setSheetIsOpen}
            setOpenQuestSuccess={setOpenQuestSuccess}
            communityId={communityId}
          />

          <OnChainQuest
            setSheetIsOpen={setSheetIsOpen}
            setOpenQuestSuccess={setOpenQuestSuccess}
            communityId={communityId}
          />

          <TechnicalQuest
            setSheetIsOpen={setSheetIsOpen}
            setOpenQuestSuccess={setOpenQuestSuccess}
            communityId={communityId}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default NewQuest;
