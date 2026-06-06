import { Fragment, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { FaUsers } from "react-icons/fa";
import { IoIosCheckmarkCircle, IoIosRefreshCircle } from "react-icons/io";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BriefcaseBusiness,
  CalendarClock,
  Trophy,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

import BackButton from "@/components/BackButton";
import TasksCard from "@/components/TasksCard";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Empty from "@/components/Empty";
import CustomInput from "@/components/CustomInput";
import TaskSubmissionForm from "@/components/dashboard/TaskSubmissionForm";
import OnChainTaskInput from "@/components/dashboard/OnChainTaskInput";
import { useCompleteTask } from "@/hooks/useCompleteTask";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getQuest, getQuests } from "@/services";
import { endTime, timeAgo } from "@/utils";

function DetailStatCard({ label, value, icon, accent = "blue" }) {
  const accentStyles = {
    blue: {
      card: "border-[#E0E7FF] bg-gradient-to-br from-white to-[#F8FAFF]",
      iconWrap: "bg-[#EEF2FF] text-[#2F0FD1]",
      line: "bg-[#2F0FD1]",
    },
    green: {
      card: "border-[#D9F3DC] bg-gradient-to-br from-white to-[#F6FFF7]",
      iconWrap: "bg-[#EAFBF0] text-[#2E9B4F]",
      line: "bg-[#2E9B4F]",
    },
    orange: {
      card: "border-[#FDE7C7] bg-gradient-to-br from-white to-[#FFF9F2]",
      iconWrap: "bg-[#FFF1DE] text-[#D9822F]",
      line: "bg-[#D9822F]",
    },
    purple: {
      card: "border-[#E9DDFF] bg-gradient-to-br from-white to-[#FAF7FF]",
      iconWrap: "bg-[#F3ECFF] text-[#7C3AED]",
      line: "bg-[#7C3AED]",
    },
  };

  const theme = accentStyles[accent] || accentStyles.blue;

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        theme.card,
      ].join(" ")}
    >
      <div className={`absolute top-0 left-0 h-full w-1 ${theme.line}`} />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium tracking-wide text-[#667085]">
            {label}
          </p>
          <p className="mt-2 text-2xl leading-none font-semibold tracking-tight text-[#101828]">
            {value}
          </p>
        </div>

        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-200",
            "group-hover:scale-105",
            theme.iconWrap,
          ].join(" ")}
        >
          <div className="text-[18px]">{icon}</div>
        </div>
      </div>
    </div>
  );
}

function RewardLabel({ quest }) {
  if (!quest) return "—";

  if (quest?.rewardType === "Token" && quest?.tokensPerWinner) {
    return `${quest.tokensPerWinner} ${quest?.symbol || ""} per winner`;
  }

  if (quest?.rewardType === "Points" && quest?.pointsPerWinner) {
    return `${quest.pointsPerWinner} points per winner`;
  }

  return quest?.rewardType || "Reward available";
}

function TaskReward({ quest, task }) {
  if (quest?.rewardType === "Token" && task?.tokensPerTask) {
    return `${task.tokensPerTask} ${quest?.symbol || ""}`;
  }

  if (quest?.rewardType === "Points" && task?.pointsPerTask) {
    return `${task.pointsPerTask} Points`;
  }

  return null;
}

function QuickActionTask({ task, quest, onRefresh }) {
  const reward = TaskReward({ quest, task });
  const completed = Boolean(task?.userProgress?.completed);

  return (
    <button
      type="button"
      className={[
        "flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition",
        completed
          ? "border-[#D6E9C0] bg-[#F5FAEC]"
          : "border-[#E4E7EC] bg-[#2F0FD1] hover:bg-[#2409B8]",
      ].join(" ")}
    >
      <div className="flex w-[92%] items-center justify-between gap-3">
        <div className="space-y-1">
          <p
            className={[
              "text-sm font-semibold",
              completed ? "text-[#1C097D]" : "text-white",
            ].join(" ")}
          >
            {task?.title}
          </p>

          {reward ? (
            <p
              className={[
                "text-xs",
                completed ? "text-[#475467]" : "text-white/80",
              ].join(" ")}
            >
              Reward: {reward}
            </p>
          ) : null}
        </div>
      </div>

      {completed ? (
        <IoIosCheckmarkCircle className="text-[28px] text-[#538E11]" />
      ) : (
        <IoIosRefreshCircle
          onClick={(e) => onRefresh(e, task)}
          className="text-[28px] text-white"
        />
      )}
    </button>
  );
}

function SubmissionAccordionTask({
  task,
  quest,
  actionLabel,
  actionHref,
  onChain = false,
  userId,
}) {
  const reward = TaskReward({ quest, task });

  return (
    <Accordion
      type="single"
      collapsible
      className="rounded-2xl border border-[#E4E7EC] bg-white p-1 shadow-sm"
    >
      <AccordionItem
        value={task?.title || task?.payload?.functionSpec?.doc || "task"}
        className="overflow-hidden rounded-2xl border-0"
      >
        <AccordionTrigger className="cursor-pointer rounded-xl bg-[#2F0FD1] px-5 py-4 text-white hover:no-underline">
          <div className="flex w-full items-center justify-between gap-3 text-left">
            <div>
              <p className="font-semibold">
                {task?.title || task?.payload?.functionSpec?.doc}
              </p>
              {reward ? (
                <p className="mt-1 text-xs text-white/80">Reward: {reward}</p>
              ) : null}
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="rounded-xl bg-white px-5 py-4">
          {task?.userProgress?.completed ? (
            <CustomInput
              placeholder="Submission"
              value={task?.userProgress?.submission}
              disabled
              icon={
                <IoIosCheckmarkCircle className="text-[28px] text-[#538E11]" />
              }
            />
          ) : onChain ? (
            <OnChainTaskInput task={task} quest={quest} userId={userId} />
          ) : (
            <div className="space-y-3">
              {actionHref ? (
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-[#667085]">1.</div>
                  <a
                    href={actionHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-[48px] w-full items-center justify-between rounded-xl border border-[#E4E7EC] px-4 text-sm font-medium text-[#2F0FD1] transition hover:bg-[#F8FAFC]"
                  >
                    <span>{actionLabel}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              ) : null}

              <div className="flex items-start gap-2">
                <div className="pt-3 text-sm font-medium text-[#667085]">
                  {actionHref ? "2." : "1."}
                </div>
                <div className="w-full">
                  <TaskSubmissionForm task={task} />
                </div>
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function TaskDetailsPage() {
  const { taskId } = useParams();
  const { requireAuth } = useRequireAuth();
  const { mutateAsync: completeTask } = useCompleteTask();
  const { user } = useAuth();

  const handleCompleteTask = async (e, task) => {
    e.stopPropagation();

    if (!requireAuth()) return;
    await completeTask({ taskId: task.id });
  };

  const {
    data: quest,
    isLoading: loadingQuest,
    isError: errorLoadingQuest,
  } = useQuery({
    queryKey: ["quest", taskId],
    queryFn: () => getQuest(taskId),
    enabled: !!taskId,
  });

  const LIMIT = 3;

  const {
    data: questData,
    isLoading: loadingQuests,
    isError: errorLoadingQuests,
  } = useQuery({
    queryKey: ["quests", LIMIT],
    queryFn: () => getQuests({ limit: LIMIT }),
    keepPreviousData: true,
  });

  const quests = questData?.data ?? [];

  const stats = useMemo(() => {
    if (!quest) return [];

    return [
      {
        key: "participants",
        label: "Participants",
        value: quest?.participants?.length ?? 0,
        icon: <FaUsers className="text-[18px]" />,
        accent: "blue",
      },
      {
        key: "duration",
        label: "Quest Duration",
        value: quest?.endDate ? endTime(quest.endDate) : "Continuous",
        icon: <CalendarClock className="h-[18px] w-[18px]" />,
        accent: "orange",
      },
      {
        key: "winners",
        label: "Number of Winners",
        value: quest?.numberOfWinners ?? "Open",
        icon: <Trophy className="h-[18px] w-[18px]" />,
        accent: "green",
        show:
          quest?.numberOfWinners !== undefined &&
          quest?.numberOfWinners !== null,
      },
      {
        key: "selection",
        label: "Selection Method",
        value: quest?.winnerSelectionMethod ?? "Rolling",
        icon: <Sparkles className="h-[18px] w-[18px]" />,
        accent: "purple",
        show: Boolean(quest?.winnerSelectionMethod),
      },
    ].filter((item) => item.show !== false);
  }, [quest]);

  const renderGrowthTask = (task, i) => {
    const title = task?.title;

    if (title === "Follow on Twitter" || title === "Like Tweet") {
      return (
        <QuickActionTask
          key={`${title}-${i}`}
          task={task}
          quest={quest}
          onRefresh={handleCompleteTask}
        />
      );
    }

    if (title === "Post on Twitter") {
      return (
        <SubmissionAccordionTask
          key={`${title}-${i}`}
          task={task}
          quest={quest}
          actionLabel="Make a Post"
          actionHref="https://x.com"
        />
      );
    }

    if (title === "Comment on Twitter") {
      return (
        <SubmissionAccordionTask
          key={`${title}-${i}`}
          task={task}
          quest={quest}
          actionLabel="Make a Comment"
          actionHref={task?.payload?.tweetUrl}
        />
      );
    }

    if (title === "Post on Discord") {
      return (
        <SubmissionAccordionTask
          key={`${title}-${i}`}
          task={task}
          quest={quest}
          actionLabel="Make a Post"
          actionHref={
            task?.payload?.discordLink && task?.payload?.channelId
              ? `${task.payload.discordLink}/${task.payload.channelId}`
              : task?.payload?.discordLink
          }
        />
      );
    }

    if (title === "Join Telegram Channel") {
      return (
        <QuickActionTask
          key={`${title}-${i}`}
          task={task}
          quest={quest}
          onRefresh={handleCompleteTask}
        />
      );
    }

    if (title === "Post on Telegram Group") {
      return (
        <SubmissionAccordionTask
          key={`${title}-${i}`}
          task={task}
          quest={quest}
          actionLabel="Make a Post"
          actionHref={task?.payload?.telegramGroupLink}
        />
      );
    }

    return (
      <SubmissionAccordionTask
        key={`${title || "task"}-${i}`}
        task={task}
        quest={quest}
      />
    );
  };

  return (
    <div className="space-y-8">
      <div className="md:hidden">
        <BackButton />
      </div>

      <section className="rounded-[28px] border border-[#EEF2FF] bg-white p-4 shadow-sm md:p-6 lg:p-8">
        {loadingQuest ? (
          <Loader label="Loading quest details..." />
        ) : errorLoadingQuest ? (
          <Error
            title="Failed to load task details"
            description="Please refresh the page or try again."
          />
        ) : !quest ? (
          <Error title="Task not found" />
        ) : (
          <div className="space-y-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4F7FF] ring-1 ring-[#EEF2FF]">
                  <img src="/ChartPolar.svg" alt="" className="h-6 w-6" />
                </div>

                <div className="min-w-0 space-y-1">
                  <p className="text-[16px] font-semibold text-[#101828]">
                    {quest?.community?.communityName}
                  </p>
                  <p className="inline-flex items-center gap-2 text-sm text-[#667085]">
                    <FaUsers className="text-[#2F0FD1]" />
                    <span>
                      {quest?.community?.totalMembers === 1
                        ? "1 member"
                        : `${quest?.community?.totalMembers ?? 0} members`}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-3xl space-y-4">
                <div className="space-y-3">
                  <h1 className="text-[26px] font-semibold tracking-tight text-[#101828] md:text-[30px]">
                    {quest?.questTitle}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="rounded-full bg-[#F8FAFC] px-3 py-1.5 font-medium text-[#667085]">
                      Published {timeAgo(quest?.createdAt)}
                    </span>

                    <span className="rounded-full bg-[#EEF2FF] px-3 py-1.5 font-medium text-[#2F0FD1]">
                      {RewardLabel({ quest })}
                    </span>
                  </div>
                </div>

                <p className="text-[15px] leading-7 text-[#667085]">
                  {quest?.questDescription || "No description provided yet."}
                </p>
              </div>

              <div className="w-full rounded-2xl border border-[#E5E7EB] bg-gradient-to-br from-[#F8FAFF] to-white p-5 shadow-sm xl:max-w-[320px]">
                <p className="mb-2 text-sm text-[#667085]">Quest reward</p>
                <p className="text-2xl font-semibold text-[#2F0FD1]">
                  {RewardLabel({ quest })}
                </p>
                <p className="mt-3 text-sm leading-6 text-[#667085]">
                  Complete the required actions and submit proof where needed to
                  be considered for rewards.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <DetailStatCard
                  key={item.key}
                  label={item.label}
                  value={item.value}
                  icon={item.icon}
                  accent={item.accent}
                />
              ))}
            </div>

            {quest?.category === "ON_CHAIN" ? (
              <div className="space-y-4">
                {quest?.tasks?.map((task, i) => (
                  <SubmissionAccordionTask
                    key={`${task?.title || task?.payload?.functionSpec?.doc}-${i}`}
                    task={task}
                    quest={quest}
                    onChain
                    userId={user?.id}
                  />
                ))}
              </div>
            ) : null}

            {quest?.category === "GROWTH" ? (
              <div className="space-y-4">
                {quest?.tasks?.map((task, i) => renderGrowthTask(task, i))}
              </div>
            ) : null}

            {quest?.category === "TECHNICAL" ? (
              <div className="rounded-2xl border border-dashed border-[#D9E1F2] bg-[#FCFCFD] px-6 py-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F7FF] text-[#2F0FD1]">
                  <BriefcaseBusiness className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-[22px] font-semibold tracking-tight text-[#101828]">
                    Technical task flow
                  </h3>
                  <p className="text-sm leading-6 text-[#667085]">
                    This task category can be upgraded into a dedicated
                    technical submission experience similar to the new on-chain
                    and growth task flows.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight text-[#101828]">
            Similar Tasks
          </h2>
          <p className="mt-1 text-sm text-[#667085]">
            Explore other tasks you may be interested in.
          </p>
        </div>

        {loadingQuests ? (
          <Loader label="Loading similar tasks..." />
        ) : errorLoadingQuests ? (
          <Error
            title="Failed to load similar tasks"
            description="Please refresh the page or try again."
          />
        ) : quests.length === 0 ? (
          <Empty
            title="No similar tasks found"
            description="Other tasks will appear here when available."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {quests
              .filter((task) => task?.id !== quest?.id)
              .slice(0, 3)
              .map((task) => (
                <TasksCard task={task} key={task?.id} />
              ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TaskDetailsPage;
