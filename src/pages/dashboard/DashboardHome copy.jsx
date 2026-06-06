import { useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  MessageCircle,
  Send,
  Sparkles,
  Trophy,
  Users,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router";

const API_URL = "http://localhost:4000";

function MetricCard({ label, value, helper, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[#667085]">{label}</p>

          <p className="mt-1 text-xl font-semibold tracking-tight text-[#101828]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#98A2B3]">{helper}</p>
        </div>

        {Icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F0FD1]">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  description,
  label,
  meta,
  status = "active",
  onClick,
}) {
  const isComingSoon = status === "soon";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-[#EAECF0] bg-white p-4 text-left transition hover:border-[#D6D9E6] hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F0FD1]">
          <Icon className="h-5 w-5" />
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            isComingSoon
              ? "bg-[#F2F4F7] text-[#667085]"
              : "bg-[#ECFDF3] text-[#027A48]"
          }`}
        >
          {meta}
        </span>
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[#101828]">{title}</h3>

      <p className="mt-1 text-sm leading-6 text-[#667085]">{description}</p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F2F4F7] pt-3">
        <span className="text-xs font-medium text-[#98A2B3]">
          {isComingSoon ? "Launching soon" : "Available now"}
        </span>

        <span className="inline-flex items-center gap-2 text-sm font-medium text-[#2F0FD1]">
          {label}
          {!isComingSoon ? (
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          ) : null}
        </span>
      </div>
    </button>
  );
}

function StatusItem({ icon: Icon, title, description }) {
  return (
    <div className="flex gap-3 rounded-xl bg-[#F8FAFC] px-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#2F0FD1] shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#101828]">{title}</p>
        <p className="mt-1 text-sm text-[#667085]">{description}</p>
      </div>
    </div>
  );
}

function getQuestRewardTotal(quest) {
  return (quest.reward?.prizes || []).reduce(
    (sum, prize) => sum + (Number(prize.amount) || 0),
    0,
  );
}

function isOpenQuest(quest) {
  const status = String(quest.status || "").toLowerCase();

  return !["ended", "completed", "cancelled", "canceled"].includes(status);
}

export default function DashboardHome() {
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState({
    openOpportunities: 0,
    activeContributors: 0,
    rewardsAvailable: 0,
    completedWork: 0,
    openTasks: 0,
    activeQuests: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchDashboardStats() {
      try {
        setLoadingStats(true);

        const res = await fetch(`${API_URL}/api/twitter-quests`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch dashboard stats.");
        }

        const quests = data.quests || [];

        const activeQuests = quests.filter(isOpenQuest).length;

        const rewardsAvailable = quests.reduce(
          (sum, quest) => sum + getQuestRewardTotal(quest),
          0,
        );

        const completedWork = quests.reduce(
          (sum, quest) => sum + (Number(quest.submissionsCount) || 0),
          0,
        );

        const contributorSet = new Set();

        quests.forEach((quest) => {
          if (Array.isArray(quest.submissions)) {
            quest.submissions.forEach((submission) => {
              const userId =
                submission.userId ||
                submission.user?._id ||
                submission.user?.id ||
                submission.createdBy ||
                submission.createdBy?._id;

              if (userId) contributorSet.add(String(userId));
            });
          }

          if (Array.isArray(quest.submissionUsers)) {
            quest.submissionUsers.forEach((user) => {
              const userId = user?._id || user?.id || user;
              if (userId) contributorSet.add(String(userId));
            });
          }
        });

        if (mounted) {
          setDashboardStats({
            openOpportunities: activeQuests,
            activeContributors: contributorSet.size,
            rewardsAvailable,
            completedWork,
            openTasks: 0,
            activeQuests,
          });
        }
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        if (mounted) {
          setLoadingStats(false);
        }
      }
    }

    fetchDashboardStats();

    return () => {
      mounted = false;
    };
  }, []);

  const metrics = [
    {
      label: "Open opportunities",
      value: loadingStats
        ? "--"
        : dashboardStats.openOpportunities.toLocaleString(),
      helper: "Across active quests",
      icon: BriefcaseBusiness,
    },
    {
      label: "Active contributors",
      value: loadingStats
        ? "--"
        : dashboardStats.activeContributors.toLocaleString(),
      helper: "Based on quest submissions",
      icon: Users,
    },
    {
      label: "Rewards available",
      value: loadingStats
        ? "--"
        : `${dashboardStats.rewardsAvailable.toLocaleString()} USDC`,
      helper: "Available quest rewards",
      icon: WalletCards,
    },
    {
      label: "Completed work",
      value: loadingStats
        ? "--"
        : dashboardStats.completedWork.toLocaleString(),
      helper: "Verified submissions",
      icon: CheckCircle2,
    },
  ];

  return (
    <main className="min-h-screen">
      <div className="space-y-3 px-2 py-2">
        <section className="overflow-hidden rounded-3xl border border-[#EAECF0] bg-white shadow-sm">
          <div className="relative p-5 sm:p-6 lg:p-7">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-[#EEF2FF] blur-3xl" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex h-7 items-center gap-2 rounded-full border border-[#E0E7FF] bg-[#F4F7FF] px-2.5 text-xs font-medium text-[#2F0FD1]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Contribute
                </div>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#101828] sm:text-4xl">
                  Discover work and complete quests
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085] sm:text-base">
                  Find opportunities from ecosystem projects, submit work, and
                  build a verifiable contributor profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/tasks")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
              >
                Explore opportunities
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {metrics.map((metric) => (
                <MetricCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  helper={metric.helper}
                  icon={metric.icon}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-3 xl:grid-cols-[1fr_340px]">
          <div className="space-y-3 sm:space-y-0">
            <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-[#101828]">
                Start contributing
              </h2>
              <p className="mt-1 text-sm text-[#667085]">
                Choose how you want to participate.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <ActionCard
                  icon={BriefcaseBusiness}
                  title="Tasks"
                  description="Apply to structured work from ecosystem projects."
                  label="Browse tasks"
                  meta={
                    loadingStats
                      ? "--"
                      : `${dashboardStats.openTasks.toLocaleString()} open`
                  }
                  onClick={() => navigate("/tasks")}
                />

                <ActionCard
                  icon={Compass}
                  title="X Quests"
                  description="Create campaign posts and submit your post link."
                  label="Browse X Quests"
                  meta={
                    loadingStats
                      ? "--"
                      : `${dashboardStats.activeQuests.toLocaleString()} active`
                  }
                  onClick={() => navigate("/quests")}
                />

                <ActionCard
                  icon={MessageCircle}
                  title="Discord Quests"
                  description="Community engagement campaigns."
                  label="Coming soon"
                  meta="Soon"
                  status="soon"
                  onClick={() => navigate("/quests")}
                />

                <ActionCard
                  icon={Send}
                  title="Telegram Quests"
                  description="Lightweight participation and submissions."
                  label="Coming soon"
                  meta="Soon"
                  status="soon"
                  onClick={() => navigate("/quests")}
                />
              </div>
            </section>
          </div>

          <aside className="space-y-3">
            <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-[#101828]">
                Contributor overview
              </h3>

              <div className="mt-4 space-y-3">
                <StatusItem
                  icon={WalletCards}
                  title="Rewards"
                  description="Earn from approved work."
                />
                <StatusItem
                  icon={Users}
                  title="Profile"
                  description="Track your activity."
                />
                <StatusItem
                  icon={CheckCircle2}
                  title="Contributions"
                  description="Monitor submissions and outcomes."
                />
              </div>
            </section>

            <section className="rounded-2xl bg-[#101828] p-5 text-white shadow-sm">
              <h3 className="text-sm font-semibold">
                Ready to start contributing?
              </h3>
              <p className="mt-2 text-sm text-white/70">
                Explore available opportunities and begin building your profile.
              </p>

              <button
                type="button"
                onClick={() => navigate("/quests")}
                className="mt-5 h-10 w-full rounded-xl bg-white px-4 text-sm font-medium text-[#101828] transition hover:bg-[#F2F4F7]"
              >
                View opportunities
              </button>
            </section>
          </aside>
        </section>

        <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-[#101828]">
              How Contribute works
            </h2>
            <p className="text-sm text-[#667085]">
              Move from discovery to verified contribution, reputation, and
              rewards.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatusItem
              icon={Compass}
              title="Discover"
              description="Browse open tasks and quests from ecosystem projects."
            />

            <StatusItem
              icon={CheckCircle2}
              title="Contribute"
              description="Apply for work, complete tasks, or submit quest entries."
            />

            <StatusItem
              icon={Trophy}
              title="Grow"
              description="Build a trusted profile through completed contributions."
            />

            <StatusItem
              icon={WalletCards}
              title="Earn"
              description="Receive rewards for approved work and accepted submissions."
            />
          </div>
        </section>
      </div>
    </main>
  );
}
