import { TASK_TAG_BG } from "@/lib/constants";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { ArrowUpRight, Trophy, Users } from "lucide-react";

function formatTaskCategory(category) {
  if (category === "ON_CHAIN") return "On Chain";
  if (category === "GROWTH") return "Growth";
  return "Technical";
}

function TasksCard({ task, tag, layout = "grid" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const pathLength = location.pathname.split("/").length;
  let pathname = location.pathname.split("/");

  pathname = `${pathname[1]}/${pathname[2]}`;

  const handleOpen = () => {
    if (!task.isActive) {
      toast.error("Quest is no longer available");
      return;
    }

    if (pathLength === 3 && location.pathname.startsWith("/communities")) {
      navigate(
        `/${location.pathname.slice(1)}/${encodeURIComponent(task.id)}`,
        { replace: false },
      );
      return;
    }

    if (pathLength === 4) {
      navigate(`/${pathname}/${encodeURIComponent(task.id)}`, {
        replace: false,
      });
      return;
    }

    navigate(`/tasks/${encodeURIComponent(task.id)}`, {
      replace: false,
    });
  };

  if (layout === "list") {
    return (
      <article
        onClick={handleOpen}
        className="group cursor-pointer rounded-[20px] border border-[#E8EDF7] bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-[#DCE4F5] hover:shadow-md"
      >
        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium text-[#313131] ${TASK_TAG_BG[task.category]}`}
                >
                  {formatTaskCategory(task.category)}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium text-[#313131] ${TASK_TAG_BG[task.rewardType]}`}
                >
                  {task.rewardType}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium text-white ${
                    task.isActive ? "bg-[#12B76A]" : "bg-[#F04438]"
                  }`}
                >
                  {task.isActive ? "Active" : "Expired"}
                </span>
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-[15px] font-semibold text-[#101828] md:text-[16px]">
                  {task.title || task.questTitle}
                </h3>

                <p className="truncate text-sm text-[#667085]">
                  by {task.communityName}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:max-w-[420px] xl:min-w-[360px] xl:items-end">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#667085] xl:justify-end">
              <div className="inline-flex items-center gap-2">
                <Trophy className="h-4 w-4 text-[#2F0FD1]" />
                <span>
                  {task.rewardType === "Token"
                    ? `${task.numberOfWinners} winner${task.numberOfWinners > 1 ? "s" : ""}`
                    : "All participants win"}
                </span>
              </div>

              {task.amount ? (
                <div className="inline-flex items-center gap-2 font-medium text-[#2F0FD1]">
                  <img src="/Gift.svg" alt="" className="h-4 w-4" />
                  <span>{task.amount} XLM</span>
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-[#F2F4F7] pt-3 xl:w-full xl:justify-end xl:border-t-0 xl:pt-0">
              <div className="inline-flex items-center gap-2 text-sm text-[#667085]">
                <Users className="h-4 w-4 text-[#98A2B3]" />
                <span>Open task</span>
              </div>

              <div className="inline-flex items-center gap-1 text-sm font-medium text-[#2F0FD1]">
                <span>View details</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={handleOpen}
      className="group flex cursor-pointer flex-col justify-between rounded-[24px] border border-[#EEF2FF] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#DCE4F5] hover:shadow-md"
    >
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium text-[#313131] ${TASK_TAG_BG[task.category]}`}
          >
            {formatTaskCategory(task.category)}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium text-[#313131] ${TASK_TAG_BG[task.rewardType]}`}
          >
            {task.rewardType}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium text-white ${
              task.isActive ? "bg-[#12B76A]" : "bg-[#F04438]"
            }`}
          >
            {task.isActive ? "Active" : "Expired"}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="line-clamp-2 text-[17px] leading-6 font-semibold text-[#101828]">
            {task.title || task.questTitle}
          </h3>

          <p className="text-sm text-[#667085]">by {task.communityName}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[#667085]">
          <div className="inline-flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[#2F0FD1]" />
            <span>
              {task.rewardType === "Token"
                ? `${task.numberOfWinners} winner${task.numberOfWinners > 1 ? "s" : ""}`
                : "All participants win"}
            </span>
          </div>

          {task.amount ? (
            <div className="inline-flex items-center gap-2 font-medium text-[#2F0FD1]">
              <img src="/Gift.svg" alt="" className="h-4 w-4" />
              <span>{task.amount} XLM</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[#F2F4F7] pt-4">
        <div className="inline-flex items-center gap-2 text-sm text-[#667085]">
          <Users className="h-4 w-4 text-[#98A2B3]" />
          <span>Open task</span>
        </div>

        <div className="inline-flex items-center gap-1 text-sm font-medium text-[#2F0FD1]">
          <span>View details</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </article>
  );
}

export default TasksCard;
