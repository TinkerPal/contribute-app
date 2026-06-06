import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import { handleCopy } from "@/lib/utils";

function QuestSuccess({ openQuestSuccess, setOpenQuestSuccess }) {
  const location = useLocation();

  return (
    <Dialog open={openQuestSuccess} onOpenChange={setOpenQuestSuccess}>
      <DialogContent className="max-h-[calc(100vh-120px)] overflow-y-auto rounded-[28px] border border-[#EEF2FF] bg-white p-6 shadow-xl sm:max-w-[640px] sm:p-8">
        <DialogHeader className="sr-only">
          <DialogTitle>Quest created successfully</DialogTitle>
          <DialogDescription>Quest creation success dialog</DialogDescription>
        </DialogHeader>

        <div className="space-y-8 text-center">
          <img src="/success.svg" alt="" className="mx-auto h-28 w-28" />

          <div className="space-y-3">
            <p className="text-[28px] font-semibold tracking-tight text-[#101828]">
              Successful!
            </p>
            <p className="text-sm leading-6 text-[#667085]">
              Your quest has been successfully published.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="h-11 flex-1 rounded-xl border-[#D0D5DD] bg-white text-sm font-medium text-[#344054] hover:bg-[#F9FAFB]"
            >
              Share Quest
            </Button>

            <Button
              className="h-11 flex-1 rounded-xl bg-[#2F0FD1] text-sm font-medium text-white hover:bg-[#2409B8]"
              onClick={() => {
                handleCopy(`https://app.contribute.fi${location.pathname}`);
                toast.success("Copied");
              }}
            >
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default QuestSuccess;
