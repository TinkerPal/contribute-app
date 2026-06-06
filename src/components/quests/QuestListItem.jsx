import { ChevronRight } from "lucide-react";
import { formatReward } from "@/lib/questUtils";
import Badge2 from "../ui/Badge2";

function getTimelineLabel(quest) {
  const now = new Date();
  const startAt = quest.startAt ? new Date(quest.startAt) : null;
  const endAt = quest.endAt ? new Date(quest.endAt) : null;

  if (startAt && now < startAt) {
    return {
      label: "Starts",
      value: quest.startDate || startAt.toLocaleDateString(),
    };
  }

  return {
    label: "Due",
    value: quest.deadline || (endAt ? endAt.toLocaleDateString() : "Not set"),
  };
}

function getEntriesCount(quest) {
  return Number(
    quest.entriesCount ??
      quest.submissionsCount ??
      quest.metadata?.submissions?.length ??
      0,
  );
}

export default function QuestListItem({ quest, hasApplied, onClick }) {
  const entriesCount = getEntriesCount(quest);
  const timeline = getTimelineLabel(quest);

  const hasSubmitted = Boolean(quest.hasSubmitted || hasApplied);
  const isCreator = Boolean(quest.isCreator);

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-[#EAECF0] bg-white p-3 shadow-sm transition hover:border-[#D7DDF0] hover:shadow-md sm:p-4"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge2 tone="purple">{quest.category || "X Quest"}</Badge2>
            <Badge2 tone="green">{quest.status || "active"}</Badge2>

            {isCreator ? <Badge2 tone="purple">Creator</Badge2> : null}

            {!isCreator && hasSubmitted ? (
              <Badge2 tone="blue">Entry received</Badge2>
            ) : null}
          </div>

          <h3 className="line-clamp-1 text-[15px] font-semibold text-[#101828] sm:text-base">
            {quest.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-sm text-[#667085]">
            {quest.company || "Contribute.fi"} • {quest.description}
          </p>
        </div>

        <div className="grid shrink-0 grid-cols-3 gap-2 md:w-[430px]">
          <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] text-[#667085]">Reward</p>
            <p className="truncate text-sm font-semibold text-[#101828]">
              {formatReward(quest)}
            </p>
          </div>

          <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] text-[#667085]">Entries</p>
            <p className="text-sm font-semibold text-[#101828]">
              {entriesCount}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-3 py-2">
            <div>
              <p className="text-[11px] text-[#667085]">{timeline.label}</p>
              <p className="text-sm font-semibold text-[#101828]">
                {timeline.value}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-[#98A2B3] transition group-hover:text-[#2F0FD1]" />
          </div>
        </div>
      </div>
    </article>
  );
}
