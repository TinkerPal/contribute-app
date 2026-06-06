import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  CheckCircle2,
  Filter,
  Medal,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
  WalletCards,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

const contributors = [
  {
    id: 1,
    name: "Maya Chen",
    handle: "@mayabuilds",
    avatar: "MC",
    points: 18420,
    earnings: 3260,
    contributions: 48,
    trustScore: 98,
    trustLevel: "Elite",
    specialty: "Smart contracts",
    category: "Development",
    change: 12,
  },
  {
    id: 2,
    name: "Daniel Okafor",
    handle: "@dancontributes",
    avatar: "DO",
    points: 16950,
    earnings: 2840,
    contributions: 41,
    trustScore: 95,
    trustLevel: "Elite",
    specialty: "Technical writing",
    category: "Content",
    change: 8,
  },
  {
    id: 3,
    name: "Aisha Bello",
    handle: "@aishaships",
    avatar: "AB",
    points: 15110,
    earnings: 2210,
    contributions: 37,
    trustScore: 92,
    trustLevel: "Trusted",
    specialty: "Community quests",
    category: "Community",
    change: 5,
  },
  {
    id: 4,
    name: "Leo Martins",
    handle: "@leomartins",
    avatar: "LM",
    points: 13280,
    earnings: 1980,
    contributions: 32,
    trustScore: 89,
    trustLevel: "Trusted",
    specialty: "Frontend",
    category: "Development",
    change: -2,
  },
  {
    id: 5,
    name: "Nora Smith",
    handle: "@noraworks",
    avatar: "NS",
    points: 11940,
    earnings: 1640,
    contributions: 29,
    trustScore: 86,
    trustLevel: "Verified",
    specialty: "Research",
    category: "Research",
    change: 3,
  },
  {
    id: 6,
    name: "Ibrahim Khan",
    handle: "@ibrahimdao",
    avatar: "IK",
    points: 10820,
    earnings: 1420,
    contributions: 24,
    trustScore: 82,
    trustLevel: "Verified",
    specialty: "DAO operations",
    category: "Operations",
    change: 6,
  },
];

const sortOptions = [
  { label: "Overall points", value: "points" },
  { label: "Earnings", value: "earnings" },
  { label: "Contributions", value: "contributions" },
  { label: "Trust score", value: "trustScore" },
];

const categoryOptions = [
  "All categories",
  "Development",
  "Content",
  "Community",
  "Research",
  "Operations",
];

function MetricCard({ icon: Icon, label, value, helper }) {
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

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F0FD1]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function rankClass(rank) {
  if (rank === 1) return "bg-[#FFF7E6] text-[#B54708] border-[#FEDF89]";
  if (rank === 2) return "bg-[#F2F4F7] text-[#475467] border-[#D0D5DD]";
  if (rank === 3) return "bg-[#FFF1F3] text-[#C01048] border-[#FECDD6]";
  return "bg-white text-[#667085] border-[#EAECF0]";
}

function trustClass(level) {
  if (level === "Elite") return "bg-[#ECFDF3] text-[#027A48]";
  if (level === "Trusted") return "bg-[#F4F7FF] text-[#2F0FD1]";
  return "bg-[#F9FAFB] text-[#475467]";
}

export default function LeaderboardPage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("points");
  const [category, setCategory] = useState("All categories");

  const filteredContributors = useMemo(() => {
    return contributors
      .filter((contributor) => {
        const search = query.trim().toLowerCase();

        const matchesSearch =
          !search ||
          contributor.name.toLowerCase().includes(search) ||
          contributor.handle.toLowerCase().includes(search) ||
          contributor.specialty.toLowerCase().includes(search) ||
          contributor.trustLevel.toLowerCase().includes(search);

        const matchesCategory =
          category === "All categories" || contributor.category === category;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => b[sortBy] - a[sortBy]);
  }, [query, sortBy, category]);

  const leader = filteredContributors[0];

  const totalEarnings = contributors.reduce(
    (sum, item) => sum + item.earnings,
    0,
  );
  const totalContributions = contributors.reduce(
    (sum, item) => sum + item.contributions,
    0,
  );
  const averageTrust = Math.round(
    contributors.reduce((sum, item) => sum + item.trustScore, 0) /
      contributors.length,
  );

  return (
    <main className="min-h-screen">
      <div className="space-y-4 px-2 py-2">
        <section className="overflow-hidden rounded-3xl border border-[#EAECF0] bg-white shadow-sm">
          <div className="relative p-5 sm:p-6 lg:p-7">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#EEF2FF] blur-3xl" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex h-7 items-center gap-2 rounded-full border border-[#E0E7FF] bg-[#F4F7FF] px-2.5 text-xs font-medium text-[#2F0FD1]">
                  <Trophy className="h-3.5 w-3.5" />
                  Contributor leaderboard
                </div>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#101828] sm:text-4xl">
                  Ranking by reputation, impact, and rewards
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085] sm:text-base">
                  Discover the most active contributors across Contribute based
                  on points, completed work, earnings, and trust score.
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

            <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                icon={Users}
                label="Ranked contributors"
                value={contributors.length}
                helper="Demo contributor profiles"
              />
              <MetricCard
                icon={WalletCards}
                label="Total earnings"
                value={`$${totalEarnings.toLocaleString()}`}
                helper="Across approved work"
              />
              <MetricCard
                icon={CheckCircle2}
                label="Contributions"
                value={totalContributions.toLocaleString()}
                helper="Verified submissions"
              />
              <MetricCard
                icon={ShieldCheck}
                label="Avg. trust score"
                value={`${averageTrust}%`}
                helper="Reputation quality"
              />
            </div>
          </div>
        </section>

        {leader && (
          <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
            <div className="relative overflow-hidden rounded-3xl border border-[#1D2939] bg-gradient-to-br from-[#101828] via-[#111C32] to-[#182230] p-5 text-white shadow-[0_18px_48px_rgba(16,24,40,0.32)]">
              <div className="absolute -top-14 -right-14 h-44 w-44 rounded-full bg-[#2F0FD1]/25 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-[#F79009]/10 blur-3xl" />

              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-lg font-semibold shadow-lg backdrop-blur-xl">
                    {leader.avatar}
                    <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F79009] text-[10px] font-bold text-white shadow-lg">
                      #1
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-xl">
                    <Medal className="h-3.5 w-3.5 text-[#F79009]" />
                    Current leader
                  </div>
                </div>

                <div className="mt-5">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {leader.name}
                  </h2>
                  <p className="mt-1 text-sm text-white/60">{leader.handle}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                      <Sparkles className="h-3 w-3 text-[#F79009]" />
                      {leader.trustLevel} contributor
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
                      {leader.specialty}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
                    <p className="text-[11px] text-white/50">Points</p>
                    <p className="mt-1 text-sm font-semibold">
                      {leader.points.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
                    <p className="text-[11px] text-white/50">Earned</p>
                    <p className="mt-1 text-sm font-semibold">
                      ${leader.earnings.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
                    <p className="text-[11px] text-white/50">Trust</p>
                    <p className="mt-1 text-sm font-semibold">
                      {leader.trustScore}%
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-white/60">
                      Reputation strength
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {leader.trustScore}/100
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#F79009] to-[#FEC84B]"
                      style={{ width: `${leader.trustScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <section className="rounded-3xl border border-[#EAECF0] bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#101828]">
                    Leaderboard
                  </h2>
                  <p className="mt-1 text-sm text-[#667085]">
                    Filter contributors by category and ranking metric.
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-3 lg:w-[680px]">
                  <div className="relative sm:col-span-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search"
                      className="h-10 w-full rounded-xl border border-[#EAECF0] bg-white pr-3 pl-9 text-sm transition outline-none placeholder:text-[#98A2B3] focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]"
                    />
                  </div>

                  <div className="relative">
                    <Filter className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="h-10 w-full appearance-none rounded-xl border border-[#EAECF0] bg-white pr-3 pl-9 text-sm font-medium text-[#344054] transition outline-none focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]"
                    >
                      {categoryOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <Award className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      className="h-10 w-full appearance-none rounded-xl border border-[#EAECF0] bg-white pr-3 pl-9 text-sm font-medium text-[#344054] transition outline-none focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-[#EAECF0]">
                <div className="hidden grid-cols-[72px_1.5fr_1fr_1fr_1fr_1fr_1fr] border-b border-[#EAECF0] bg-[#F9FAFB] px-4 py-3 text-xs font-medium text-[#667085] xl:grid">
                  <span>Rank</span>
                  <span>Contributor</span>
                  <span>Points</span>
                  <span>Earnings</span>
                  <span>Work</span>
                  <span>Trust</span>
                  <span>Trend</span>
                </div>

                <div className="divide-y divide-[#F2F4F7]">
                  {filteredContributors.map((contributor, index) => {
                    const rank = index + 1;
                    const isPositive = contributor.change >= 0;

                    return (
                      <div
                        key={contributor.id}
                        className="px-3 py-3 transition hover:bg-[#FCFCFD] xl:grid xl:grid-cols-[72px_1.5fr_1fr_1fr_1fr_1fr_1fr] xl:items-center xl:px-4 xl:py-4"
                      >
                        {/* MOBILE CARD */}
                        <div className="xl:hidden">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full border text-xs font-semibold ${rankClass(
                                  rank,
                                )}`}
                              >
                                #{rank}
                              </span>

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-sm font-semibold text-[#2F0FD1]">
                                {contributor.avatar}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#101828]">
                                  {contributor.name}
                                </p>
                                <p className="truncate text-xs text-[#667085]">
                                  {contributor.handle} · {contributor.specialty}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                                isPositive
                                  ? "bg-[#ECFDF3] text-[#027A48]"
                                  : "bg-[#FEF3F2] text-[#B42318]"
                              }`}
                            >
                              {isPositive ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              )}
                              {Math.abs(contributor.change)}
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-[#F9FAFB] p-2">
                            <div>
                              <p className="text-[10px] text-[#98A2B3]">
                                Points
                              </p>
                              <p className="text-xs font-semibold text-[#101828]">
                                {contributor.points.toLocaleString()}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] text-[#98A2B3]">
                                Earned
                              </p>
                              <p className="text-xs font-semibold text-[#101828]">
                                ${contributor.earnings.toLocaleString()}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] text-[#98A2B3]">Work</p>
                              <p className="text-xs font-semibold text-[#101828]">
                                {contributor.contributions}
                              </p>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${trustClass(
                                contributor.trustLevel,
                              )}`}
                            >
                              <ShieldCheck className="h-3 w-3" />
                              {contributor.trustScore}% ·{" "}
                              {contributor.trustLevel}
                            </span>

                            <span className="text-xs text-[#98A2B3]">
                              {contributor.category}
                            </span>
                          </div>
                        </div>

                        {/* DESKTOP ROW */}
                        <div className="hidden xl:contents">
                          <div>
                            <span
                              className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full border text-sm font-semibold ${rankClass(
                                rank,
                              )}`}
                            >
                              #{rank}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-sm font-semibold text-[#2F0FD1]">
                              {contributor.avatar}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-[#101828]">
                                {contributor.name}
                              </p>
                              <p className="text-xs text-[#667085]">
                                {contributor.handle} · {contributor.specialty}
                              </p>
                            </div>
                          </div>

                          <p className="text-sm font-semibold text-[#101828]">
                            {contributor.points.toLocaleString()}
                          </p>

                          <p className="text-sm font-semibold text-[#101828]">
                            ${contributor.earnings.toLocaleString()}
                          </p>

                          <p className="text-sm font-semibold text-[#101828]">
                            {contributor.contributions}
                          </p>

                          <span
                            className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${trustClass(
                              contributor.trustLevel,
                            )}`}
                          >
                            <ShieldCheck className="h-3 w-3" />
                            {contributor.trustScore}% · {contributor.trustLevel}
                          </span>

                          <span
                            className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                              isPositive
                                ? "bg-[#ECFDF3] text-[#027A48]"
                                : "bg-[#FEF3F2] text-[#B42318]"
                            }`}
                          >
                            {isPositive ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )}
                            {Math.abs(contributor.change)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredContributors.length === 0 && (
                  <div className="p-10 text-center">
                    <p className="text-sm font-medium text-[#101828]">
                      No contributors found
                    </p>
                    <p className="mt-1 text-sm text-[#667085]">
                      Try changing your search or filter.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </section>
        )}
      </div>
    </main>
  );
}
