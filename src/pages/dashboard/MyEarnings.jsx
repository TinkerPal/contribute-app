import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Compass,
  Download,
  Filter,
  Loader2,
  Search,
  WalletCards,
} from "lucide-react";

const earnings = [
  {
    id: "earn-001",
    type: "Quest",
    title: "X campaign launch quest",
    source: "Contribute.fi",
    amount: 120,
    asset: "USDC",
    status: "Pending",
    date: "Today",
  },
  {
    id: "earn-002",
    type: "Task",
    title: "Landing page feedback",
    source: "SocketFi",
    amount: 300,
    asset: "USDC",
    status: "Claimed",
    date: "Yesterday",
  },
  {
    id: "earn-003",
    type: "Quest",
    title: "Community engagement quest",
    source: "SoroBuild",
    amount: 85,
    asset: "USDC",
    status: "Pending",
    date: "3 days ago",
  },
  {
    id: "earn-004",
    type: "Task",
    title: "UI polish review",
    source: "Stellar Builders Hub",
    amount: 450,
    asset: "USDC",
    status: "Pending",
    date: "5 days ago",
  },
];

const statusFilters = ["All", "Pending", "Claimed"];
const typeFilters = ["All", "Quest", "Task"];

function Badge({ children, tone = "default" }) {
  const styles = {
    default: "border-[#EAECF0] bg-white text-[#344054]",
    purple: "border-[#E0E7FF] bg-[#F4F7FF] text-[#2F0FD1]",
    green: "border-[#ABEFC6] bg-[#ECFDF3] text-[#027A48]",
    amber: "border-[#FEDF89] bg-[#FFFAEB] text-[#B54708]",
  };

  return (
    <span
      className={`inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

function MetricCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="rounded-2xl border border-[#EAECF0] bg-white p-3 shadow-sm">
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

function EarningsHero({ summary, onClaimAll, claimingId }) {
  const isClaimingAll = claimingId === "all";
  const hasPending = summary.pendingCount > 0;

  return (
    <section className="overflow-hidden rounded-3xl border border-[#EAECF0] bg-white shadow-sm">
      <div className="relative p-4">
        <div className="absolute top-0 right-0 h-28 w-28 rounded-full bg-[#EEF2FF] blur-3xl" />

        <div className="relative flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex h-7 items-center gap-2 rounded-full border border-[#E0E7FF] bg-[#F4F7FF] px-2.5 text-xs font-medium text-[#2F0FD1]">
                  <WalletCards className="h-3.5 w-3.5" />
                  My earnings
                </div>

                {hasPending ? (
                  <div className="inline-flex h-7 items-center rounded-full border border-[#FEDF89] bg-[#FFFAEB] px-2.5 text-xs font-medium text-[#B54708]">
                    {summary.pendingCount} pending rewards
                  </div>
                ) : null}
              </div>

              <h1 className="mt-2 text-xl font-semibold tracking-tight text-[#101828] sm:text-2xl">
                Track rewards and claim earnings
              </h1>

              <p className="mt-1 text-sm text-[#667085]">
                Pending and claimed rewards from quests and tasks.
              </p>
            </div>

            <button
              type="button"
              onClick={onClaimAll}
              disabled={!hasPending || isClaimingAll}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#F2F4F7] disabled:text-[#98A2B3]"
            >
              {isClaimingAll ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Claim all
              {!isClaimingAll ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={WalletCards}
              label="Total earnings"
              value={`${summary.total.toLocaleString()} USDC`}
              helper="Quest and task rewards"
            />

            <MetricCard
              icon={Clock3}
              label="Pending"
              value={`${summary.pending.toLocaleString()} USDC`}
              helper={`${summary.pendingCount} awaiting claim`}
            />

            <MetricCard
              icon={CheckCircle2}
              label="Claimed"
              value={`${summary.claimed.toLocaleString()} USDC`}
              helper="Successfully claimed"
            />

            <MetricCard
              icon={Compass}
              label="Reward sources"
              value={summary.sources}
              helper="Quests and tasks"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function EarningRow({ earning, onClaim, claimingId }) {
  const isPending = earning.status === "Pending";
  const isClaiming = claimingId === earning.id;

  return (
    <article className="rounded-2xl border border-[#EAECF0] bg-white px-3 py-3 shadow-sm transition hover:border-[#D7DDF0] hover:shadow-md sm:px-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge tone={earning.type === "Quest" ? "purple" : "default"}>
              {earning.type}
            </Badge>
            <Badge tone={isPending ? "amber" : "green"}>{earning.status}</Badge>
          </div>

          <h3 className="line-clamp-1 text-[15px] font-semibold text-[#101828] sm:text-base">
            {earning.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-sm text-[#667085]">
            {earning.source} • {earning.date}
          </p>
        </div>

        <div className="grid shrink-0 grid-cols-[1fr_auto] items-center gap-2 lg:w-[300px]">
          <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] text-[#667085]">Amount</p>
            <p className="truncate text-sm font-semibold text-[#101828]">
              {earning.amount.toLocaleString()} {earning.asset}
            </p>
          </div>

          <button
            type="button"
            disabled={!isPending || isClaiming || claimingId === "all"}
            onClick={() => onClaim(earning)}
            className="inline-flex h-9 min-w-[86px] items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-3 text-sm font-medium text-white transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#F2F4F7] disabled:text-[#98A2B3]"
          >
            {isClaiming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPending ? (
              "Claim"
            ) : (
              "Claimed"
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function MyEarnings() {
  const [items, setItems] = useState(earnings);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [claimingId, setClaimingId] = useState("");

  const summary = useMemo(() => {
    const pendingItems = items.filter((item) => item.status === "Pending");
    const claimedItems = items.filter((item) => item.status === "Claimed");

    return {
      total: items.reduce((sum, item) => sum + item.amount, 0),
      pending: pendingItems.reduce((sum, item) => sum + item.amount, 0),
      claimed: claimedItems.reduce((sum, item) => sum + item.amount, 0),
      pendingCount: pendingItems.length,
      sources: new Set(items.map((item) => item.type)).size,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const term = search.trim().toLowerCase();

      const matchesSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.source.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term);

      const matchesStatus =
        activeStatus === "All" || item.status === activeStatus;

      const matchesType = activeType === "All" || item.type === activeType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [items, search, activeStatus, activeType]);

  const handleClaim = (earning) => {
    setClaimingId(earning.id);

    setTimeout(() => {
      setItems((current) =>
        current.map((item) =>
          item.id === earning.id ? { ...item, status: "Claimed" } : item,
        ),
      );
      setClaimingId("");
    }, 500);
  };

  const handleClaimAll = () => {
    setClaimingId("all");

    setTimeout(() => {
      setItems((current) =>
        current.map((item) =>
          item.status === "Pending" ? { ...item, status: "Claimed" } : item,
        ),
      );
      setClaimingId("");
    }, 700);
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto space-y-3 px-2 py-2">
        <EarningsHero
          summary={summary}
          onClaimAll={handleClaimAll}
          claimingId={claimingId}
        />

        <section>
          <div className="sticky top-16 z-30 rounded-2xl border border-[#EAECF0] bg-white/95 p-3 shadow-sm backdrop-blur sm:p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:w-[360px]">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search earnings..."
                  className="h-10 w-full rounded-xl border border-[#EAECF0] bg-white pr-3 pl-9 text-sm text-[#101828] transition outline-none focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 xl:overflow-visible xl:pb-0">
                <div className="inline-flex h-10 shrink-0 items-center gap-1 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-2">
                  <Filter className="h-4 w-4 text-[#667085]" />
                  <select
                    value={activeType}
                    onChange={(event) => setActiveType(event.target.value)}
                    className="h-9 rounded-lg bg-transparent px-1 text-sm font-medium text-[#344054] outline-none"
                  >
                    {typeFilters.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="inline-flex h-10 shrink-0 items-center gap-1 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-2">
                  <Clock3 className="h-4 w-4 text-[#667085]" />
                  <select
                    value={activeStatus}
                    onChange={(event) => setActiveStatus(event.target.value)}
                    className="h-9 rounded-lg bg-transparent px-1 text-sm font-medium text-[#344054] outline-none"
                  >
                    {statusFilters.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-3 text-sm font-medium text-[#344054] transition hover:bg-white"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3">
            {filteredItems.length > 0 ? (
              <div className="flex flex-col gap-2">
                {filteredItems.map((earning) => (
                  <EarningRow
                    key={earning.id}
                    earning={earning}
                    onClaim={handleClaim}
                    claimingId={claimingId}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-white px-6 py-10 text-center">
                <WalletCards className="mb-4 h-10 w-10 text-[#2F0FD1]" />
                <h3 className="text-lg font-semibold text-[#101828]">
                  No earnings found
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#667085]">
                  Rewards from completed quests and accepted task work will
                  appear here.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
