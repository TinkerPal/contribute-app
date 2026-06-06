import { getCommunities, getMemberCommunities } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useGetCommunities = (
  LIMIT,
  OFFSET = 1,
  sortOrder = "DESC",
  communityOwnerId = "",
  searchValue = "",
) => {
  const {
    data: communitiesData,
    isLoading: loadingCommunities,
    isError: errorLoadingCommunities,
    refetch,
  } = useQuery({
    queryKey: [
      "communities",
      LIMIT,
      OFFSET,
      sortOrder,
      communityOwnerId,
      searchValue,
    ],
    queryFn: () =>
      getCommunities({
        limit: LIMIT,
        offset: OFFSET,
        sort: sortOrder,
        communityOwnerId,
        searchValue,
      }),
    keepPreviousData: true,
  });

  const communities = communitiesData?.data ?? [];
  const totalPages = communitiesData?.totalPages ?? 1;

  return {
    communities,
    communitiesData,
    loadingCommunities,
    errorLoadingCommunities,
    totalPages,
    refetch,
  };
};

export const useGetMemberCommunities = (LIMIT, OFFSET = 1, communityView) => {
  const {
    data: memberCommunitiesData,
    isLoading: loadingMemberCommunities,
    isError: errorLoadingMemberCommunities,
  } = useQuery({
    queryKey: ["communities", LIMIT, OFFSET],
    queryFn: () =>
      getMemberCommunities({
        limit: LIMIT,
        offset: OFFSET,
      }),
    enabled: communityView === "joined",
    keepPreviousData: true,
  });

  const memberCommunities = memberCommunitiesData?.data ?? [];
  const totalPages = memberCommunitiesData?.totalPages ?? 1;

  return {
    memberCommunities,
    loadingMemberCommunities,
    errorLoadingMemberCommunities,
    totalPages,
  };
};
