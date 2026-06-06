import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  HiOutlineUsers,
  HiOutlineSparkles,
  HiOutlineViewGrid,
  HiOutlineViewList,
} from "react-icons/hi";
import { PiCompassFill } from "react-icons/pi";

import CommunitiesCard from "@/components/CommunitiesCard";
import CustomPagination from "@/components/CustomPagination";
import Filter from "@/components/Filter";
import { Button } from "@/components/ui/button";
import { COMMUNITIES_OVERVIEW } from "@/lib/constants";
import Heading from "@/components/dashboard/Heading";
import MetricsContainer from "@/components/dashboard/MetricsContainer";
import MetricCard from "@/components/dashboard/MetricCard";
import CustomSearch from "@/components/Search";
import Sort from "@/components/Sort";
import CreateCommunityForm from "@/components/CreateCommunityForm";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Empty from "@/components/Empty";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetCommunities,
  useGetMemberCommunities,
} from "@/hooks/useGetCommunities";

const VIEW_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Joined", value: "joined" },
  { label: "Created", value: "created" },
];

const COMMUNITY_LAYOUT_STORAGE_KEY = "contribute_communities_layout";
const COMMUNITY_LAYOUT_OPTIONS = {
  GRID: "grid",
  LIST: "list",
};

function InfoPill({ icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#E8EDF7] bg-[#F8FAFC] px-3 py-2 text-sm text-[#667085]">
      <span className="text-[#2F0FD1]">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function getInitialCommunityLayout() {
  if (typeof window === "undefined") return COMMUNITY_LAYOUT_OPTIONS.GRID;

  const savedLayout = window.localStorage.getItem(COMMUNITY_LAYOUT_STORAGE_KEY);

  if (
    savedLayout === COMMUNITY_LAYOUT_OPTIONS.GRID ||
    savedLayout === COMMUNITY_LAYOUT_OPTIONS.LIST
  ) {
    return savedLayout;
  }

  return COMMUNITY_LAYOUT_OPTIONS.GRID;
}

function Communities() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [sortOrder, setSortOrder] = useState("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [communityView, setCommunityView] = useState("all");
  const [communityOwnerId, setCommunityOwnerId] = useState("");
  const [displayedCommunities, setDisplayedCommunities] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [communityLayout, setCommunityLayout] = useState(
    getInitialCommunityLayout,
  );

  const LIMIT = 10;
  const OFFSET = currentPage;

  const {
    communities,
    loadingCommunities,
    errorLoadingCommunities,
    totalPages: totalCommunityPages,
    refetch,
  } = useGetCommunities(LIMIT, OFFSET, sortOrder, communityOwnerId);

  const {
    memberCommunities,
    loadingMemberCommunities,
    errorLoadingMemberCommunities,
    totalPages: totalMemberCommunitiesPages,
  } = useGetMemberCommunities(LIMIT, OFFSET, communityView);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        COMMUNITY_LAYOUT_STORAGE_KEY,
        communityLayout,
      );
    }
  }, [communityLayout]);

  useEffect(() => {
    if (communityView === "all" || communityView === "created") {
      setDisplayedCommunities(communities || []);
    }
  }, [communities, communityView]);

  useEffect(() => {
    if (communityView === "joined") {
      setDisplayedCommunities(memberCommunities || []);
    }
  }, [memberCommunities, communityView]);

  const filteredCommunities = useMemo(() => {
    const list = displayedCommunities || [];

    if (!searchValue.trim()) return list;

    const term = searchValue.trim().toLowerCase();

    return list.filter((community) => {
      const communityName = String(
        community?.communityName || "",
      ).toLowerCase();
      const description = String(
        community?.communityDescription || "",
      ).toLowerCase();
      const alias = String(community?.communityAlias || "").toLowerCase();

      return (
        communityName.includes(term) ||
        description.includes(term) ||
        alias.includes(term)
      );
    });
  }, [displayedCommunities, searchValue]);

  const totalPages =
    totalMemberCommunitiesPages && communityView === "joined"
      ? totalMemberCommunitiesPages
      : totalCommunityPages;

  const handleChangeCommunityView = (view) => {
    if (!isAuthenticated && (view === "created" || view === "joined")) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setCommunityView(view);
    setCurrentPage(1);

    if (view === "created") {
      setCommunityOwnerId(user?.id || "");
      return;
    }

    if (view === "joined") {
      setCommunityOwnerId("");
      return;
    }

    setCommunityOwnerId("");
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const activeViewLabel =
    VIEW_OPTIONS.find((item) => item.value === communityView)?.label || "All";

  const isGridLayout = communityLayout === COMMUNITY_LAYOUT_OPTIONS.GRID;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-[#EEF2FF] bg-white shadow-sm">
        <div className="border-b border-[#F2F4F7] bg-gradient-to-r from-[#FCFCFD] to-[#F8FAFF] px-5 py-6 lg:px-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="md:hidden">
                <Heading />
              </div>

              <div className="hidden space-y-3 md:block">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1.5 text-sm font-medium text-[#2F0FD1]">
                  <HiOutlineUsers className="text-[16px]" />
                  Communities
                </div>

                <div className="space-y-2">
                  <h2 className="text-[28px] font-semibold tracking-tight text-[#101828]">
                    Discover, join, and manage project communities
                  </h2>
                  <p className="max-w-2xl text-[15px] leading-7 text-[#667085]">
                    Explore communities across the ecosystem, keep track of the
                    ones you joined, and create your own space for contributors
                    and builders.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <InfoPill
                    icon={<PiCompassFill className="h-4 w-4" />}
                    label="Discover active communities"
                  />
                  <InfoPill
                    icon={<HiOutlineSparkles className="h-4 w-4" />}
                    label="Join communities you care about"
                  />
                  <InfoPill
                    icon={<HiOutlineUsers className="h-4 w-4" />}
                    label="Create and manage your own"
                  />
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:flex-col">
              <Button
                onClick={() => navigate("/communities")}
                className="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
              >
                Explore Communities
              </Button>

              <CreateCommunityForm
                triggerLabel="Create Community"
                triggerClassName="h-11 w-full rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
                triggerVariant="default"
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-5 lg:px-6">
          <MetricsContainer>
            {COMMUNITIES_OVERVIEW.map((item, index) => (
              <MetricCard key={index} item={item} />
            ))}
          </MetricsContainer>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#EEF2FF] bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="w-full lg:max-w-[320px]">
                    <CustomSearch
                      placeholder="Search communities"
                      onSearchChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>

                  <div className="inline-flex w-full flex-wrap rounded-xl border border-[#EAECF5] bg-[#F8FAFC] p-1.5 lg:w-auto">
                    {VIEW_OPTIONS.map((option) => {
                      const isActive = communityView === option.value;

                      return (
                        <Button
                          key={option.value}
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            handleChangeCommunityView(option.value)
                          }
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

                <div className="inline-flex w-full rounded-xl border border-[#EAECF5] bg-[#F8FAFC] p-1.5 sm:w-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setCommunityLayout(COMMUNITY_LAYOUT_OPTIONS.GRID)
                    }
                    className={[
                      "h-10 flex-1 rounded-lg px-4 text-sm font-medium transition-all sm:flex-none",
                      "inline-flex items-center justify-center gap-2",
                      "hover:bg-white hover:text-[#2F0FD1]",
                      isGridLayout
                        ? "bg-white text-[#2F0FD1] shadow-sm"
                        : "text-[#667085]",
                    ].join(" ")}
                  >
                    <HiOutlineViewGrid className="h-4 w-4" />
                    Grid
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setCommunityLayout(COMMUNITY_LAYOUT_OPTIONS.LIST)
                    }
                    className={[
                      "h-10 flex-1 rounded-lg px-4 text-sm font-medium transition-all sm:flex-none",
                      "inline-flex items-center justify-center gap-2",
                      "hover:bg-white hover:text-[#2F0FD1]",
                      !isGridLayout
                        ? "bg-white text-[#2F0FD1] shadow-sm"
                        : "text-[#667085]",
                    ].join(" ")}
                  >
                    <HiOutlineViewList className="h-4 w-4" />
                    List
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#F4F7FF] px-3 py-1.5 text-xs font-medium text-[#2F0FD1]">
                  View: {activeViewLabel}
                </span>

                <span className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#667085]">
                  Sort: {sortOrder === "DESC" ? "Newest first" : "Oldest first"}
                </span>

                <span className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#667085]">
                  Layout: {isGridLayout ? "Grid" : "List"}
                </span>

                <span className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#667085]">
                  {filteredCommunities.length} communit
                  {filteredCommunities.length === 1 ? "y" : "ies"} shown
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start">
              <Filter />
              <Sort order={sortOrder} onToggle={handleSort} />
            </div>
          </div>

          {loadingCommunities || loadingMemberCommunities ? (
            <Loader label="Loading communities..." />
          ) : errorLoadingCommunities || errorLoadingMemberCommunities ? (
            <Error
              title="Failed to load communities"
              description="Please refresh the page or try again."
            />
          ) : filteredCommunities.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-[#FCFCFD] px-6 py-10 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F7FF] text-[#2F0FD1]">
                <HiOutlineUsers className="h-8 w-8" />
              </div>

              <div className="max-w-lg space-y-2">
                <h3 className="text-[22px] font-semibold tracking-tight text-[#101828]">
                  No communities found
                </h3>
                <p className="text-sm leading-6 text-[#667085]">
                  Try changing your search, switching views, or create a new
                  community to get started.
                </p>
              </div>

              <div className="mt-5 sm:min-w-[200px]">
                <CreateCommunityForm />
              </div>
            </div>
          ) : (
            <div
              className={
                isGridLayout
                  ? "grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3"
                  : "flex flex-col gap-3"
              }
            >
              {filteredCommunities.map((community) => (
                <CommunitiesCard
                  community={community}
                  key={community?.id}
                  layout={communityLayout}
                />
              ))}
            </div>
          )}

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </div>
  );
}

export default Communities;
