import { useMemo, useState } from "react";
import {
  Wallet,
  Coins,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
  Search,
  Sparkles,
} from "lucide-react";
import Heading from "@/components/dashboard/Heading";
import { Button } from "@/components/ui/button";
import CustomPagination from "@/components/CustomPagination";
import Error from "@/components/Error";
import Loader from "@/components/Loader";
import { useAuth } from "@/hooks/useAuth";

const VIEW_OPTIONS = [
  { label: "Claimable", value: "claimable" },
  { label: "Pending", value: "pending" },
  { label: "Claimed", value: "claimed" },
];

const SORT_OPTIONS = [
  { label: "Newest first", value: "desc" },
  { label: "Oldest first", value: "asc" },
  { label: "Highest amount", value: "amount_desc" },
  { label: "Lowest amount", value: "amount_asc" },
];

function EarningStatCard({ label, value, icon, accent = "blue", helperText }) {
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
          {helperText ? (
            <p className="mt-2 text-xs text-[#98A2B3]">{helperText}</p>
          ) : null}
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

function EarningsInfoPill({ icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#E8EDF7] bg-[#F8FAFC] px-3 py-2 text-sm text-[#667085]">
      <span className="text-[#2F0FD1]">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function EmptyState({ title, description, action }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-[#FCFCFD] px-6 py-10 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F7FF] text-[#2F0FD1]">
        <Wallet className="h-8 w-8" />
      </div>

      <div className="max-w-lg space-y-2">
        <h3 className="text-[22px] font-semibold tracking-tight text-[#101828]">
          {title}
        </h3>
        <p className="text-sm leading-6 text-[#667085]">{description}</p>
      </div>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

function SearchInput({ value, onChange, placeholder = "Search rewards" }) {
  return (
    <div className="relative flex h-11 w-full items-center rounded-xl border border-[#E4E7EC] bg-white pr-3 pl-10 shadow-sm transition focus-within:border-[#C7D7FE] focus-within:ring-2 focus-within:ring-[#EEF2FF] lg:max-w-[320px]">
      <Search className="absolute left-3 h-4 w-4 text-[#98A2B3]" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-sm text-[#344054] outline-none placeholder:text-[#98A2B3]"
      />
    </div>
  );
}

function SimpleSort({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-xl border border-[#E4E7EC] bg-white px-4 text-sm font-medium text-[#344054] shadow-sm outline-none"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function formatAmount(item) {
  const amount = item?.amount ?? 0;
  const symbol = item?.symbol || "";
  return `${amount} ${symbol}`.trim();
}

function formatDate(date) {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString();
}

function EarningRowCard({ item, onClaim }) {
  const isClaimable = item?.status === "claimable";
  const isPending = item?.status === "pending";

  return (
    <div className="rounded-2xl border border-[#E6EAF5] bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-medium text-[#2F0FD1]">
              {item?.communityName || "Community"}
            </span>

            <span
              className={[
                "rounded-full px-3 py-1 text-xs font-medium",
                isClaimable
                  ? "bg-[#ECFDF3] text-[#027A48]"
                  : isPending
                    ? "bg-[#FFF4ED] text-[#C4320A]"
                    : "bg-[#F4F7FF] text-[#475467]",
              ].join(" ")}
            >
              {item?.status === "claimable"
                ? "Claimable"
                : item?.status === "pending"
                  ? "Pending"
                  : "Claimed"}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-[17px] font-semibold text-[#101828]">
              {item?.title || "Reward"}
            </h3>
            <p className="text-sm leading-6 text-[#667085]">
              {item?.description ||
                "Reward entry from your contribution activity."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[#667085]">
            <div className="inline-flex items-center gap-2">
              <Coins className="h-4 w-4 text-[#2F0FD1]" />
              <span>{formatAmount(item)}</span>
            </div>

            <div className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-[#98A2B3]" />
              <span>{formatDate(item?.date)}</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-[#D0D5DD] bg-white px-4 text-sm font-medium text-[#344054] hover:bg-[#F9FAFB]"
          >
            View Source
          </Button>

          {isClaimable ? (
            <Button
              onClick={() => onClaim?.(item)}
              className="h-10 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white hover:bg-[#2409B8]"
            >
              Claim Reward
            </Button>
          ) : item?.status === "claimed" ? (
            <div className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ECFDF3] px-4 text-sm font-medium text-[#027A48]">
              Claimed
            </div>
          ) : (
            <div className="inline-flex h-10 items-center justify-center rounded-xl bg-[#FFF4ED] px-4 text-sm font-medium text-[#C4320A]">
              Awaiting Approval
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Earnings() {
  const { isAuthenticated } = useAuth();

  const [view, setView] = useState("claimable");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [claimingIds, setClaimingIds] = useState([]);

  const LIMIT = 8;

  // Replace this with your real API data later
  const rewards = useMemo(
    () => [
      {
        id: "1",
        title: "Growth Task Reward",
        description: "Reward for completing a Twitter growth task.",
        amount: 50,
        symbol: "XLM",
        status: "claimable",
        date: "2026-04-01",
        communityName: "Stellar Builders",
      },
      {
        id: "2",
        title: "On-chain Task Reward",
        description: "Approved reward for a contract interaction task.",
        amount: 120,
        symbol: "XLM",
        status: "claimable",
        date: "2026-03-30",
        communityName: "Soroban Devs",
      },
      {
        id: "3",
        title: "Community Bounty",
        description: "Pending verification from task review.",
        amount: 80,
        symbol: "XLM",
        status: "pending",
        date: "2026-03-28",
        communityName: "Contribute Hub",
      },
      {
        id: "4",
        title: "Quest Completion Reward",
        description: "Claim already completed.",
        amount: 35,
        symbol: "XLM",
        status: "claimed",
        date: "2026-03-22",
        communityName: "Open Grants",
      },
    ],
    [],
  );

  const filteredRewards = useMemo(() => {
    const term = searchValue.trim().toLowerCase();

    let list = rewards.filter((item) => item.status === view);

    if (term) {
      list = list.filter((item) => {
        const title = String(item?.title || "").toLowerCase();
        const description = String(item?.description || "").toLowerCase();
        const community = String(item?.communityName || "").toLowerCase();
        const symbol = String(item?.symbol || "").toLowerCase();

        return (
          title.includes(term) ||
          description.includes(term) ||
          community.includes(term) ||
          symbol.includes(term)
        );
      });
    }

    if (sortOrder === "desc") {
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    if (sortOrder === "asc") {
      list.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    if (sortOrder === "amount_desc") {
      list.sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0));
    }

    if (sortOrder === "amount_asc") {
      list.sort((a, b) => (a.amount ?? 0) - (b.amount ?? 0));
    }

    return list;
  }, [rewards, view, searchValue, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredRewards.length / LIMIT));

  const paginatedRewards = useMemo(() => {
    const start = (currentPage - 1) * LIMIT;
    return filteredRewards.slice(start, start + LIMIT);
  }, [filteredRewards, currentPage]);

  const summary = useMemo(() => {
    const totalEarned = rewards.reduce(
      (sum, item) => sum + (item.amount ?? 0),
      0,
    );
    const totalClaimed = rewards
      .filter((item) => item.status === "claimed")
      .reduce((sum, item) => sum + (item.amount ?? 0), 0);
    const pendingRewards = rewards
      .filter((item) => item.status === "pending")
      .reduce((sum, item) => sum + (item.amount ?? 0), 0);
    const claimableNow = rewards
      .filter((item) => item.status === "claimable")
      .reduce((sum, item) => sum + (item.amount ?? 0), 0);

    return {
      totalEarned,
      totalClaimed,
      pendingRewards,
      claimableNow,
    };
  }, [rewards]);

  const claimableItems = rewards.filter((item) => item.status === "claimable");

  const handleClaimReward = async (item) => {
    setClaimingIds((prev) => [...prev, item.id]);

    try {
      // Replace with your real claim mutation
      await new Promise((resolve) => setTimeout(resolve, 700));
    } finally {
      setClaimingIds((prev) => prev.filter((id) => id !== item.id));
    }
  };

  const handleClaimAll = async () => {
    const ids = claimableItems.map((item) => item.id);
    setClaimingIds(ids);

    try {
      // Replace with your real claim-all mutation
      await new Promise((resolve) => setTimeout(resolve, 900));
    } finally {
      setClaimingIds([]);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="md:hidden">
          <Heading />
        </div>

        <EmptyState
          title="Sign in to view your earnings"
          description="Your earnings page will show claimable rewards, pending reviews, and your claim history."
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
                <Wallet className="h-4 w-4" />
                Earnings
              </div>

              <div className="space-y-2">
                <h2 className="text-[28px] font-semibold tracking-tight text-[#101828]">
                  Track rewards, pending reviews, and claims
                </h2>
                <p className="max-w-2xl text-[15px] leading-7 text-[#667085]">
                  View your contribution rewards, monitor claimable balances,
                  and keep track of what has been claimed or is still awaiting
                  approval.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <EarningsInfoPill
                  icon={<Coins className="h-4 w-4" />}
                  label="Track earned rewards"
                />
                <EarningsInfoPill
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Monitor pending reviews"
                />
                <EarningsInfoPill
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  label="Claim approved rewards"
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:flex-col">
              <Button
                onClick={handleClaimAll}
                disabled={claimableItems.length === 0 || claimingIds.length > 0}
                className="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8] disabled:opacity-60"
              >
                Claim All Rewards
              </Button>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 lg:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <EarningStatCard
              label="Total Earned"
              value={`${summary.totalEarned} XLM`}
              icon={<Wallet className="h-5 w-5" />}
              accent="blue"
              helperText="All rewards earned from your activity"
            />
            <EarningStatCard
              label="Total Claimed"
              value={`${summary.totalClaimed} XLM`}
              icon={<CheckCircle2 className="h-5 w-5" />}
              accent="green"
              helperText="Rewards successfully claimed"
            />
            <EarningStatCard
              label="Pending Rewards"
              value={`${summary.pendingRewards} XLM`}
              icon={<Clock3 className="h-5 w-5" />}
              accent="orange"
              helperText="Rewards awaiting approval or review"
            />
            <EarningStatCard
              label="Claimable Now"
              value={`${summary.claimableNow} XLM`}
              icon={<Coins className="h-5 w-5" />}
              accent="purple"
              helperText="Rewards available to claim immediately"
            />
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#EEF2FF] bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <SearchInput
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setCurrentPage(1);
                  }}
                />

                <div className="inline-flex w-full flex-wrap rounded-xl border border-[#EAECF5] bg-[#F8FAFC] p-1.5 lg:w-auto">
                  {VIEW_OPTIONS.map((option) => {
                    const isActive = view === option.value;

                    return (
                      <Button
                        key={option.value}
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setView(option.value);
                          setCurrentPage(1);
                        }}
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

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#F4F7FF] px-3 py-1.5 text-xs font-medium text-[#2F0FD1]">
                  View:{" "}
                  {VIEW_OPTIONS.find((item) => item.value === view)?.label}
                </span>

                <span className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#667085]">
                  {filteredRewards.length} reward
                  {filteredRewards.length === 1 ? "" : "s"} shown
                </span>
              </div>
            </div>

            <div className="self-start">
              <SimpleSort
                value={sortOrder}
                onChange={(value) => {
                  setSortOrder(value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Replace these two wrappers with your actual query loading/error when wired */}
          {false ? (
            <Loader label="Loading earnings..." />
          ) : false ? (
            <Error
              title="Failed to load earnings"
              description="Please refresh the page or try again."
            />
          ) : paginatedRewards.length === 0 ? (
            <EmptyState
              title={`No ${VIEW_OPTIONS.find((item) => item.value === view)?.label.toLowerCase()} rewards`}
              description="Rewards matching this view will appear here when available."
              action={
                view !== "claimable" ? (
                  <Button
                    onClick={() => {
                      setView("claimable");
                      setSearchValue("");
                      setCurrentPage(1);
                    }}
                    className="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
                  >
                    View Claimable Rewards
                  </Button>
                ) : null
              }
            />
          ) : (
            <div className="rounded-2xl bg-[#F8FAFC] p-3 ring-1 ring-[#EEF2FF] md:p-4">
              <div className="space-y-4">
                {paginatedRewards.map((item) => (
                  <div
                    key={item.id}
                    className={
                      claimingIds.includes(item.id) ? "opacity-70" : ""
                    }
                  >
                    <EarningRowCard item={item} onClaim={handleClaimReward} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </div>
  );
}

export default Earnings;
