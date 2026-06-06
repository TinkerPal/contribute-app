import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getCommunity, joinCommunity, leaveCommunity } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImSpinner5 } from "react-icons/im";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Coins,
  Users,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function CommunitiesCard({ community, layout = "grid" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  const communityId = community?.id;
  const communityAlias = community?.communityAlias;

  const handleOpen = () => {
    if (!communityAlias) return;

    navigate(`/communities/${encodeURIComponent(communityAlias)}`, {
      replace: false,
    });
  };

  const handleCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  };

  const { data: communityDetails } = useQuery({
    queryKey: ["community", communityId],
    queryFn: () => getCommunity(communityId),
    enabled: isAuthenticated && !!communityId,
    keepPreviousData: true,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  const isOwner = community?.communityOwnerId === user?.id;

  const memberCount = useMemo(() => {
    return (
      communityDetails?.totalMembers ??
      communityDetails?.members ??
      community?.members ??
      0
    );
  }, [communityDetails, community?.members]);

  const isMember = Boolean(communityDetails?.isMember);
  const newTasksCount = community?.newTasks ?? 0;
  const totalSpent = community?.totalSpent ?? 0;
  const communityName = community?.communityName || "Untitled Community";
  const communityDescription =
    community?.communityDescription || "No description provided yet.";

  const { mutate: joinCommunityMutation, isPending: joinCommunityPending } =
    useMutation({
      mutationFn: () => joinCommunity(communityId),
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
          totalMembers:
            (old?.totalMembers ?? old?.members ?? community?.members ?? 0) + 1,
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
      onSuccess: (response) => {
        if (response?.status === 201) {
          toast.success("Community joined successfully");
        } else {
          toast.error("Something went wrong");
        }
      },
    });

  const { mutate: leaveCommunityMutation, isPending: leaveCommunityPending } =
    useMutation({
      mutationFn: () => leaveCommunity(communityId, user?.id),
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
          totalMembers: Math.max(
            (old?.totalMembers ?? old?.members ?? community?.members ?? 1) - 1,
            0,
          ),
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
      onSuccess: (response) => {
        if (response?.status === 201) {
          toast.success("Successfully left the community");
        } else {
          toast.error("Something went wrong");
        }
      },
    });

  const handleJoinCommunity = (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!communityId) return;
    joinCommunityMutation();
  };

  const handleLeaveCommunity = (e) => {
    e.stopPropagation();

    if (!communityId) return;
    leaveCommunityMutation();
  };

  const isPending = joinCommunityPending || leaveCommunityPending;

  if (layout === "list") {
    return (
      <article
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={handleCardKeyDown}
        className="group cursor-pointer rounded-[20px] border border-[#E6EAF5] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-200 hover:border-[#DCE4F5] hover:shadow-[0_8px_20px_rgba(16,24,40,0.08)] focus:ring-2 focus:ring-[#D9E2FF] focus:outline-none"
      >
        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EEF2FF] text-[#2F0FD1] shadow-sm ring-1 ring-[#E0E7FF]">
              {community?.logoUrl ? (
                <img
                  src={community.logoUrl}
                  alt={`${communityName} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img src="/ChartPolar.svg" alt="" className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-[15px] font-semibold text-[#101828] md:text-[16px]">
                  {communityName}
                </h3>

                {isOwner ? (
                  <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#ECFDF3] px-2.5 py-1 text-[11px] font-medium text-[#027A48]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Owner
                  </div>
                ) : (
                  <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#F4F7FF] px-2.5 py-1 text-[11px] font-medium text-[#667085]">
                    <Sparkles className="h-3.5 w-3.5 text-[#2F0FD1]" />
                    Community
                  </div>
                )}
              </div>

              <p className="mt-1 line-clamp-1 text-sm text-[#667085]">
                {communityDescription}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#667085]">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F7FF] px-2.5 py-1 font-medium text-[#2F0FD1]">
                  <Users className="h-3.5 w-3.5" />
                  {memberCount === 1 ? "1 member" : `${memberCount} members`}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-[#F8FAFC] px-2.5 py-1 font-medium text-[#344054]">
                  <BriefcaseBusiness className="h-3.5 w-3.5 text-[#2F0FD1]" />
                  {newTasksCount} task{newTasksCount === 1 ? "" : "s"}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-[#F8FAFC] px-2.5 py-1 font-medium text-[#344054]">
                  <Coins className="h-3.5 w-3.5 text-[#2F0FD1]" />
                  {totalSpent} spent
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-[#F2F4F7] pt-3 xl:min-w-[260px] xl:justify-end xl:border-t-0 xl:pt-0">
            <div className="inline-flex items-center gap-1 text-sm font-medium text-[#2F0FD1]">
              <span>View community</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            {!isOwner ? (
              <button
                type="button"
                disabled={isPending}
                onClick={isMember ? handleLeaveCommunity : handleJoinCommunity}
                className={[
                  "inline-flex min-w-[82px] items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium transition",
                  isMember
                    ? "bg-[#FEF3F2] text-[#B42318] hover:bg-[#FEE4E2]"
                    : "bg-[#EEF2FF] text-[#2F0FD1] hover:bg-[#E0E7FF]",
                  isPending ? "cursor-not-allowed opacity-70" : "",
                ].join(" ")}
              >
                {isPending ? (
                  <ImSpinner5 className="animate-spin" />
                ) : isMember ? (
                  "Leave"
                ) : (
                  "Join"
                )}
              </button>
            ) : (
              <div className="text-xs font-medium text-[#98A2B3]">Managing</div>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleCardKeyDown}
      className="group flex min-h-[300px] cursor-pointer flex-col justify-between rounded-[24px] border border-[#E6EAF5] bg-gradient-to-br from-white to-[#FBFCFF] p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-[#DCE4F5] hover:shadow-[0_12px_24px_rgba(16,24,40,0.08)] focus:ring-2 focus:ring-[#D9E2FF] focus:outline-none"
    >
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#EEF2FF] text-[#2F0FD1] shadow-sm ring-1 ring-[#E0E7FF]">
              {community?.logoUrl ? (
                <img
                  src={community.logoUrl}
                  alt={`${communityName} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img src="/ChartPolar.svg" alt="" className="h-6 w-6" />
              )}
            </div>

            <div className="min-w-0 space-y-1.5">
              <h3 className="truncate text-[17px] leading-6 font-semibold text-[#101828]">
                {communityName}
              </h3>

              <div className="inline-flex items-center gap-2 rounded-full bg-[#F4F7FF] px-3 py-1 text-sm font-medium text-[#2F0FD1]">
                <Users className="h-4 w-4" />
                <span>
                  {memberCount === 1 ? "1 member" : `${memberCount} members`}
                </span>
              </div>
            </div>
          </div>

          {isOwner ? (
            <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#ECFDF3] px-3 py-1 text-xs font-medium text-[#027A48]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Owner
            </div>
          ) : (
            <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#F4F7FF] px-3 py-1 text-xs font-medium text-[#667085]">
              <Sparkles className="h-3.5 w-3.5 text-[#2F0FD1]" />
              Community
            </div>
          )}
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-[#667085]">
          {communityDescription}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[18px] border border-[#EEF2FF] bg-[#F8FAFC] p-3">
            <div className="mb-1 flex items-center gap-2 text-[#2F0FD1]">
              <BriefcaseBusiness className="h-4 w-4" />
              <span className="text-[11px] font-medium tracking-[0.08em] text-[#98A2B3] uppercase">
                New Tasks
              </span>
            </div>
            <p className="text-sm font-semibold text-[#101828]">
              {newTasksCount} task{newTasksCount === 1 ? "" : "s"}
            </p>
          </div>

          <div className="rounded-[18px] border border-[#EEF2FF] bg-[#F8FAFC] p-3">
            <div className="mb-1 flex items-center gap-2 text-[#2F0FD1]">
              <Coins className="h-4 w-4" />
              <span className="text-[11px] font-medium tracking-[0.08em] text-[#98A2B3] uppercase">
                Tokens Spent
              </span>
            </div>
            <p className="text-sm font-semibold text-[#101828]">{totalSpent}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#F2F4F7] pt-4">
        <div className="inline-flex items-center gap-1 text-sm font-medium text-[#2F0FD1]">
          <span>View community</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        {!isOwner ? (
          <button
            type="button"
            disabled={isPending}
            onClick={isMember ? handleLeaveCommunity : handleJoinCommunity}
            className={[
              "inline-flex min-w-[82px] items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium transition",
              isMember
                ? "bg-[#FEF3F2] text-[#B42318] hover:bg-[#FEE4E2]"
                : "bg-[#EEF2FF] text-[#2F0FD1] hover:bg-[#E0E7FF]",
              isPending ? "cursor-not-allowed opacity-70" : "",
            ].join(" ")}
          >
            {isPending ? (
              <ImSpinner5 className="animate-spin" />
            ) : isMember ? (
              "Leave"
            ) : (
              "Join"
            )}
          </button>
        ) : (
          <div className="text-xs font-medium text-[#98A2B3]">Managing</div>
        )}
      </div>
    </article>
  );
}

export default CommunitiesCard;
