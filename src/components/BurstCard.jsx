import React, { memo, useMemo } from "react";
import { useNavigate } from "react-router";
import { ArrowUpRight, Clock3, Gift, Trophy, Users } from "lucide-react";

function formatPlatformLabel(platform) {
  if (!platform) return "Unknown platform";

  const normalized = String(platform).trim().toLowerCase();

  const labels = {
    twitter: "X / Twitter",
    x: "X / Twitter",
    instagram: "Instagram",
    tiktok: "TikTok",
    linkedin: "LinkedIn",
    facebook: "Facebook",
  };

  return labels[normalized] || platform;
}

function getTimeLeftLabel(burst) {
  const endSource =
    burst?.endDate ||
    burst?.endAt ||
    burst?.expiresAt ||
    burst?.deadline ||
    burst?.closingDate;

  if (!endSource) return "No end date";

  const endDate = new Date(endSource);

  if (Number.isNaN(endDate.getTime())) return "No end date";

  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();

  if (diffMs <= 0) return "Ended";

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

function BurstCard({ burst, tag }) {
  const navigate = useNavigate();

  const rewardLabel = useMemo(() => {
    const amount = burst?.tokensForWinner ?? 0;
    const symbol = burst?.symbol || "TOKENS";
    return `${amount} ${symbol}`;
  }, [burst?.tokensForWinner, burst?.symbol]);

  const participantCount = burst?.participantCount ?? 0;
  const platformLabel = formatPlatformLabel(burst?.platform);
  const timeLeftLabel = getTimeLeftLabel(burst);

  const handleOpen = () => {
    if (!burst?.id) return;

    navigate(`detail/${encodeURIComponent(burst.id)}`, {
      replace: false,
    });
  };

  return (
    <article
      onClick={handleOpen}
      className={[
        "group flex min-h-[220px] cursor-pointer flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200",
        "border-[#EEF2FF] hover:-translate-y-0.5 hover:border-[#D8DDF8] hover:shadow-md",
        tag === "home-page" || tag === "task-page" ? "" : "",
      ].join(" ")}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center rounded-full bg-[#ECFDF3] px-3 py-1 text-xs font-medium text-[#027A48]">
            {platformLabel}
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#667085]">
            <Clock3 className="h-3.5 w-3.5" />
            {timeLeftLabel}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="line-clamp-2 text-base leading-6 font-semibold text-[#09032A]">
            {burst?.burstTitle || "Untitled Burst"}
          </h3>

          {/* {burst?.description ? (
            <p className="line-clamp-2 text-sm leading-6 text-[#667085]">
              {burst.description}
            </p>
          ) : (
            <p className="text-sm leading-6 text-[#667085]">
              Boost visibility by participating in trending conversations on{" "}
              {platformLabel}.
            </p>
          )} */}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#F8FAFC] p-3">
            <div className="mb-1 flex items-center gap-2 text-[#2F0FD1]">
              <Gift className="h-4 w-4" />
              <span className="text-xs font-medium tracking-wide text-[#667085] uppercase">
                Reward
              </span>
            </div>
            <p className="text-sm font-semibold text-[#09032A]">
              {rewardLabel}
            </p>
          </div>

          <div className="rounded-xl bg-[#F8FAFC] p-3">
            <div className="mb-1 flex items-center gap-2 text-[#2F0FD1]">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium tracking-wide text-[#667085] uppercase">
                Participants
              </span>
            </div>
            <p className="text-sm font-semibold text-[#09032A]">
              {participantCount}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#F2F4F7] pt-3">
          <div className="inline-flex items-center gap-2 text-sm text-[#667085]">
            <Trophy className="h-4 w-4 text-[#2F0FD1]" />
            <span>Open campaign</span>
          </div>

          <div className="inline-flex items-center gap-1 text-sm font-medium text-[#2F0FD1]">
            <span>View details</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(BurstCard);
