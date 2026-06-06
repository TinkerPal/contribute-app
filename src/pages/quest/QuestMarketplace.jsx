import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { BriefcaseBusiness, Loader2 } from "lucide-react";
import MarketplaceHero from "@/components/quests/MarketplaceHero";
import QuestCard from "@/components/quests/QuestCard";
import QuestFilters from "@/components/quests/QuestFilters";
import QuestListItem from "@/components/quests/QuestListItem";
import { getSavedLayout, saveLayout } from "@/lib/questUtils";
import { useAuth } from "@/hooks/useAuth";

const API_URL = "http://localhost:4000";

const DEFAULT_STATS = {
  openQuests: 0,
  totalBudget: 0,
  totalBudgetUsd: 0,
  totalApplicants: 0,
  acceptedApplications: 0,

  totalQuests: 0,
  activeQuests: 0,
  totalRewards: 0,
  totalApplications: 0,

  total: 0,
  open: 0,
  active: 0,
  rewards: 0,
  applications: 0,
  applicants: 0,
  earned: 0,
};

function getQuestPath(quest) {
  const questId = quest.id || quest._id;

  if (quest.status === "draft") {
    return `/quests/create/${questId}`;
  }

  return `/quests/${questId}`;
}

function normalizeQuest(quest) {
  const totalReward = (quest.reward?.prizes || []).reduce(
    (sum, prize) => sum + (Number(prize.amount) || 0),
    0,
  );

  return {
    ...quest,
    id: quest._id || quest.id,
    category: "X Quest",
    company: "Contribute.fi",
    level: quest.reward?.selectionType?.replaceAll("_", " ") || "Quest",
    status: quest.status || "active",
    deadline: quest.endAt
      ? new Date(quest.endAt).toLocaleDateString()
      : "Not set",
    applicants: quest.submissionsCount || 0,
    estimatedTime: "Open",
    rewardAmount: totalReward || 0,
    rewardAsset: quest.reward?.asset || "USDC",
    postedBy: {
      name:
        quest.createdBy?.displayName ||
        quest.createdBy?.username ||
        "Project owner",
      initials:
        quest.createdBy?.displayName
          ?.split(" ")
          .map((i) => i[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "PO",
    },
  };
}

function buildStats(quests) {
  const totalQuests = quests.length;

  const activeQuests = quests.filter(
    (q) =>
      !["completed", "cancelled", "canceled", "ended"].includes(
        String(q.status || "").toLowerCase(),
      ),
  ).length;

  const totalRewards = quests.reduce(
    (sum, q) => sum + (Number(q.rewardAmount) || 0),
    0,
  );

  const totalApplications = quests.reduce(
    (sum, q) => sum + (Number(q.applicants) || 0),
    0,
  );

  return {
    openQuests: activeQuests,
    totalBudget: totalRewards,
    totalBudgetUsd: totalRewards,
    totalApplicants: totalApplications,
    acceptedApplications: 0,

    totalQuests,
    activeQuests,
    totalRewards,
    totalApplications,

    total: totalQuests,
    open: activeQuests,
    active: activeQuests,
    rewards: totalRewards,
    applications: totalApplications,
    applicants: totalApplications,
    earned: 0,
  };
}

function normalizeStats(stats = {}) {
  const openQuests = Number(stats.openQuests || stats.activeQuests || 0);
  const totalBudget = Number(
    stats.totalBudgetUsd ||
      stats.totalBudget ||
      stats.rewardsAvailableUsd ||
      stats.totalRewards ||
      0,
  );
  const totalApplicants = Number(
    stats.totalApplicants || stats.applicants || stats.totalApplications || 0,
  );
  const acceptedApplications = Number(stats.acceptedApplications || 0);

  return {
    ...DEFAULT_STATS,
    ...stats,
    openQuests,
    totalBudget,
    totalBudgetUsd: totalBudget,
    totalApplicants,
    acceptedApplications,

    totalQuests: Number(stats.totalQuests || stats.total || 0),
    activeQuests: openQuests,
    totalRewards: totalBudget,
    totalApplications: totalApplicants,

    total: Number(stats.totalQuests || stats.total || 0),
    open: openQuests,
    active: openQuests,
    rewards: totalBudget,
    applications: totalApplicants,
    applicants: totalApplicants,
    earned: Number(stats.earned || 0),
  };
}

export default function QuestMarketplace() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [quests, setQuests] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [layout, setLayout] = useState(getSavedLayout);

  const applications = [];

  const applicationQuestIds = useMemo(() => {
    return new Set(
      applications
        .map((application) =>
          String(
            application.questId?._id ||
              application.questId ||
              application.quest?._id ||
              application.quest?.id ||
              application.quest,
          ),
        )
        .filter(Boolean),
    );
  }, [applications]);

  useEffect(() => {
    saveLayout(layout);
  }, [layout]);

  useEffect(() => {
    let isMounted = true;

    async function fetchQuests() {
      try {
        setLoading(true);
        setErrorMessage("");

        const token = accessToken || localStorage.getItem("accessToken");

        const [questsRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/api/twitter-quests`, {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          }),
          fetch(`${API_URL}/api/stats/quests`),
        ]);

        const questsData = await questsRes.json();

        if (!questsRes.ok || !questsData.success) {
          throw new Error(questsData.message || "Failed to fetch quests.");
        }

        const normalized = (questsData.quests || []).map(normalizeQuest);

        let nextStats = buildStats(normalized);

        try {
          const statsData = await statsRes.json();

          if (statsRes.ok && statsData.success) {
            nextStats = normalizeStats(statsData.stats);
          }
        } catch {
          nextStats = buildStats(normalized);
        }

        if (isMounted) {
          setQuests(normalized);
          setStats(nextStats);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Failed to fetch quests.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchQuests();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const filteredQuests = useMemo(() => {
    return quests.filter((quest) => {
      const term = search.trim().toLowerCase();

      const matchesSearch =
        !term ||
        quest.title?.toLowerCase().includes(term) ||
        quest.company?.toLowerCase().includes(term) ||
        quest.category?.toLowerCase().includes(term) ||
        quest.description?.toLowerCase().includes(term) ||
        quest.postedBy?.name?.toLowerCase().includes(term);

      if (!matchesSearch) return false;

      if (activeFilter === "all") return true;

      if (activeFilter === "submitted") {
        return Boolean(quest.hasSubmitted);
      }

      return quest.status === activeFilter;
    });
  }, [quests, search, activeFilter]);

  return (
    <div className="mx-auto w-full space-y-3 px-2 py-2">
      <MarketplaceHero stats={stats} />

      <QuestFilters
        search={search}
        onSearchChange={setSearch}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        layout={layout}
        onLayoutChange={setLayout}
        isLoggedIn={Boolean(accessToken || localStorage.getItem("accessToken"))}
      />

      {loading ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-[#EAECF0] bg-white px-6 py-10 text-center shadow-sm">
          <Loader2 className="mb-4 h-9 w-9 animate-spin text-[#2F0FD1]" />
          <h3 className="text-lg font-semibold text-[#101828]">
            Loading quests
          </h3>
          <p className="mt-2 text-sm text-[#667085]">
            Fetching available quests...
          </p>
        </div>
      ) : errorMessage ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-white px-6 py-10 text-center">
          <BriefcaseBusiness className="mb-4 h-10 w-10 text-[#2F0FD1]" />
          <h3 className="text-lg font-semibold text-[#101828]">
            Could not load quests
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#667085]">
            {errorMessage}
          </p>
        </div>
      ) : filteredQuests.length > 0 ? (
        <section
          className={
            layout === "grid"
              ? "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
              : "flex flex-col gap-2.5"
          }
        >
          {filteredQuests.map((quest) => {
            const questId = quest.id || quest._id;
            const hasApplied =
              applicationQuestIds.has(String(questId)) ||
              Boolean(quest.hasSubmitted);

            const handleOpenQuest = () => {
              navigate(getQuestPath(quest));
            };

            return layout === "grid" ? (
              <QuestCard
                key={questId}
                quest={quest}
                hasApplied={hasApplied}
                onClick={handleOpenQuest}
              />
            ) : (
              <QuestListItem
                key={questId}
                quest={quest}
                hasApplied={hasApplied}
                onClick={handleOpenQuest}
              />
            );
          })}
        </section>
      ) : (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-white px-6 py-10 text-center">
          <BriefcaseBusiness className="mb-4 h-10 w-10 text-[#2F0FD1]" />
          <h3 className="text-lg font-semibold text-[#101828]">
            No quests found
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#667085]">
            Try a different keyword or category.
          </p>
        </div>
      )}
    </div>
  );
}
