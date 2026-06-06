import { useCompleteTask } from "@/hooks/useCompleteTask";
import { TaskSubmissionSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomInput from "../CustomInput";
import { IoIosRefresh } from "react-icons/io";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function TaskSubmissionForm({ task }) {
  const { mutateAsync: completeTask } = useCompleteTask();
  const { requireAuth } = useRequireAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(TaskSubmissionSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    if (!requireAuth()) return;

    await completeTask({
      taskId: task.id,
      payload: { submission: data.submission },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <CustomInput
        placeholder="Paste URL Here"
        {...register("submission")}
        handleClickIcon={handleSubmit(onSubmit)}
        icon={<IoIosRefresh className="text-[20px] text-[#2F0FD1]" />}
      />

      {errors.submission && (
        <p className="mt-1 text-xs text-red-500">{errors.submission.message}</p>
      )}
    </form>
  );
}
