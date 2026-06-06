import { completeTask } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, taskId }) => completeTask(payload, taskId),

    onSuccess: (_, variables) => {
      queryClient.clear();
      // 🔥 THIS is the magic
      //   queryClient.invalidateQueries({
      //     queryKey: ["quests", variables.communityId],
      //   });

      // Optional: update community stats
      //   queryClient.invalidateQueries({
      //     queryKey: ["community", variables.communityId],
      //   });
    },
  });
};
