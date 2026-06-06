import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  Filter,
  Grid2X2,
  LayoutList,
  Loader2,
  Search,
  ShieldCheck,
  Trophy,
  WalletCards,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const API_URL = "http://localhost:4000";
const CONTRIBUTIONS_LAYOUT_KEY = "contribute_mvp_contributions_layout";

const typeFilters = ["All", "Quests", "Tasks"];
const statusFilters = ["All", "Submitted", "Accepted", "Rejected", "Rewarded"];
const rewardFilters = ["All", "Rewarded", "Pending reward"];

function getSavedLayout() {
  if (typeof window === "undefined") return "list";
  const saved = window.localStorage.getItem(CONTRIBUTIONS_LAYOUT_KEY);
  return saved === "grid" || saved === "list" ? saved : "list";
}

function Badge({ children, tone = "default" }) {
  const styles = {
    default: "border-[#EAECF0] bg-white text-[#344054]",
    purple: "border-[#E0E7FF] bg-[#F4F7FF] text-[#2F0FD1]",
    green: "border-[#ABEFC6] bg-[#ECFDF3] text-[#027A48]",
    amber: "border-[#FEDF89] bg-[#FFFAEB] text-[#B54708]",
    blue: "border-[#B9E6FE] bg-[#F0F9FF] text-[#026AA2]",
    red: "border-[#FECDCA] bg-[#FEF3F2] text-[#B42318]",
  };

  return (
    <span
      className={`inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

function getStatusTone(status) {
  if (status === "Accepted" || status === "Rewarded") return "green";
  if (status === "Submitted") return "blue";
  if (status === "Rejected") return "red";
  return "amber";
}

function formatDate(value) {
  if (!value) return "Submitted";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Submitted";

  return date.toLocaleDateString();
}

function normalizeQuest(quest) {
  const totalReward = (quest.reward?.prizes || []).reduce(
    (sum, prize) => sum + (Number(prize.amount) || 0),
    0,
  );

  return {
    ...quest,
    id: quest._id || quest.id,
    rewardAmount: totalReward,
    rewardAsset: quest.reward?.asset || "USDC",
  };
}

function normalizeQuestContribution(quest) {
  const submissionStatus =
    quest.submissionStatus ||
    quest.mySubmission?.status ||
    quest.submission?.status ||
    "Submitted";

  const rewarded =
    quest.rewardClaimed ||
    quest.mySubmission?.rewardClaimed ||
    quest.submission?.rewardClaimed ||
    submissionStatus === "Rewarded";

  return {
    id: quest.id || quest._id,
    sourceId: quest.id || quest._id,
    type: "Quest",
    title: quest.title || "Untitled quest",
    company:
      quest.createdBy?.displayName ||
      quest.createdBy?.username ||
      "Contribute.fi",
    category: "X Quest",
    status: rewarded ? "Rewarded" : submissionStatus,
    rewardStatus: rewarded ? "Rewarded" : "Pending reward",
    reward: Number(quest.rewardAmount) || 0,
    rewardAsset: quest.rewardAsset || "USDC",
    submittedAt:
      quest.mySubmission?.createdAt ||
      quest.submission?.createdAt ||
      quest.submittedAt ||
      quest.updatedAt ||
      quest.createdAt,
    note:
      quest.mySubmission?.note ||
      quest.submission?.note ||
      "You participated in this quest.",
    href: `/quests/${quest.id || quest._id}`,
    source: quest,
  };
}

function buildSummary(contributions) {
  const rewarded = contributions.filter(
    (item) => item.rewardStatus === "Rewarded",
  );

  return {
    total: contributions.length,
    quests: contributions.filter((item) => item.type === "Quest").length,
    tasks: contributions.filter((item) => item.type === "Task").length,
    rewarded: rewarded.length,
    pendingReward: contributions.filter(
      (item) => item.rewardStatus === "Pending reward",
    ).length,
    totalRewards: rewarded.reduce(
      (sum, item) => sum + (Number(item.reward) || 0),
      0,
    ),
  };
}

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

function ContributionsHero({ summary, onBrowse }) {
  const items = [
    ["Quest contributions", summary.quests],
    ["Task contributions", summary.tasks],
    ["Rewarded", summary.rewarded],
    ["Rewards earned", `$${summary.totalRewards.toLocaleString()}`],
  ];

  return (
    <section className="rounded-2xl border border-[#EAECF0] bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="purple">My contributions</Badge>
            <Badge tone="green">{summary.total} total</Badge>
          </div>

          <h1 className="mt-2 text-xl font-semibold tracking-tight text-[#101828] sm:text-2xl">
            Track quests, tasks, rewards, and outcomes
          </h1>

          {/* <p className="mt-1 max-w-2xl text-sm leading-6 text-[#667085]">
            Monitor opportunities you participated in and filter by type,
            status, or reward outcome.
          </p> */}
        </div>

        <button
          type="button"
          onClick={onBrowse}
          className="h-10 shrink-0 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white transition hover:bg-[#2409B8]"
        >
          Browse opportunities
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-[#F2F4F7] bg-[#FCFCFD] px-3 py-2"
          >
            <p className="text-[11px] text-[#667085]">{label}</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-[#101828]">
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContributionCard({ contribution, layout, onOpen }) {
  if (layout === "grid") {
    return (
      <article
        onClick={() => onOpen(contribution)}
        className="group cursor-pointer rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm transition hover:border-[#D7DDF0] hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone={contribution.type === "Quest" ? "purple" : "blue"}>
              {contribution.type}
            </Badge>
            <Badge tone={getStatusTone(contribution.status)}>
              {contribution.status}
            </Badge>
          </div>

          <ArrowUpRight className="h-4 w-4 shrink-0 text-[#98A2B3] transition group-hover:text-[#2F0FD1]" />
        </div>

        <h3 className="mt-3 line-clamp-2 text-[15px] leading-6 font-semibold text-[#101828]">
          {contribution.title}
        </h3>

        <p className="mt-1 text-xs text-[#667085]">
          {contribution.company} • {formatDate(contribution.submittedAt)}
        </p>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#667085]">
          {contribution.note}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] text-[#667085]">Reward</p>
            <p className="truncate text-sm font-semibold text-[#101828]">
              {contribution.reward} {contribution.rewardAsset}
            </p>
          </div>

          <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] text-[#667085]">Reward status</p>
            <p className="truncate text-sm font-semibold text-[#101828]">
              {contribution.rewardStatus}
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => onOpen(contribution)}
      className="group cursor-pointer rounded-2xl border border-[#EAECF0] bg-white p-3 shadow-sm transition hover:border-[#D7DDF0] hover:shadow-md sm:p-4"
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge tone={contribution.type === "Quest" ? "purple" : "blue"}>
              {contribution.type}
            </Badge>
            <Badge tone="default">{contribution.category}</Badge>
            <Badge tone={getStatusTone(contribution.status)}>
              {contribution.status}
            </Badge>
            <Badge tone={getStatusTone(contribution.rewardStatus)}>
              {contribution.rewardStatus}
            </Badge>
          </div>

          <h3 className="line-clamp-1 text-[15px] font-semibold text-[#101828] sm:text-base">
            {contribution.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-sm text-[#667085]">
            {contribution.company} • Submitted{" "}
            {formatDate(contribution.submittedAt)} • {contribution.note}
          </p>
        </div>

        <div className="grid shrink-0 grid-cols-3 gap-2 xl:w-[440px]">
          <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] text-[#667085]">Reward</p>
            <p className="truncate text-sm font-semibold text-[#101828]">
              {contribution.reward} {contribution.rewardAsset}
            </p>
          </div>

          <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] text-[#667085]">Type</p>
            <p className="text-sm font-semibold text-[#101828]">
              {contribution.type}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-3 py-2">
            <div>
              <p className="text-[11px] text-[#667085]">Action</p>
              <p className="text-sm font-semibold text-[#101828]">View</p>
            </div>
            <ChevronRight className="h-4 w-4 text-[#98A2B3] transition group-hover:text-[#2F0FD1]" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MyContributions() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [contributions, setContributions] = useState([]);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeReward, setActiveReward] = useState("All");
  const [layout, setLayout] = useState(getSavedLayout);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    window.localStorage.setItem(CONTRIBUTIONS_LAYOUT_KEY, layout);
  }, [layout]);

  useEffect(() => {
    let isMounted = true;

    async function fetchContributions() {
      try {
        setLoading(true);
        setErrorMessage("");

        const token = accessToken || localStorage.getItem("accessToken");

        const res = await fetch(`${API_URL}/api/twitter-quests`, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch contributions.");
        }

        const normalizedQuests = (data.quests || []).map(normalizeQuest);

        const participatedQuestContributions = normalizedQuests
          .filter((quest) => Boolean(quest.hasSubmitted))
          .map(normalizeQuestContribution);

        if (isMounted) {
          setContributions(participatedQuestContributions);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Failed to fetch contributions.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchContributions();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const summary = useMemo(() => buildSummary(contributions), [contributions]);

  const filteredContributions = useMemo(() => {
    return contributions.filter((contribution) => {
      const term = search.trim().toLowerCase();

      const matchesSearch =
        !term ||
        contribution.title.toLowerCase().includes(term) ||
        contribution.company.toLowerCase().includes(term) ||
        contribution.category.toLowerCase().includes(term) ||
        contribution.type.toLowerCase().includes(term) ||
        contribution.status.toLowerCase().includes(term);

      const matchesType =
        activeType === "All" || `${contribution.type}s` === activeType;

      const matchesStatus =
        activeStatus === "All" || contribution.status === activeStatus;

      const matchesReward =
        activeReward === "All" || contribution.rewardStatus === activeReward;

      return matchesSearch && matchesType && matchesStatus && matchesReward;
    });
  }, [contributions, search, activeType, activeStatus, activeReward]);

  const handleOpenContribution = (contribution) => {
    if (contribution.href) {
      navigate(contribution.href);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto space-y-3 px-2 py-2">
        <ContributionsHero
          summary={summary}
          onBrowse={() => navigate("/tasks")}
        />

        <section>
          <div className="sticky top-16 z-30 rounded-2xl border border-[#EAECF0] bg-white/95 p-3 shadow-sm backdrop-blur sm:p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:w-[360px]">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search contributions..."
                  className="h-11 w-full rounded-xl border border-[#EAECF0] bg-white pr-3 pl-9 text-sm text-[#101828] transition outline-none focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 xl:overflow-visible xl:pb-0">
                <div className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-2">
                  <Filter className="h-4 w-4 text-[#667085]" />
                  <select
                    value={activeType}
                    onChange={(event) => setActiveType(event.target.value)}
                    className="h-10 rounded-lg bg-transparent px-1 text-sm font-medium text-[#344054] outline-none"
                  >
                    {typeFilters.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-2">
                  <Clock3 className="h-4 w-4 text-[#667085]" />
                  <select
                    value={activeStatus}
                    onChange={(event) => setActiveStatus(event.target.value)}
                    className="h-10 rounded-lg bg-transparent px-1 text-sm font-medium text-[#344054] outline-none"
                  >
                    {statusFilters.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-2">
                  <WalletCards className="h-4 w-4 text-[#667085]" />
                  <select
                    value={activeReward}
                    onChange={(event) => setActiveReward(event.target.value)}
                    className="h-10 rounded-lg bg-transparent px-1 text-sm font-medium text-[#344054] outline-none"
                  >
                    {rewardFilters.map((reward) => (
                      <option key={reward}>{reward}</option>
                    ))}
                  </select>
                </div>

                <div className="inline-flex shrink-0 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] p-1">
                  <button
                    type="button"
                    onClick={() => setLayout("grid")}
                    className={`inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-sm font-medium transition ${
                      layout === "grid"
                        ? "bg-white text-[#2F0FD1] shadow-sm"
                        : "text-[#667085] hover:bg-white"
                    }`}
                  >
                    <Grid2X2 className="h-4 w-4" />
                    Grid
                  </button>

                  <button
                    type="button"
                    onClick={() => setLayout("list")}
                    className={`inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-sm font-medium transition ${
                      layout === "list"
                        ? "bg-white text-[#2F0FD1] shadow-sm"
                        : "text-[#667085] hover:bg-white"
                    }`}
                  >
                    <LayoutList className="h-4 w-4" />
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3">
            {loading ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-[#EAECF0] bg-white px-6 py-10 text-center shadow-sm">
                <Loader2 className="mb-4 h-9 w-9 animate-spin text-[#2F0FD1]" />
                <h3 className="text-lg font-semibold text-[#101828]">
                  Loading contributions
                </h3>
                <p className="mt-2 text-sm text-[#667085]">
                  Fetching your participated quests...
                </p>
              </div>
            ) : errorMessage ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-white px-6 py-10 text-center">
                <BriefcaseBusiness className="mb-4 h-10 w-10 text-[#2F0FD1]" />
                <h3 className="text-lg font-semibold text-[#101828]">
                  Could not load contributions
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#667085]">
                  {errorMessage}
                </p>
              </div>
            ) : filteredContributions.length > 0 ? (
              <div
                className={
                  layout === "grid"
                    ? "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
                    : "flex flex-col gap-2.5"
                }
              >
                {filteredContributions.map((contribution) => (
                  <ContributionCard
                    key={`${contribution.type}-${contribution.id}`}
                    contribution={contribution}
                    layout={layout}
                    onOpen={handleOpenContribution}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-white px-6 py-10 text-center">
                <ShieldCheck className="mb-4 h-10 w-10 text-[#2F0FD1]" />
                <h3 className="text-lg font-semibold text-[#101828]">
                  No contributions found
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#667085]">
                  Contributions will appear here after you participate in quests
                  or tasks.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/quests")}
                  className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white transition hover:bg-[#2409B8]"
                >
                  Browse quests
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
