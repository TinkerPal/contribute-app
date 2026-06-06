import { useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Wallet,
  Bot,
  Megaphone,
  BriefcaseBusiness,
  Sparkles,
  CalendarRange,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import Heading from "@/components/dashboard/Heading";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const SCOPE_OPTIONS = [
  { label: "Overview", value: "overview" },
  { label: "Communities", value: "communities" },
  { label: "Quests", value: "quests" },
  { label: "Bursts", value: "bursts" },
  { label: "Bots", value: "bots" },
];

const RANGE_OPTIONS = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "1 Year", value: "1y" },
];

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

function ChartPlaceholder({ title, description, children }) {
  return (
    <div className="rounded-[24px] border border-[#E6EAF5] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-[18px] font-semibold tracking-tight text-[#101828]">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-6 text-[#667085]">{description}</p>
      </div>

      <div className="rounded-2xl border border-dashed border-[#D9E1F2] bg-[#FCFCFD] p-5">
        {children}
      </div>
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

function EmptyAnalyticsState({ title, description }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-[#FCFCFD] px-6 py-10 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F7FF] text-[#2F0FD1]">
        <BarChart3 className="h-8 w-8" />
      </div>

      <div className="max-w-lg space-y-2">
        <h3 className="text-[22px] font-semibold tracking-tight text-[#101828]">
          {title}
        </h3>
        <p className="text-sm leading-6 text-[#667085]">{description}</p>
      </div>
    </div>
  );
}

function Analytics() {
  const { user, isAuthenticated } = useAuth();
  const [scope, setScope] = useState("overview");
  const [range, setRange] = useState("30d");

  const isOwnerLike = Boolean(
    user?.isCommunityOwner ||
    user?.isCreator ||
    user?.isAdmin ||
    user?.roles?.includes?.("owner"),
  );

  const stats = useMemo(() => {
    if (!isOwnerLike) {
      return [
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
      ];
    }

    if (scope === "bots") {
      return [
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
          helperText: "Total engagement across tool outputs",
          trend: "+9%",
        },
        {
          label: "Active Tools",
          value: 4,
          icon: <Sparkles className="h-5 w-5" />,
          accent: "purple",
          helperText: "Currently active bots or automations",
          trend: "Stable",
        },
        {
          label: "Conversions",
          value: "6.4%",
          icon: <ArrowUpRight className="h-5 w-5" />,
          accent: "orange",
          helperText: "Average conversion from tool activity",
          trend: "+1.1%",
        },
      ];
    }

    return [
      {
        label: "Total Reach",
        value: "22.4k",
        icon: <TrendingUp className="h-5 w-5" />,
        accent: "blue",
        helperText: "Audience reached across selected scope",
        trend: "+14%",
      },
      {
        label: "Contributors",
        value: 312,
        icon: <Users className="h-5 w-5" />,
        accent: "green",
        helperText: "Participants active in the selected scope",
        trend: "+21",
      },
      {
        label: "Completions",
        value: 186,
        icon: <BriefcaseBusiness className="h-5 w-5" />,
        accent: "purple",
        helperText: "Completed quests or successful actions",
        trend: "+11%",
      },
      {
        label: "Reward Volume",
        value: "$4,820",
        icon: <Wallet className="h-5 w-5" />,
        accent: "orange",
        helperText: "Rewards distributed in selected range",
        trend: "+7%",
      },
    ];
  }, [isOwnerLike, scope]);

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="md:hidden">
          <Heading />
        </div>

        <EmptyAnalyticsState
          title="Sign in to view analytics"
          description="Your analytics page will show contribution trends, performance summaries, and activity insights."
        />
      </div>
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
                  Track performance across communities, quests, bursts, and
                  tools
                </h2>
                <p className="max-w-2xl text-[15px] leading-7 text-[#667085]">
                  Review high-level performance metrics and activity insights.
                  This view adapts to the type of work you do on the platform.
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
                  label="Role-aware insights"
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:flex-col">
              <div className="inline-flex w-full flex-wrap rounded-xl border border-[#EAECF5] bg-[#F8FAFC] p-1.5 sm:w-auto">
                {RANGE_OPTIONS.map((option) => {
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
            </div>
          </div>
        </div>

        <div className="px-5 py-5 lg:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
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
      </section>

      <section className="rounded-[28px] border border-[#EEF2FF] bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="inline-flex w-full flex-wrap rounded-xl border border-[#EAECF5] bg-[#F8FAFC] p-1.5 xl:w-auto">
              {SCOPE_OPTIONS.map((option) => {
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
                Scope:{" "}
                {SCOPE_OPTIONS.find((item) => item.value === scope)?.label}
              </span>
              <span className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#667085]">
                Range:{" "}
                {RANGE_OPTIONS.find((item) => item.value === range)?.label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <ChartPlaceholder
              title="Performance Trend"
              description={
                isOwnerLike
                  ? "Track how your selected scope performs over time."
                  : "Track how your contribution activity changes over time."
              }
            >
              <div className="flex h-[260px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF2FF] text-[#2F0FD1]">
                  <TrendingUp className="h-7 w-7" />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-lg font-semibold text-[#101828]">
                    Chart area ready
                  </h3>
                  <p className="text-sm leading-6 text-[#667085]">
                    This panel is ready for a real line, bar, or area chart once
                    analytics data is connected.
                  </p>
                </div>
              </div>
            </ChartPlaceholder>

            <ChartPlaceholder
              title="Top Performing Items"
              description={
                isOwnerLike
                  ? "Your best-performing entities in the selected scope."
                  : "Your most active contribution areas in the selected scope."
              }
            >
              <div className="space-y-3">
                {scope === "bots" ? (
                  <>
                    <TopItemRow
                      title="Auto Reply Bot"
                      subtitle="Highest engagement in selected period"
                      value="4.8k"
                      tag="Top tool"
                    />
                    <TopItemRow
                      title="Trend Watcher"
                      subtitle="Highest conversion efficiency"
                      value="7.1%"
                      tag="Efficient"
                    />
                    <TopItemRow
                      title="Content Amplifier"
                      subtitle="Most runs in selected period"
                      value="58"
                      tag="Most active"
                    />
                  </>
                ) : !isOwnerLike ? (
                  <>
                    <TopItemRow
                      title="Growth Task Series"
                      subtitle="Most completed tasks"
                      value="12"
                      tag="Top activity"
                    />
                    <TopItemRow
                      title="Stellar Builders"
                      subtitle="Most active community"
                      value="8"
                      tag="Community"
                    />
                    <TopItemRow
                      title="Reward Streak"
                      subtitle="Most consistent performance"
                      value="5 weeks"
                      tag="Streak"
                    />
                  </>
                ) : (
                  <>
                    <TopItemRow
                      title="Community Launch Campaign"
                      subtitle="Highest contributor participation"
                      value="86"
                      tag="Top quest"
                    />
                    <TopItemRow
                      title="Wallet Onboarding Burst"
                      subtitle="Highest visibility lift"
                      value="+18%"
                      tag="Top burst"
                    />
                    <TopItemRow
                      title="Builder Hub"
                      subtitle="Highest active membership"
                      value="214"
                      tag="Top community"
                    />
                  </>
                )}
              </div>
            </ChartPlaceholder>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#EEF2FF] bg-white p-5 shadow-sm lg:p-6">
        <div className="mb-5">
          <h2 className="text-[22px] font-semibold tracking-tight text-[#101828]">
            Insights
          </h2>
          <p className="mt-1 text-sm text-[#667085]">
            Key observations from the selected scope and time range.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#E6EAF5] bg-[#FCFCFD] p-4">
            <p className="text-sm font-semibold text-[#101828]">
              Growth Signal
            </p>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              {isOwnerLike
                ? "Participation and reach are increasing in your selected scope."
                : "Your recent contribution activity is trending upward."}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E6EAF5] bg-[#FCFCFD] p-4">
            <p className="text-sm font-semibold text-[#101828]">Opportunity</p>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              {scope === "bots"
                ? "You may improve conversions by reviewing underperforming automation runs."
                : "You can focus on your highest-performing areas to increase outcomes."}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E6EAF5] bg-[#FCFCFD] p-4">
            <p className="text-sm font-semibold text-[#101828]">Next Step</p>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              Connect this page to real analytics endpoints, then add charts,
              comparisons, and exportable reports.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Analytics;
