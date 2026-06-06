import { getQuests } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useGetQuest = (LIMIT) => {
  const {
    data: questsData,
    isLoading: loadingQuests,
    isError: errorLoadingQuests,
  } = useQuery({
    queryKey: ["quests", LIMIT],
    queryFn: () => getQuests({ limit: LIMIT }),
    keepPreviousData: true,
  });

  const quests = questsData?.data ?? [];

  return {
    quests,
    loadingQuests,
    errorLoadingQuests,
  };
};
