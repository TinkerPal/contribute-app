import { useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Wallet,
  Bot,
  Sparkles,
  CalendarRange,
  Activity,
  BriefcaseBusiness,
  Compass,
  Megaphone,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import Heading from "@/components/dashboard/Heading";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const SCOPES = [
  { label: "My Activity", value: "activity" },
  { label: "My Communities", value: "communities" },
  { label: "My Quests", value: "quests" },
  { label: "My Bursts", value: "bursts" },
  { label: "My Bots", value: "bots" },
];

const RANGES = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
];

const ANALYTICS_DATA = {
  activity: {
    stats: [
      {
        label: "Tasks Completed",
        value: 24,
        icon: <BriefcaseBusiness className="h-5 w-5" />,
        accent: "blue",
        helperText: "Completed contributions in selected period",
        trend: "+12%",
      },
      {
        label: "Rewards Earned",
        value: "$1,250",
        icon: <Wallet className="h-5 w-5" />,
        accent: "green",
        helperText: "Rewards accumulated from activity",
        trend: "+8%",
      },
      {
        label: "Communities Joined",
        value: 8,
        icon: <Users className="h-5 w-5" />,
        accent: "purple",
        helperText: "Active communities you participate in",
        trend: "+2",
      },
      {
        label: "Engagement Rate",
        value: "78%",
        icon: <Activity className="h-5 w-5" />,
        accent: "orange",
        helperText: "Participation consistency across opportunities",
        trend: "+5%",
      },
    ],
    trendData: [
      { label: "Week 1", value: 18 },
      { label: "Week 2", value: 26 },
      { label: "Week 3", value: 21 },
      { label: "Week 4", value: 34 },
    ],
    topItems: [
      {
        title: "Growth Task Series",
        subtitle: "Most completed task category",
        value: "12",
        tag: "Top activity",
      },
      {
        title: "Stellar Builders",
        subtitle: "Most active community",
        value: "8",
        tag: "Community",
      },
      {
        title: "Reward Streak",
        subtitle: "Most consistent period",
        value: "5 weeks",
        tag: "Streak",
      },
    ],
    insights: [
      "Your completion rate improved compared to the previous period.",
      "Most of your rewards came from growth-related tasks.",
      "You are most active in community-driven contribution programs.",
    ],
  },
  communities: {
    stats: [
      {
        label: "Communities Owned",
        value: 2,
        icon: <Users className="h-5 w-5" />,
        accent: "blue",
        helperText: "Communities you created or manage",
        trend: "+1",
      },
      {
        label: "Active Members",
        value: 214,
        icon: <Activity className="h-5 w-5" />,
        accent: "green",
        helperText: "Total active members",
        trend: "+16%",
      },
      {
        label: "Open Quests",
        value: 9,
        icon: <BriefcaseBusiness className="h-5 w-5" />,
        accent: "purple",
        helperText: "Currently live quests",
        trend: "+3",
      },
      {
        label: "Reward Volume",
        value: "$3,420",
        icon: <Wallet className="h-5 w-5" />,
        accent: "orange",
        helperText: "Rewards distributed ",
        trend: "+11%",
      },
    ],
    trendData: [
      { label: "Week 1", value: 48 },
      { label: "Week 2", value: 72 },
      { label: "Week 3", value: 81 },
      { label: "Week 4", value: 96 },
    ],
    topItems: [
      {
        title: "Builder Hub",
        subtitle: "Highest active membership",
        value: "126",
        tag: "Top community",
      },
      {
        title: "Stellar Dev Circle",
        subtitle: "Highest task completion",
        value: "42",
        tag: "Performance",
      },
      {
        title: "Community Reach",
        subtitle: "Best month-over-month growth",
        value: "+18%",
        tag: "Growth",
      },
    ],
    insights: [
      "Community engagement is growing steadily.",
      "Your highest-performing community has stronger recurring participation.",
      "Quests with shorter completion cycles drive better member retention.",
    ],
  },
  quests: {
    stats: [
      {
        label: "Quests Created",
        value: 18,
        icon: <BriefcaseBusiness className="h-5 w-5" />,
        accent: "blue",
        helperText: "Quests created in selected period",
        trend: "+4",
      },
      {
        label: "Completions",
        value: 186,
        icon: <CheckCircle2 className="h-5 w-5" />,
        accent: "green",
        helperText: "Completed participant submissions",
        trend: "+13%",
      },
      {
        label: "Avg. Completion Rate",
        value: "64%",
        icon: <TrendingUp className="h-5 w-5" />,
        accent: "purple",
        helperText: "Average performance across quests",
        trend: "+6%",
      },
      {
        label: "Reward Spend",
        value: "$2,180",
        icon: <Wallet className="h-5 w-5" />,
        accent: "orange",
        helperText: "Total quest-related reward distribution",
        trend: "+9%",
      },
    ],
    trendData: [
      { label: "Week 1", value: 9 },
      { label: "Week 2", value: 15 },
      { label: "Week 3", value: 13 },
      { label: "Week 4", value: 19 },
    ],
    topItems: [
      {
        title: "Wallet Onboarding Quest",
        subtitle: "Highest completion volume",
        value: "58",
        tag: "Top quest",
      },
      {
        title: "Social Growth Quest",
        subtitle: "Best conversion rate",
        value: "72%",
        tag: "Efficient",
      },
      {
        title: "On-chain Trial Quest",
        subtitle: "Highest reward efficiency",
        value: "$4.2 / completion",
        tag: "ROI",
      },
    ],
    insights: [
      "Growth quests are converting better than more complex technical quests.",
      "Quests with clearer instructions see higher completion rates.",
      "Reward efficiency improves when tasks have simpler submission steps.",
    ],
  },
  bursts: {
    stats: [
      {
        label: "Bursts Created",
        value: 7,
        icon: <Megaphone className="h-5 w-5" />,
        accent: "blue",
        helperText: "Burst campaigns launched",
        trend: "+2",
      },
      {
        label: "Participants",
        value: 92,
        icon: <Users className="h-5 w-5" />,
        accent: "green",
        helperText: "Total participants across bursts",
        trend: "+19%",
      },
      {
        label: "Avg. Response Rate",
        value: "68%",
        icon: <TrendingUp className="h-5 w-5" />,
        accent: "purple",
        helperText: "Average burst interaction rate",
        trend: "+7%",
      },
      {
        label: "Reward Volume",
        value: "$940",
        icon: <Wallet className="h-5 w-5" />,
        accent: "orange",
        helperText: "Rewards attached to bursts",
        trend: "+5%",
      },
    ],
    trendData: [
      { label: "Week 1", value: 6 },
      { label: "Week 2", value: 14 },
      { label: "Week 3", value: 11 },
      { label: "Week 4", value: 18 },
    ],
    topItems: [
      {
        title: "Launch Visibility Burst",
        subtitle: "Highest participant interest",
        value: "34",
        tag: "Top burst",
      },
      {
        title: "Builder Update Burst",
        subtitle: "Best response rate",
        value: "74%",
        tag: "Top response",
      },
      {
        title: "Trend Capture Burst",
        subtitle: "Strongest reward efficiency",
        value: "$3.8 / entrant",
        tag: "Efficient",
      },
    ],
    insights: [
      "Bursts tied to current trends receive higher participation.",
      "Shorter burst windows drive faster response cycles.",
      "Clear incentive structure improves submission quality.",
    ],
  },
  bots: {
    stats: [
      {
        label: "Bot Runs",
        value: 128,
        icon: <Bot className="h-5 w-5" />,
        accent: "blue",
        helperText: "Executions in selected timeframe",
        trend: "+18%",
      },
      {
        label: "Engagement Generated",
        value: "14.2k",
        icon: <TrendingUp className="h-5 w-5" />,
        accent: "green",
        helperText: "Interactions driven by your bots",
        trend: "+9%",
      },
      {
        label: "Active Bots",
        value: 4,
        icon: <Sparkles className="h-5 w-5" />,
        accent: "purple",
        helperText: "Currently active automations",
        trend: "Stable",
      },
      {
        label: "Conversions",
        value: "6.4%",
        icon: <ArrowUpRight className="h-5 w-5" />,
        accent: "orange",
        helperText: "Average conversion rate from bot activity",
        trend: "+1.1%",
      },
    ],
    trendData: [
      { label: "Week 1", value: 21 },
      { label: "Week 2", value: 29 },
      { label: "Week 3", value: 33 },
      { label: "Week 4", value: 45 },
    ],
    topItems: [
      {
        title: "Auto Reply Bot",
        subtitle: "Highest engagement in selected period",
        value: "4.8k",
        tag: "Top tool",
      },
      {
        title: "Trend Watcher",
        subtitle: "Highest conversion efficiency",
        value: "7.1%",
        tag: "Efficient",
      },
      {
        title: "Content Amplifier",
        subtitle: "Most runs in selected period",
        value: "58",
        tag: "Most active",
      },
    ],
    insights: [
      "Your most active bot is also your strongest engagement generator.",
      "Automation frequency is increasing without a drop in conversion quality.",
      "Some lower-performing bots may need targeting or prompt refinement.",
    ],
  },
};

function AnalyticsStatCard({
  label,
  value,
  icon,
  accent = "blue",
  helperText,
  trend,
}) {
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
          <p className="mt-2 text-[28px] leading-none font-semibold tracking-tight text-[#101828]">
            {value}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {helperText ? (
              <p className="text-xs text-[#98A2B3]">{helperText}</p>
            ) : null}
            {trend ? (
              <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-medium text-[#475467]">
                {trend}
              </span>
            ) : null}
          </div>
        </div>

        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-200",
            "group-hover:scale-105",
            theme.iconWrap,
          ].join(" ")}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoPill({ icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#E8EDF7] bg-[#F8FAFC] px-3 py-2 text-sm text-[#667085]">
      <span className="text-[#2F0FD1]">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function EmptyAnalyticsState({ title, description, actionLabel, icon }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-[#FCFCFD] px-6 py-10 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F7FF] text-[#2F0FD1]">
        {icon}
      </div>
      <div className="max-w-lg space-y-2">
        <h3 className="text-[22px] font-semibold tracking-tight text-[#101828]">
          {title}
        </h3>
        <p className="text-sm leading-6 text-[#667085]">{description}</p>
      </div>
      {actionLabel ? (
        <Button className="mt-5 h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

function TopItemRow({ title, subtitle, value, tag }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#F2F4F7] bg-[#FCFCFD] px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-[#101828]">{title}</p>
        <p className="mt-1 truncate text-xs text-[#667085]">{subtitle}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {tag ? (
          <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[11px] font-medium text-[#2F0FD1]">
            {tag}
          </span>
        ) : null}
        <span className="text-sm font-semibold text-[#101828]">{value}</span>
      </div>
    </div>
  );
}

// function TrendBars({ data = [] }) {
//   const max = Math.max(...data.map((d) => d.value || 0), 1);

//   return (
//     <div className="flex h-[280px] items-end gap-4">
//       {data.map((item) => {
//         const height = `${Math.max((item.value / max) * 100, 6)}%`;

//         return (
//           <div
//             key={item.label}
//             className="flex flex-1 flex-col items-center gap-3"
//           >
//             <div className="flex h-[220px] w-full items-end rounded-2xl bg-[#F8FAFC] p-2 ring-1 ring-[#EEF2FF]">
//               <div
//                 className="relative w-full rounded-xl bg-gradient-to-t from-[#2F0FD1] via-[#5B3DF5] to-[#9B8CFF] shadow-sm transition-all duration-300 hover:opacity-95"
//                 style={{ height }}
//               >
//                 <div className="absolute inset-x-0 top-0 h-3 rounded-t-xl bg-white/20" />
//               </div>
//             </div>

//             <div className="text-center">
//               <p className="text-xs font-medium text-[#667085]">{item.label}</p>
//               <p className="mt-1 text-sm font-semibold text-[#101828]">
//                 {item.value}
//               </p>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

function TrendBars({ data = [] }) {
  const max = Math.max(...data.map((d) => d.value || 0), 1);

  return (
    <div className="flex h-[300px] items-end gap-4">
      {data.map((item) => {
        const heightPercent = (item.value / max) * 100;
        const height = `${Math.max(heightPercent, 8)}%`;

        return (
          <div key={item.label} className="flex flex-1 flex-col items-center">
            {/* VALUE (TOP) */}
            <div className="mb-2 text-sm font-semibold text-[#101828]">
              {item.value}
            </div>

            {/* BAR TRACK */}
            <div className="flex h-[220px] w-full items-end rounded-2xl bg-[#F8FAFC] p-2 ring-1 ring-[#EEF2FF]">
              <div
                className="relative w-full rounded-xl bg-gradient-to-t from-[#2F0FD1] via-[#4F46E5] to-[#C7D2FE] shadow-sm transition-all duration-300"
                style={{ height }}
              >
                {/* subtle highlight */}
                <div className="absolute inset-x-0 top-0 h-3 rounded-t-xl bg-white/20" />
              </div>
            </div>

            {/* LABEL */}
            <p className="mt-2 text-xs font-medium text-[#667085]">
              {item.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function InsightsCard({ insights }) {
  return (
    <div className="rounded-[24px] border border-[#E6EAF5] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-[18px] font-semibold tracking-tight text-[#101828]">
          Insights
        </h3>
        <p className="mt-1 text-sm leading-6 text-[#667085]">
          Key observations from the selected scope and time range.
        </p>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="rounded-xl border border-[#F2F4F7] bg-[#FCFCFD] px-4 py-3"
          >
            <p className="text-sm leading-6 text-[#667085]">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  const { isAuthenticated } = useAuth();
  const [scope, setScope] = useState("activity");
  const [range, setRange] = useState("30d");
  const [showEmptyStateDemo, setShowEmptyStateDemo] = useState(false);

  const scopeConfig = {
    activity: {
      empty: {
        title: "No activity yet",
        description:
          "Start participating in tasks and communities. Your activity analytics will appear here.",
        actionLabel: "Explore Tasks",
        icon: <Compass className="h-8 w-8" />,
      },
    },
    communities: {
      empty: {
        title: "No communities yet",
        description:
          "Create your first community to start tracking members, quests, and reward analytics.",
        actionLabel: "Create Community",
        icon: <Users className="h-8 w-8" />,
      },
    },
    quests: {
      empty: {
        title: "No quests created",
        description:
          "Create quests to track participation, completion rates, and reward efficiency.",
        actionLabel: "Create Quest",
        icon: <BriefcaseBusiness className="h-8 w-8" />,
      },
    },
    bursts: {
      empty: {
        title: "No bursts yet",
        description:
          "Launch a burst to start tracking submissions, responses, and participation.",
        actionLabel: "Create Burst",
        icon: <Megaphone className="h-8 w-8" />,
      },
    },
    bots: {
      empty: {
        title: "No bots connected",
        description:
          "Connect or launch bots to track runs, engagement, and conversions here.",
        actionLabel: "Explore Bots",
        icon: <Bot className="h-8 w-8" />,
      },
    },
  };

  const currentData = ANALYTICS_DATA[scope];
  const isEmpty = showEmptyStateDemo || !currentData;

  if (!isAuthenticated) {
    return (
      <EmptyAnalyticsState
        title="Sign in to view analytics"
        description="Your analytics will appear here once you start using the platform."
        icon={<BarChart3 className="h-8 w-8" />}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:hidden">
        <Heading />
      </div>

      <section className="overflow-hidden rounded-[28px] border border-[#EEF2FF] bg-white shadow-sm">
        <div className="border-b border-[#F2F4F7] bg-gradient-to-r from-[#FCFCFD] to-[#F8FAFF] px-5 py-6 lg:px-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1.5 text-sm font-medium text-[#2F0FD1]">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </div>

              <div className="space-y-2">
                <h2 className="text-[28px] font-semibold tracking-tight text-[#101828]">
                  Track performance across your activity, communities, quests,
                  bursts, and bots
                </h2>
                <p className="max-w-2xl text-[15px] leading-7 text-[#667085]">
                  Review high-level metrics, trends, and top-performing areas.
                  Switch scopes to inspect different parts of your Contribute
                  activity.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <InfoPill
                  icon={<TrendingUp className="h-4 w-4" />}
                  label="Performance trends"
                />
                <InfoPill
                  icon={<CalendarRange className="h-4 w-4" />}
                  label="Time-based analysis"
                />
                <InfoPill
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Scope-specific insights"
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:flex-col">
              <div className="inline-flex w-full flex-wrap rounded-xl border border-[#EAECF5] bg-[#F8FAFC] p-1.5 sm:w-auto">
                {RANGES.map((option) => {
                  const isActive = range === option.value;
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant="ghost"
                      onClick={() => setRange(option.value)}
                      className={[
                        "h-10 rounded-lg px-4 text-sm font-medium transition-all",
                        "hover:bg-white hover:text-[#2F0FD1]",
                        isActive
                          ? "bg-white text-[#2F0FD1] shadow-sm"
                          : "text-[#667085]",
                      ].join(" ")}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => setShowEmptyStateDemo((prev) => !prev)}
                className="h-10 rounded-xl border-[#D0D5DD] bg-white px-4 text-sm font-medium text-[#344054] hover:bg-[#F9FAFB]"
              >
                {showEmptyStateDemo
                  ? "Show Sample Data"
                  : "Preview Empty State"}
              </Button>
            </div>
          </div>
        </div>

        {!isEmpty && currentData ? (
          <div className="px-5 py-5 lg:px-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {currentData.stats.map((stat) => (
                <AnalyticsStatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  accent={stat.accent}
                  helperText={stat.helperText}
                  trend={stat.trend}
                />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-[28px] border border-[#EEF2FF] bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="inline-flex w-full flex-wrap rounded-xl border border-[#EAECF5] bg-[#F8FAFC] p-1.5 xl:w-auto">
              {[
                { label: "My Activity", value: "activity" },
                { label: "My Communities", value: "communities" },
                { label: "My Quests", value: "quests" },
                { label: "My Bursts", value: "bursts" },
                { label: "My Bots", value: "bots" },
              ].map((option) => {
                const isActive = scope === option.value;

                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant="ghost"
                    onClick={() => setScope(option.value)}
                    className={[
                      "h-10 rounded-lg px-4 text-sm font-medium transition-all",
                      "hover:bg-white hover:text-[#2F0FD1]",
                      isActive
                        ? "bg-white text-[#2F0FD1] shadow-sm"
                        : "text-[#667085]",
                    ].join(" ")}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#F4F7FF] px-3 py-1.5 text-xs font-medium text-[#2F0FD1]">
                Scope: {SCOPES.find((item) => item.value === scope)?.label}
              </span>
              <span className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#667085]">
                Range: {RANGES.find((item) => item.value === range)?.label}
              </span>
            </div>
          </div>

          {isEmpty ? (
            <EmptyAnalyticsState {...scopeConfig[scope].empty} />
          ) : (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[24px] border border-[#E6EAF5] bg-white p-5 shadow-sm">
                <div className="mb-5">
                  <h3 className="text-[18px] font-semibold tracking-tight text-[#101828]">
                    Performance Trend
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#667085]">
                    Trend view for the selected scope and date range.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#EEF2FF] bg-[#FCFCFD] p-5">
                  <TrendBars data={currentData.trendData} />
                </div>
              </div>

              <div className="rounded-[24px] border border-[#E6EAF5] bg-white p-5 shadow-sm">
                <div className="mb-5">
                  <h3 className="text-[18px] font-semibold tracking-tight text-[#101828]">
                    Top Performing Items
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#667085]">
                    Best-performing items in the selected scope.
                  </p>
                </div>

                <div className="space-y-3">
                  {currentData.topItems.map((item, index) => (
                    <TopItemRow
                      key={index}
                      title={item.title}
                      subtitle={item.subtitle}
                      value={item.value}
                      tag={item.tag}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {!isEmpty && currentData ? (
        <InsightsCard insights={currentData.insights} />
      ) : null}
    </div>
  );
}

export default Analytics;
