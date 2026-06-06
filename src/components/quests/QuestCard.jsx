import { ArrowUpRight } from "lucide-react";
import { formatReward } from "@/lib/questUtils";

import Badge2 from "../ui/Badge2";

function PosterMini({ poster }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[11px] font-semibold text-[#2F0FD1]">
        {poster?.initials || "CO"}
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-[#101828]">
          {poster?.name || "Contribute Team"}
        </p>
        <p className="truncate text-[11px] text-[#667085]">
          {poster?.role || "Project owner"}
        </p>
      </div>
    </div>
  );
}

function getEntriesCount(quest) {
  return Number(
    quest.entriesCount ??
      quest.submissionsCount ??
      quest.metadata?.submissions?.length ??
      0,
  );
}

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

export default function QuestCard({ quest, hasApplied, onClick }) {
  const entriesCount = getEntriesCount(quest);
  const timeline = getTimelineLabel(quest);

  const hasSubmitted = Boolean(quest.hasSubmitted || hasApplied);
  const isCreator = Boolean(quest.isCreator);

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#D7DDF0] hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge2 tone="purple">{quest.category || "X Quest"}</Badge2>

          <Badge2 tone="green">{quest.status || "active"}</Badge2>

          {isCreator ? <Badge2 tone="purple">Creator</Badge2> : null}

          {!isCreator && hasSubmitted ? (
            <Badge2 tone="blue">Entry received</Badge2>
          ) : null}
        </div>

        <ArrowUpRight className="h-4 w-4 shrink-0 text-[#98A2B3] transition group-hover:text-[#2F0FD1]" />
      </div>

      <h3 className="mt-4 line-clamp-2 text-[15px] leading-6 font-semibold text-[#101828]">
        {quest.title}
      </h3>

      <p className="mt-1 text-xs text-[#667085]">
        {quest.company || "Contribute.fi"}
      </p>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#667085]">
        {quest.description}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
          <p className="text-[11px] text-[#667085]">Reward</p>

          <p className="text-sm font-semibold text-[#101828]">
            {formatReward(quest)}
          </p>
        </div>

        <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
          <p className="text-[11px] text-[#667085]">{timeline.label}</p>

          <p className="text-sm font-semibold text-[#101828]">
            {timeline.value}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F2F4F7] pt-3">
        <PosterMini poster={quest.postedBy} />

        <p className="text-[11px] text-[#667085]">
          {entriesCount} {entriesCount === 1 ? "entry" : "entries"}
        </p>
      </div>
    </article>
  );
}
