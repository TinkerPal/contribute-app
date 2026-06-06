import {
  createGrowthQuest,
  createOnChainQuest,
  createTechnicalQuest,
  loadContractSpec,
} from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateGrowthQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, communityId }) =>
      createGrowthQuest(payload, communityId),

    onSuccess: (_, variables) => {
      queryClient.clear();
      // 🔥 THIS is the magic
      queryClient.invalidateQueries({
        queryKey: ["quests", variables.communityId],
      });

      // Optional: update community stats
      queryClient.invalidateQueries({
        queryKey: ["community", variables.communityId],
      });
    },
  });
};

export const useCreateOnChainQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, communityId }) =>
      createOnChainQuest(payload, communityId),

    onSuccess: (_, variables) => {
      queryClient.clear();
      // 🔥 THIS is the magic
      queryClient.invalidateQueries({
        queryKey: ["quests", variables.communityId],
      });

      // Optional: update community stats
      queryClient.invalidateQueries({
        queryKey: ["community", variables.communityId],
      });
    },
  });
};

export const useLoadContractSpec = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload }) => loadContractSpec(payload),

    onSuccess: (_, variables) => {
      queryClient.clear();
      // 🔥 THIS is the magic
      queryClient.invalidateQueries({
        queryKey: ["quests", variables.communityId],
      });

      // Optional: update community stats
      queryClient.invalidateQueries({
        queryKey: ["community", variables.communityId],
      });
    },
  });
};

export const useCreateTechnicalQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, communityId }) =>
      createTechnicalQuest(payload, communityId),

    onSuccess: (_, variables) => {
      queryClient.clear();
      // 🔥 THIS is the magic
      queryClient.invalidateQueries({
        queryKey: ["quests", variables.communityId],
      });

      // Optional: update community stats
      queryClient.invalidateQueries({
        queryKey: ["community", variables.communityId],
      });
    },
  });
};
