import { Fragment, useMemo, useState } from "react";
import { FaGlobe, FaLink } from "react-icons/fa6";
import { RiTwitterXFill, RiInstagramFill } from "react-icons/ri";
import { LuGithub } from "react-icons/lu";
import { HiOutlineUsers, HiOutlineSparkles } from "react-icons/hi";
import { ImSpinner5 } from "react-icons/im";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Coins,
  ShieldCheck,
} from "lucide-react";

import BackButton from "@/components/BackButton";
import TasksCard from "@/components/TasksCard";
import NewQuest from "@/components/dashboard/NewQuest";
import QuestSuccess from "@/components/dashboard/QuestSuccess";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import { Button } from "@/components/ui/button";
import CustomSearch from "@/components/Search";
import Filter from "@/components/Filter";
import Sort from "@/components/Sort";
import CustomPagination from "@/components/CustomPagination";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCommunity,
  getQuestsByCommunity,
  joinCommunity,
  leaveCommunity,
} from "@/services";
import { useNavigate, useLocation, useParams } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";

function CommunityStatCard({ label, value, icon, accent = "blue" }) {
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

function SocialLink({ title, url }) {
  if (!url) return null;

  const normalizedTitle = String(title || "").toLowerCase();

  const iconMap = {
    website: <FaGlobe className="text-[18px]" />,
    github: <LuGithub className="text-[18px]" />,
    twitter: <RiTwitterXFill className="text-[18px]" />,
    instagram: <RiInstagramFill className="text-[18px]" />,
  };

  const icon = iconMap[normalizedTitle] || <FaLink className="text-[18px]" />;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E4E7EC] bg-white text-[#667085] shadow-sm transition hover:border-[#D0D5DD] hover:bg-[#F8FAFC] hover:text-[#2F0FD1]"
      aria-label={title}
    >
      {icon}
    </a>
  );
}

const DETAIL_VIEWS = [
  { label: "Tasks", value: "tasks" },
  { label: "Forum", value: "forum" },
  { label: "Leader Board", value: "leader-board" },
];

function CommunityDetailsPage() {
  const [sortOrder, setSortOrder] = useState("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [openQuestSuccess, setOpenQuestSuccess] = useState(false);
  const [detailView, setDetailView] = useState("tasks");
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { communityAlias: communityId } = useParams();
  const { user, isAuthenticated } = useAuth();

  const {
    data: community,
    isLoading: loadingCommunity,
    isError: errorLoadingCommunity,
  } = useQuery({
    queryKey: ["community", communityId],
    queryFn: () => getCommunity(communityId),
    enabled: !!communityId,
  });

  const LIMIT = 10;
  const questOffset = (currentPage - 1) * LIMIT;

  const {
    data: questData,
    isLoading: loadingQuests,
    isError: errorLoadingQuests,
  } = useQuery({
    queryKey: ["quests", community?.id, LIMIT, currentPage, sortOrder],
    queryFn: () =>
      getQuestsByCommunity({
        limit: LIMIT,
        offset: questOffset,
        communityId: community.id,
        sortOrder,
      }),
    enabled: !!community?.id,
  });

  const quests = questData?.data ?? [];
  const questTotalPages = questData?.totalPages ?? 1;

  const filteredQuests = useMemo(() => {
    if (!searchValue.trim()) return quests;

    const term = searchValue.trim().toLowerCase();

    return quests.filter((quest) => {
      const title = String(
        quest?.title || quest?.questTitle || "",
      ).toLowerCase();
      const category = String(quest?.category || "").toLowerCase();
      return title.includes(term) || category.includes(term);
    });
  }, [quests, searchValue]);

  const isOwner = user?.id === community?.communityOwnerId;
  const totalMembers = community?.totalMembers ?? 0;
  const totalTasks = community?.totalTasks ?? 0;
  const totalSpent = community?.totalSpent ?? 0;
  const communityLinks = community?.communityLinks ?? [];

  const stats = [
    {
      key: "members",
      label: "Members",
      value: totalMembers,
      icon: <HiOutlineUsers className="text-[18px]" />,
      accent: "blue",
    },
    {
      key: "tasks",
      label: "Total Tasks",
      value: totalTasks,
      icon: <BriefcaseBusiness className="h-[18px] w-[18px]" />,
      accent: "purple",
    },
    {
      key: "spent",
      label: "Tokens Spent",
      value: totalSpent,
      icon: <Coins className="h-[18px] w-[18px]" />,
      accent: "green",
    },
    {
      key: "status",
      label: "Status",
      value: community?.isMember ? "Joined" : isOwner ? "Owner" : "Open",
      icon: <HiOutlineSparkles className="text-[18px]" />,
      accent: "orange",
    },
  ];

  const { mutate: joinCommunityMutation, isPending: joinCommunityPending } =
    useMutation({
      mutationFn: () => joinCommunity(community.id),
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: ["community", communityId],
        });

        const previousCommunity = queryClient.getQueryData([
          "community",
          communityId,
        ]);

        queryClient.setQueryData(["community", communityId], (old) => ({
          ...(old || {}),
          isMember: true,
          totalMembers: (old?.totalMembers ?? 0) + 1,
        }));

        return { previousCommunity };
      },
      onError: (error, _, context) => {
        queryClient.setQueryData(
          ["community", communityId],
          context?.previousCommunity,
        );
        toast.error(
          error?.response?.data?.message || "Failed to join community",
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["community", communityId] });
      },
      onSuccess: (data) => {
        if (data?.status === 201) {
          toast.success("Community joined successfully");
        } else {
          toast.error("Something went wrong");
        }
      },
    });

  const { mutate: leaveCommunityMutation, isPending: leaveCommunityPending } =
    useMutation({
      mutationFn: () => leaveCommunity(community.id, user?.id),
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: ["community", communityId],
        });

        const previousCommunity = queryClient.getQueryData([
          "community",
          communityId,
        ]);

        queryClient.setQueryData(["community", communityId], (old) => ({
          ...(old || {}),
          isMember: false,
          totalMembers: Math.max((old?.totalMembers ?? 1) - 1, 0),
        }));

        return { previousCommunity };
      },
      onError: (error, _, context) => {
        queryClient.setQueryData(
          ["community", communityId],
          context?.previousCommunity,
        );
        toast.error(
          error?.response?.data?.message || "Failed to leave community",
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["community", communityId] });
      },
      onSuccess: (data) => {
        if (data?.status === 201) {
          toast.success("Successfully left the community");
        } else {
          toast.error("Something went wrong");
        }
      },
    });

  const handleJoinCommunity = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    joinCommunityMutation();
  };

  const handleLeaveCommunity = () => {
    leaveCommunityMutation();
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <QuestSuccess
        openQuestSuccess={openQuestSuccess}
        setOpenQuestSuccess={setOpenQuestSuccess}
      />

      <div className="md:hidden">
        <BackButton />
      </div>

      {loadingCommunity ? (
        <Loader label="Loading community details..." />
      ) : errorLoadingCommunity ? (
        <Error
          title="Failed to load community details"
          description="Please refresh the page or try again."
        />
      ) : !community ? (
        <Error title="Community not found" />
      ) : (
        <>
          <section className="overflow-hidden rounded-[28px] border border-[#EEF2FF] bg-white shadow-sm">
            <div
              className={[
                "relative h-[220px] bg-cover bg-center bg-no-repeat md:h-[260px]",
                community?.coverImageUrl
                  ? ""
                  : "bg-[linear-gradient(135deg,#F7F9FF_0%,#EEF2FF_100%)]",
              ].join(" ")}
              style={
                community?.coverImageUrl
                  ? { backgroundImage: `url(${community.coverImageUrl})` }
                  : undefined
              }
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,2,21,0.04)_0%,rgba(5,2,21,0.28)_100%)]" />

              <div className="absolute top-full left-1/2 z-10 h-[112px] w-[112px] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-white p-2 shadow-lg md:left-8 md:h-[132px] md:w-[132px] md:translate-x-0">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#F4F7FF]">
                  {community?.logoUrl ? (
                    <img
                      src={community.logoUrl}
                      alt={community?.communityName || "Community logo"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src="/ChartPolar (1).svg"
                      alt=""
                      className="h-12 w-12"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="px-5 pt-16 pb-6 md:px-6 md:pt-20">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center rounded-full bg-[#EEF2FF] px-3 py-1 text-sm font-medium text-[#2F0FD1]">
                      Community
                    </div>

                    {isOwner ? (
                      <div className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF3] px-3 py-1 text-sm font-medium text-[#027A48]">
                        <ShieldCheck className="h-4 w-4" />
                        Owner
                      </div>
                    ) : community?.isMember ? (
                      <div className="inline-flex items-center rounded-full bg-[#F4F7FF] px-3 py-1 text-sm font-medium text-[#2F0FD1]">
                        Joined
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-[26px] font-semibold tracking-tight text-[#101828] md:text-[30px]">
                      {community?.communityName || "Untitled Community"}
                    </h1>

                    <p className="max-w-3xl text-[15px] leading-7 text-[#667085]">
                      {community?.communityDescription ||
                        "No community description provided yet."}
                    </p>
                  </div>

                  {communityLinks.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {communityLinks.map((link, i) => (
                        <SocialLink
                          key={`${link?.title}-${i}`}
                          title={link?.title}
                          url={link?.url}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                  {isOwner ? (
                    <>
                      <Button
                        variant="outline"
                        className="h-11 rounded-xl border-[#D0D5DD] bg-white px-6 text-sm font-medium text-[#344054] hover:bg-[#F9FAFB]"
                      >
                        Edit Details
                      </Button>

                      <NewQuest
                        sheetIsOpen={sheetIsOpen}
                        setSheetIsOpen={setSheetIsOpen}
                        setOpenQuestSuccess={setOpenQuestSuccess}
                        communityId={community.id}
                        triggerClassName="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
                      />
                    </>
                  ) : (
                    <Button
                      onClick={
                        community?.isMember
                          ? handleLeaveCommunity
                          : handleJoinCommunity
                      }
                      disabled={joinCommunityPending || leaveCommunityPending}
                      className={[
                        "h-11 rounded-xl px-6 text-sm font-medium",
                        community?.isMember
                          ? "bg-[#FEF3F2] text-[#B42318] hover:bg-[#FEE4E2]"
                          : "bg-[#2F0FD1] text-white hover:bg-[#2409B8]",
                      ].join(" ")}
                    >
                      {joinCommunityPending || leaveCommunityPending ? (
                        <ImSpinner5 className="animate-spin" />
                      ) : community?.isMember ? (
                        "Leave Community"
                      ) : (
                        "Join Community"
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                  <CommunityStatCard
                    key={item.key}
                    label={item.label}
                    value={item.value}
                    icon={item.icon}
                    accent={item.accent}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#EEF2FF] bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="w-full lg:max-w-[320px]">
                      <CustomSearch
                        placeholder="Search quests"
                        onSearchChange={(e) => setSearchValue(e.target.value)}
                      />
                    </div>

                    <div className="inline-flex w-full flex-wrap rounded-xl border border-[#EAECF5] bg-[#F8FAFC] p-1.5 lg:w-auto">
                      {DETAIL_VIEWS.map((option) => {
                        const isActive = detailView === option.value;

                        return (
                          <Button
                            key={option.value}
                            type="button"
                            variant="ghost"
                            onClick={() => setDetailView(option.value)}
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
                      {DETAIL_VIEWS.find((v) => v.value === detailView)?.label}
                    </span>

                    {detailView === "tasks" ? (
                      <span className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#667085]">
                        {filteredQuests.length} quest
                        {filteredQuests.length === 1 ? "" : "s"} shown
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start">
                  <Filter />
                  <Sort order={sortOrder} onToggle={handleSort} />
                </div>
              </div>

              {detailView !== "tasks" ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-[#FCFCFD] px-6 py-10 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F7FF] text-[#2F0FD1]">
                    <HiOutlineSparkles className="h-8 w-8" />
                  </div>

                  <div className="max-w-lg space-y-2">
                    <h3 className="text-[22px] font-semibold tracking-tight text-[#101828]">
                      {detailView === "forum"
                        ? "Forum coming soon"
                        : "Leader board coming soon"}
                    </h3>
                    <p className="text-sm leading-6 text-[#667085]">
                      This section is not available yet, but it can be added
                      with the same design system as the tasks tab.
                    </p>
                  </div>
                </div>
              ) : loadingQuests ? (
                <Loader label="Loading quests..." />
              ) : errorLoadingQuests ? (
                <Error
                  title="Failed to load quests"
                  description="Please refresh the page or try again."
                />
              ) : filteredQuests.length === 0 ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-[#FCFCFD] px-6 py-10 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F7FF] text-[#2F0FD1]">
                    <BriefcaseBusiness className="h-8 w-8" />
                  </div>

                  <div className="max-w-lg space-y-2">
                    <h3 className="text-[22px] font-semibold tracking-tight text-[#101828]">
                      No quests found
                    </h3>
                    <p className="text-sm leading-6 text-[#667085]">
                      {isOwner
                        ? "Create the first quest for this community to start engaging contributors."
                        : "There are no quests available in this community right now."}
                    </p>
                  </div>

                  {isOwner ? (
                    <div className="mt-5">
                      <NewQuest
                        sheetIsOpen={sheetIsOpen}
                        setSheetIsOpen={setSheetIsOpen}
                        setOpenQuestSuccess={setOpenQuestSuccess}
                        communityId={community.id}
                        triggerClassName="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
                      />
                    </div>
                  ) : null}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
                    {filteredQuests.map((quest) => (
                      <TasksCard task={quest} key={quest?.id} tag="task-page" />
                    ))}
                  </div>

                  <CustomPagination
                    currentPage={currentPage}
                    totalPages={questTotalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default CommunityDetailsPage;
