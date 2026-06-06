import { useFieldArray } from "react-hook-form";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import CustomTextArea from "../CustomTextArea";
import CustomInput from "../CustomInput";
import { FaLink } from "react-icons/fa";

export default function TaskItem({
  taskIndex,
  control,
  register,
  errors,
  removeTask,
  collapsed,
  toggleTask,
  totalTasks,
  rewardMode,
  rewardType,
}) {
  const {
    fields: linkFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `tasks.${taskIndex}.links`,
  });

  return (
    <div className="grid gap-4">
      {/* Task Header */}
      <div className="flex items-center justify-between bg-[#EDF2FF] px-3 py-2">
        <p className="font-semibold text-[#2F0FD1]">
          Task {totalTasks > 1 && taskIndex + 1}
        </p>

        <div className="flex items-center gap-2">
          {totalTasks > 1 && (
            <button
              type="button"
              onClick={() => removeTask(taskIndex)}
              className="rounded bg-white p-2"
            >
              <RiDeleteBin6Fill className="text-red-500" />
            </button>
          )}

          <button
            type="button"
            onClick={() => toggleTask(taskIndex)}
            className="rounded bg-white p-2"
          >
            {collapsed ? <IoChevronDown /> : <IoChevronUp />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Task Description */}
          <CustomTextArea
            label="Task Description"
            placeholder="Briefly describe the task"
            error={errors.tasks?.[taskIndex]?.description?.message}
            {...register(`tasks.${taskIndex}.description`)}
          />

          <div className="flex items-center justify-between gap-2 text-[14px] font-light text-[#09032A]">
            <p>Reference Links</p>
            <p>{linkFields.length}/5</p>
          </div>

          {linkFields.map((link, linkIndex) => (
            <div key={link.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-light text-[#09032A]">
                  Link {linkIndex + 1}
                </p>

                {linkFields.length > 1 && (
                  <button
                    type="button"
                    className="rounded-full bg-[#FCE9E9] p-2"
                    onClick={() => remove(linkIndex)}
                  >
                    <RiDeleteBin6Fill className="m text-red-500" />
                  </button>
                )}
              </div>
              <CustomInput
                placeholder="Link name"
                error={
                  errors.tasks?.[taskIndex]?.links?.[linkIndex]?.name?.message
                }
                {...register(`tasks.${taskIndex}.links.${linkIndex}.name`)}
              />

              <CustomInput
                placeholder="Paste URL"
                prefix="https://"
                error={
                  errors.tasks?.[taskIndex]?.links?.[linkIndex]?.url?.message
                }
                {...register(`tasks.${taskIndex}.links.${linkIndex}.url`)}
              />
            </div>
          ))}

          {linkFields.length < 5 && (
            <button
              type="button"
              onClick={() => append({ name: "", url: "" })}
              className="ml-auto flex cursor-pointer items-center gap-1 text-[14px] font-light text-[#2F0FD1]"
            >
              <FaLink /> Add Another Link
            </button>
          )}

          {/* Task Instruction */}
          <CustomTextArea
            label="Task Instruction"
            placeholder="Kindly Specify the Instructions"
            error={errors.tasks?.[taskIndex]?.instruction?.message}
            {...register(`tasks.${taskIndex}.instruction`)}
          />

          {rewardType === "Token" &&
            rewardMode === "Individual Task Reward" && (
              <CustomInput
                label="How many tokens per task?"
                placeholder="eg 50"
                type="number"
                error={errors.tasks?.[taskIndex]?.tokensPerTask?.message}
                {...register(`tasks.${taskIndex}.tokensPerTask`, {
                  valueAsNumber: true,
                })}
              />
            )}

          {rewardType === "Points" &&
            rewardMode === "Individual Task Reward" && (
              <CustomInput
                label="How many points per task?"
                placeholder="eg 50"
                type="number"
                error={errors.tasks?.[taskIndex]?.pointsPerTask?.message}
                {...register(`tasks.${taskIndex}.pointsPerTask`, {
                  valueAsNumber: true,
                })}
              />
            )}
        </>
      )}
    </div>
  );
}
