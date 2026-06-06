import { getBursts } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useGetBursts = (
  LIMIT = 10,
  OFFSET = 1,
  sortOrder = "DESC",
  filter = "all",
) => {
  const {
    data: burstsData,
    isLoading: loadingBursts,
    isError: errorLoadingBursts,
    refetch,
  } = useQuery({
    queryKey: ["bursts", LIMIT, OFFSET, sortOrder, filter],
    queryFn: () =>
      getBursts({
        limit: LIMIT,
        offset: OFFSET,
        sort: sortOrder,
        filter,
      }),
    keepPreviousData: true,
  });

  const bursts = burstsData?.data?.content ?? [];
  const totalPages = burstsData?.data?.content?.totalPages ?? 1;

  return {
    bursts,
    burstsData,
    loadingBursts,
    errorLoadingBursts,
    totalPages,
    refetch,
  };
};
