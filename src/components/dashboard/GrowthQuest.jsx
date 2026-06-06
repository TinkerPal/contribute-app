import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { IoIosArrowForward } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { CreateGrowthQuestSchema } from "@/schemas";
import CustomInput from "../CustomInput";
import CustomSelect from "../CustomSelect";
import { Checkbox, Field, Label, Radio, RadioGroup } from "@headlessui/react";
import CustomDateSelect from "../CustomDateSelect";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Fragment, useEffect, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import {
  getItemFromLocalStorage,
  removeItemFromLocalStorage,
  setItemInLocalStorage,
} from "@/lib/utils";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  formatDateToYYYYMMDD,
  hydrateQuestData,
  mapFormToCreateGrowthQuestPayload,
} from "@/utils";
import {
  REWARD_MODES,
  REWARD_TYPES,
  TASK_PREVIEW_CONFIG,
  TASK_TYPES,
  WINNER_SELECTION_METHOD,
} from "@/utils/constants";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { useCreateGrowthQuest } from "@/hooks/useCreateQuest";
import TokenSelectorModal from "./TokenSelectorModal";
import { RxCaretDown } from "react-icons/rx";
import { useRequireAuth } from "@/hooks/useRequireAuth";

function GrowthQuest({ setSheetIsOpen, setOpenQuestSuccess, communityId }) {
  const { requireAuth } = useRequireAuth();
  const isDesktop = useIsDesktop();
  const [open, setOpen] = useState(false);
  const side = isDesktop ? "right" : "bottom";
  const [collapsedTasks, setCollapsedTasks] = useState({});
  const [openTokenSelectorModal, setOpenTokenSelectorModal] = useState(false);
  const [rewardToken, setRewardToken] = useState(
    getItemFromLocalStorage("rewardToken") || null,
  );
  const [step, setStep] = useState(
    getItemFromLocalStorage("growthQuestStep") || 1,
  );
  const [step1Data, setStep1Data] = useState(() => {
    const stored = getItemFromLocalStorage("growthQuestStep1Data");
    return stored ? hydrateQuestData(stored) : null;
  });

  const toggleTask = (index) => {
    setCollapsedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleChangeToken = () => {
    setOpenTokenSelectorModal(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(CreateGrowthQuestSchema),
    defaultValues: step1Data ?? {
      questTitle: "",
      questDescription: "",
      rewardType: "Points",
      tokenContract: "",
      symbol: "",
      numberOfWinners: "",
      winnerSelectionMethod: "Random",
      makeConcurrent: false,
      rewardAllWithPoints: step1Data?.rewardAllWithPoints || false,
      startDate: new Date(),
      endDate: "",
      rewardMode: "Overall Reward",
      pointsPerWinner: step1Data?.pointsPerTask || "",
      extraPoints: step1Data?.extraPoints || "",
      tokensPerWinner: step1Data?.tokensPerWinner || "",
      tasks: [
        {
          type: "",
        },
      ],
    },
  });

  console.log({ errors });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  const onSubmit = (data) => {
    setItemInLocalStorage("growthQuestStep1Data", {
      ...data,
      tokenContract: rewardToken?.contract,
      symbol: rewardToken?.code,
    });
    setStep(2);
    setStep1Data({
      ...data,
      tokenContract: rewardToken?.contract,
      symbol: rewardToken?.code,
    });
    setItemInLocalStorage("growthQuestStep", 2);
    setItemInLocalStorage("rewardToken", rewardToken);
  };

  const rewardType = watch("rewardType");
  const rewardMode = watch("rewardMode");
  const runContinuously = watch("runContinuously");
  const rewardAllWithPoints = watch("rewardAllWithPoints");
  const extraPoints = watch("extraPoints");
  const tasks = watch("tasks");
  const tasksLength = tasks.length;

  useEffect(() => {
    if (runContinuously === true) {
      setValue("endDate", "");
    }
  }, [runContinuously, setValue]);

  useEffect(() => {
    if (rewardType === "Points") {
      setValue("numberOfWinners", "");
      setValue("winnerSelectionMethod", "");
      setValue("rewardAllWithPoints", false);
      setValue("extraPoints", "");
      setRewardToken(null);
    } else {
      setValue("winnerSelectionMethod", "Random");
    }
  }, [rewardType, setValue]);

  useEffect(() => {
    if (step !== 2 || !step1Data) return;

    setStep1Data((prev) => {
      const updated = {
        ...prev,
        rewardAllWithPoints,
        extraPoints,
      };

      setItemInLocalStorage("growthQuestStep1Data", updated);

      return updated;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardAllWithPoints, extraPoints]);

  useEffect(() => {
    if (rewardType === "Points") {
      setValue("tokenContract", "");
      setValue("tokensPerWinner", "");
    } else {
      setValue("pointsPerWinner", "");
    }
  }, [rewardType, setValue]);

  useEffect(() => {
    if (rewardMode === "Individual Task Reward") {
      setValue("pointsPerWinner", "");
      setValue("tokensPerWinner", "");
      if (rewardType === "Points") {
        for (let i = 0; i < tasksLength; i++) {
          setValue(`tasks.${i}.tokensPerTask`, "");
        }
      } else {
        for (let i = 0; i < tasksLength; i++) {
          setValue(`tasks.${i}.pointsPerTask`, "");
        }
      }
    } else {
      for (let i = 0; i < tasksLength; i++) {
        setValue(`tasks.${i}.pointsPerTask`, "");
        setValue(`tasks.${i}.tokensPerTask`, "");
      }
    }
  }, [rewardMode, setValue, tasksLength, rewardType]);

  useEffect(() => {
    if (step1Data) {
      if (step1Data?.rewardAllWithPoints && !step1Data?.extraPoints) {
        setStep1Data((prev) => {
          const updated = {
            ...prev,
            rewardAllWithPoints: false,
            extraPoints: "",
          };

          setItemInLocalStorage("growthQuestStep1Data", updated);

          return updated;
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: createQuest } = useCreateGrowthQuest();

  const handlePublishQuest = async () => {
    if (!requireAuth()) return;

    try {
      const payload = JSON.parse(
        JSON.stringify(mapFormToCreateGrowthQuestPayload(step1Data)),
      );

      setIsSubmitting(true);
      // await createGrowthQuest(payload, communityId);
      await createQuest({
        payload,
        communityId,
      });

      setIsSubmitting(false);

      setSheetIsOpen(false);
      setOpenQuestSuccess(true);

      removeItemFromLocalStorage("growthQuestStep");
      removeItemFromLocalStorage("growthQuestStep1Data");
      removeItemFromLocalStorage("rewardToken");
    } catch (error) {
      console.error("Failed to create growth quest", error);
      setIsSubmitting(false);
      // TODO: toast / error UI
    }
  };

  useEffect(() => {
    setValue(
      "tokenContract",
      rewardToken?.contract
        ? `Contract: ${rewardToken.contract.slice(0, 10)}...${rewardToken.contract.slice(-8)}`
        : rewardToken?.issuer
          ? `Issuer: ${rewardToken.issuer.slice(0, 10)}...${rewardToken.issuer.slice(-8)}`
          : "",
    );
  }, [rewardToken, setValue]);

  console.log({ rewardToken });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="flex cursor-pointer items-center justify-between gap-4 rounded-md bg-[#F7F9FD] p-5 hover:bg-[#F7F9FF]/70">
          <div className="space-y-2">
            <p className="text-left text-[18px] font-semibold text-[#09032A]">
              Growth Quest
            </p>

            <p className="text-[#525866]">
              Social media engagement and community growth tasks.
            </p>
          </div>

          <IoIosArrowForward className="text-[#2F0FD1]" />
        </div>
      </SheetTrigger>
      <SheetContent
        side={side}
        className={`bg-white ${side === "bottom" ? "h-[80%]" : "sm:max-w-xl"} overflow-scroll`}
      >
        <SheetHeader className="bg-white px-4 shadow">
          {step === 2 || step === 3 ? (
            <>
              {step === 2 && (
                <FaArrowLeftLong
                  className="cursor-pointer text-3xl text-[#050215]"
                  onClick={() => {
                    if (step === 2) {
                      setItemInLocalStorage("growthQuestStep", 1);
                      if (!extraPoints) {
                        setValue("rewardAllWithPoints", false);
                      }
                    } else {
                      setItemInLocalStorage("growthQuestStep", 2);
                    }
                    setStep((prev) => prev - 1);
                  }}
                />
              )}

              <SheetTitle className="text-[28px] font-bold text-[#09032A]">
                Quest Preview
              </SheetTitle>
              <SheetDescription className="font-[300] text-[#525866]">
                Summary of the quest created
              </SheetDescription>
            </>
          ) : (
            <>
              <SheetTitle className="text-[28px] font-bold text-[#09032A]">
                Growth Quest
              </SheetTitle>
              <SheetDescription className="font-[300] text-[#525866]">
                Boost visibility and engagement across social media
              </SheetDescription>
            </>
          )}
        </SheetHeader>

        {step === 1 ? (
          <>
            <form
              className="relative grid gap-5 px-4 py-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <CustomInput
                label="Quest Title"
                placeholder="Enter Title"
                type="text"
                error={errors.questTitle?.message}
                {...register("questTitle")}
              />

              <CustomInput
                label="Quest Description"
                placeholder="Enter Description"
                type="text"
                error={errors.questDescription?.message}
                {...register("questDescription")}
              />

              <Controller
                name="rewardType"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label="Reward Type"
                    options={REWARD_TYPES}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.rewardType?.message}
                  />
                )}
              />

              {/* <CustomSelect
                label="Reward Type"
                placeholder="Select"
                options={REWARD_TYPES}
                error={errors.rewardType?.message}
                register={register("rewardType")}
              /> */}

              <TokenSelectorModal
                openTokenSelectorModal={openTokenSelectorModal}
                setOpenTokenSelectorModal={setOpenTokenSelectorModal}
                setRewardToken={setRewardToken}
              />

              {rewardType === "Token" && (
                <CustomInput
                  label="Contract"
                  placeholder="Select or enter an asset or token"
                  type="text"
                  error={errors.tokenContract?.message}
                  {...register("tokenContract")}
                  className={
                    rewardType !== "Token"
                      ? "hidden"
                      : rewardToken
                        ? "pl-[30%]"
                        : ""
                  }
                  onFocus={handleChangeToken}
                  handleClickIcon={() => {}}
                  icon={<RxCaretDown />}
                  token={
                    rewardToken && (
                      <div className="flex w-full items-center gap-2 text-sm text-black">
                        <span>
                          {rewardToken?.contract
                            ? "Sym:"
                            : rewardToken?.issuer
                              ? "Asset:"
                              : ""}
                        </span>
                        <span className="font-bold">{rewardToken?.code}</span>
                      </div>
                    )
                  }
                />
              )}

              {rewardType === "Token" && (
                <div className={`grid gap-5 sm:grid-cols-2`}>
                  <CustomInput
                    label="Number of Winners"
                    placeholder="0"
                    type="number"
                    error={errors.numberOfWinners?.message}
                    {...register("numberOfWinners", { valueAsNumber: true })}
                  />

                  <Controller
                    name="winnerSelectionMethod"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        label="Winner Selection Method"
                        options={WINNER_SELECTION_METHOD}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.winnerSelectionMethod?.message}
                      />
                    )}
                  />

                  {/*                                     
                  <CustomSelect
                    label="Winner Selection Method"
                    placeholder="Select"
                    options={WINNER_SELECTION_METHOD}
                    error={errors.winnerSelectionMethod?.message}
                    register={register("winnerSelectionMethod")}
                  /> */}
                </div>
              )}

              <div className="grid gap-2">
                <div className="flex w-full items-center justify-between text-base font-light text-[#09032A]">
                  Quest Duration
                  <div className="ml-auto flex items-center gap-2">
                    <p className="text-[14px] font-[300] text-[#09032A]">
                      Run quest continuously
                    </p>
                    <Controller
                      name="runContinuously"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          className="group block size-4 shrink-0 rounded border border-[#D0D5DD] bg-white data-checked:border-none data-checked:bg-[#2F0FD1] data-disabled:cursor-not-allowed data-disabled:bg-orange-200"
                        >
                          <svg
                            className="stroke-white opacity-0 group-data-checked:opacity-100"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M3 8L6 11L11 3.5"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Checkbox>
                      )}
                    />
                  </div>
                </div>

                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <CustomDateSelect
                      startDate={field.value}
                      endDate={watch("endDate")}
                      onStartDateChange={field.onChange}
                      onEndDateChange={(date) =>
                        setValue("endDate", date, { shouldValidate: true })
                      }
                      runContinuously={watch("runContinuously")}
                      startDateError={errors.startDate?.message}
                      endDateError={errors.endDate?.message}
                    />
                  )}
                />
              </div>

              <Controller
                name="rewardMode"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <p className="text-base font-light text-[#09032A]">
                      Reward Mode
                    </p>
                    <RadioGroup
                      value={field.value}
                      onChange={field.onChange}
                      className="flex w-[100%] flex-col items-start justify-between gap-2 sm:flex-row sm:items-center"
                    >
                      {REWARD_MODES.map((plan) => (
                        <Field
                          key={plan}
                          className="flex w-[50%] items-center gap-2"
                        >
                          <Radio
                            value={plan}
                            className="group flex size-5 items-center justify-center rounded-full border bg-white data-checked:bg-[#2F0FD1]"
                          >
                            <span className="invisible size-2 rounded-full bg-white group-data-checked:visible" />
                          </Radio>
                          <Label className="text-[15px] font-[300] text-[#09032A]">
                            {plan}
                          </Label>
                        </Field>
                      ))}
                    </RadioGroup>

                    {errors.rewardMode && (
                      <span className="text-xs text-red-500">
                        {errors.rewardMode.message}
                      </span>
                    )}
                  </div>
                )}
              />

              {rewardType === "Token" && rewardMode === "Overall Reward" && (
                <CustomInput
                  label="How many tokens per winner?"
                  placeholder="eg 50"
                  type="number"
                  error={errors.tokensPerWinner?.message}
                  {...register("tokensPerWinner", { valueAsNumber: true })}
                />
              )}

              {rewardType === "Points" && rewardMode === "Overall Reward" && (
                <CustomInput
                  label="How many points per winner?"
                  placeholder="eg 50"
                  type="number"
                  error={errors.pointsPerWinner?.message}
                  {...register("pointsPerWinner", { valueAsNumber: true })}
                />
              )}

              <hr className="border border-[#F0F4FD]" />

              {fields.map((task, index) => {
                return (
                  <div key={task.id} className="grid gap-4">
                    <div className="flex items-center justify-between bg-[#EDF2FF] px-3 py-2">
                      <p className="font-semibold text-[#2F0FD1]">
                        Task {fields.length > 1 && index + 1}
                      </p>

                      <div className="flex items-center gap-2">
                        {/* Delete */}
                        {fields.length > 1 && (
                          <button
                            type="button"
                            className="rounded bg-white p-2"
                            onClick={() => remove(index)}
                          >
                            <RiDeleteBin6Fill className="text-red-500" />
                          </button>
                        )}

                        {/* Collapse toggle */}
                        <button
                          type="button"
                          onClick={() => toggleTask(index)}
                          className="rounded bg-white p-2"
                        >
                          {collapsedTasks[index] ? (
                            <IoChevronDown />
                          ) : (
                            <IoChevronUp />
                          )}
                        </button>
                      </div>
                    </div>

                    {!collapsedTasks[index] && (
                      <>
                        <Controller
                          name={`tasks.${index}.type`}
                          control={control}
                          render={({ field }) => (
                            <CustomSelect
                              label="Select Task Type"
                              options={TASK_TYPES}
                              value={field.value}
                              onChange={field.onChange}
                              error={errors.tasks?.[index]?.type?.message}
                            />
                          )}
                        />

                        {/* <CustomSelect
                          label="Select Task Type"
                          placeholder="Select"
                          options={TASK_TYPES}
                          error={errors.tasks?.[index]?.type?.message}
                          register={register(`tasks.${index}.type`)}
                        /> */}

                        {rewardType === "Token" &&
                          rewardMode === "Individual Task Reward" && (
                            <CustomInput
                              label="How many tokens per task?"
                              placeholder="eg 50"
                              type="number"
                              error={
                                errors.tasks?.[index]?.tokensPerTask?.message
                              }
                              {...register(`tasks.${index}.tokensPerTask`, {
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
                              error={
                                errors.tasks?.[index]?.pointsPerTask?.message
                              }
                              {...register(`tasks.${index}.pointsPerTask`, {
                                valueAsNumber: true,
                              })}
                            />
                          )}

                        {/* {watch(`tasks.${index}.type`) === "Post on Twitter" && (
                          <CustomInput
                            label="Twitter (X) Link"
                            error={errors.tasks?.[index]?.twitterUrl?.message}
                            {...register(`tasks.${index}.twitterUrl`)}
                            placeholder="Paste URL"
                            prefix="https://"
                            type="text"
                          />
                        )} */}

                        {watch(`tasks.${index}.type`) ===
                          "Follow on Twitter" && (
                          <CustomInput
                            label="Twitter (X) Link"
                            error={errors.tasks?.[index]?.twitterUrl?.message}
                            {...register(`tasks.${index}.twitterUrl`)}
                            placeholder="Paste URL"
                            prefix="https://"
                            type="text"
                          />
                        )}

                        {watch(`tasks.${index}.type`) === "Post on Discord" && (
                          <div className="space-y-5">
                            <CustomInput
                              label="Discord Invite Link"
                              error={
                                errors.tasks?.[index]?.discordLink?.message
                              }
                              {...register(`tasks.${index}.discordLink`)}
                              placeholder="Paste URL"
                              prefix="https://"
                              type="text"
                            />

                            <CustomInput
                              label="Channel ID"
                              error={errors.tasks?.[index]?.channelId?.message}
                              {...register(`tasks.${index}.channelId`)}
                              placeholder="Enter Text"
                              type="text"
                            />
                          </div>
                        )}

                        {watch(`tasks.${index}.type`) === "Like Tweet" && (
                          <CustomInput
                            label="Tweet URL"
                            error={errors.tasks?.[index]?.tweetUrl?.message}
                            {...register(`tasks.${index}.tweetUrl`)}
                            placeholder="Paste URL"
                            prefix="https://"
                            type="text"
                          />
                        )}

                        {watch(`tasks.${index}.type`) ===
                          "Join Telegram Channel" && (
                          <CustomInput
                            label={
                              <div className="flex w-full items-center justify-between">
                                <span>Telegram Link</span>
                                <span className="flex items-center gap-1 text-[14px] font-normal text-[#2F0FD1]">
                                  Channel needs a ContributeFi bot{" "}
                                  <BsFillInfoCircleFill />
                                </span>
                              </div>
                            }
                            error={errors.tasks?.[index]?.telegramLink?.message}
                            {...register(`tasks.${index}.telegramLink`)}
                            placeholder="Paste URL"
                            prefix="https://"
                            type="text"
                          />
                        )}

                        {watch(`tasks.${index}.type`) ===
                          "Post on Telegram Group" && (
                          <CustomInput
                            label="Telegram Group Link"
                            error={
                              errors.tasks?.[index]?.telegramGroupLink?.message
                            }
                            {...register(`tasks.${index}.telegramGroupLink`)}
                            placeholder="Paste URL"
                            prefix="https://"
                            type="text"
                          />
                        )}

                        {watch(`tasks.${index}.type`) ===
                          "Comment on Twitter" && (
                          <div className="space-y-5">
                            <CustomInput
                              label="Tweet URL"
                              error={errors.tasks?.[index]?.tweetUrl?.message}
                              {...register(`tasks.${index}.tweetUrl`)}
                              placeholder="Paste URL"
                              prefix="https://"
                              type="text"
                            />

                            <CustomInput
                              label="Keyword Validation (optional)"
                              error={
                                errors.tasks?.[index]?.keywordValidation
                                  ?.message
                              }
                              {...register(`tasks.${index}.keywordValidation`)}
                              placeholder="Enter Text"
                              type="text"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}

              <div className="flex flex-wrap items-center gap-2">
                {fields.length > 1 && (
                  <>
                    <Controller
                      name="makeConcurrent"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          className="group block size-4 shrink-0 rounded border border-[#D0D5DD] bg-white data-checked:border-none data-checked:bg-[#2F0FD1] data-disabled:cursor-not-allowed data-disabled:bg-orange-200"
                        >
                          <svg
                            className="stroke-white opacity-0 group-data-checked:opacity-100"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M3 8L6 11L11 3.5"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Checkbox>
                      )}
                    />
                    <p className="text-[14px] font-[300] text-[#09032A]">
                      Make the tasks concurrent
                    </p>
                  </>
                )}

                <button
                  type="button"
                  onClick={() =>
                    append({
                      type: "",
                      pointsPerTask: null,
                      tokensPerTask: null,
                      keywordValidation: null,
                    })
                  }
                  className="ml-auto flex cursor-pointer items-center gap-1 text-[#2F0FD1]"
                >
                  + Add Another Task
                </button>
              </div>

              <Button
                variant="secondary"
                size="lg"
                type="submit"
                className="mt-5 w-full"
              >
                Continue
              </Button>
            </form>
          </>
        ) : (
          <div className="px-4 py-4 text-[14px]">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">Quest Title</p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.questTitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">Reward Type</p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.rewardType}
                </p>
              </div>

              {step1Data.rewardType === "Token" && (
                <div className="flex items-center gap-2">
                  <p className="w-1/2 font-[300] text-[#525866]">
                    Token Contract
                  </p>
                  <p className="w-1/2 font-medium text-[#050215]">
                    {step1Data.tokenContract.slice(0, 6)}...
                    {step1Data.tokenContract.slice(-6)}
                  </p>
                </div>
              )}

              {step1Data?.numberOfWinners && (
                <div className="flex items-center gap-2">
                  <p className="w-1/2 font-[300] text-[#525866]">
                    Number of Winners
                  </p>
                  <p className="w-1/2 font-medium text-[#050215]">
                    {step1Data.numberOfWinners}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">
                  {step1Data?.endDate ? "Quest Duration" : "Quest Start"}
                </p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.startDate &&
                    formatDateToYYYYMMDD(new Date(step1Data.startDate))}
                  {step1Data.endDate &&
                    ` to ${formatDateToYYYYMMDD(new Date(step1Data.endDate))}`}
                </p>
              </div>

              {step1Data.rewardType === "Token" && (
                <div className="flex items-center gap-2">
                  <p className="w-1/2 font-[300] text-[#525866]">
                    Selection Method
                  </p>
                  <p className="w-1/2 font-medium text-[#050215]">
                    {step1Data.winnerSelectionMethod}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">Reward Mode</p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.rewardMode}
                </p>
              </div>

              {step1Data?.rewardMode === "Overall Reward" && (
                <>
                  <div className="flex items-center gap-2">
                    <p className="w-1/2 font-[300] text-[#525866]">
                      Reward Per Winner
                    </p>
                    <p className="w-1/2 font-medium text-[#050215]">
                      {step1Data?.tokensPerWinner
                        ? `${step1Data?.tokensPerWinner} ${step1Data?.symbol}`
                        : `${step1Data?.pointsPerWinner} Points`}
                    </p>
                  </div>
                </>
              )}
            </div>

            <hr className="my-6 border border-[#F0F4FD]" />

            {step1Data.tasks &&
              step1Data.tasks.map((task, index) => {
                const config = TASK_PREVIEW_CONFIG[task.type];

                return (
                  <Fragment key={index}>
                    <div className="mb-4">
                      <div className="rounded-[8px] bg-[#EDF2FF] px-3 py-2">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-[#2F0FD1]">
                            Task {index + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleTask(index)}
                            className="rounded bg-white p-2"
                          >
                            {collapsedTasks[index] ? (
                              <IoChevronDown />
                            ) : (
                              <IoChevronUp />
                            )}
                          </button>
                        </div>

                        {!collapsedTasks[index] && (
                          <div className="mt-2 flex flex-wrap justify-between gap-4 rounded-[8px] bg-white p-4">
                            <div className="space-y-2">
                              <p className="font-[300] text-[#525866]">
                                Task Type
                              </p>
                              <p className="font-medium text-[#050215]">
                                {task.type}
                              </p>
                            </div>

                            {step1Data?.rewardMode ===
                              "Individual Task Reward" && (
                              <div className="space-y-2">
                                <p className="font-[300] text-[#525866]">
                                  Reward Per Task
                                </p>
                                <p className="font-medium text-[#050215]">
                                  {task.pointsPerTask || task?.tokensPerTask}{" "}
                                  {task?.tokensPerTask
                                    ? step1Data?.symbol
                                    : "Points"}
                                </p>
                              </div>
                            )}

                            {config && (
                              <div className="space-y-2">
                                <p className="font-[300] text-[#525866]">
                                  {config.label}
                                </p>
                                <p className="font-medium text-[#050215]">
                                  {task[config.field]}
                                </p>
                              </div>
                            )}

                            {task["keywordValidation"] &&
                              task.type === "Comment on Twitter" && (
                                <div className="space-y-2">
                                  <p className="font-[300] text-[#525866]">
                                    Keyword Validation
                                  </p>
                                  <p className="font-medium text-[#050215]">
                                    {task["keywordValidation"]}
                                  </p>
                                </div>
                              )}

                            {task["channelId"] &&
                              task.type === "Post on Discord" && (
                                <div className="space-y-2">
                                  <p className="font-[300] text-[#525866]">
                                    Channel ID
                                  </p>
                                  <p className="font-medium text-[#050215]">
                                    {task["channelId"]}
                                  </p>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Fragment>
                );
              })}

            {step1Data?.rewardType === "Token" && (
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <>
                  <Controller
                    name="rewardAllWithPoints"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                        className="group block size-4 shrink-0 rounded border border-[#D0D5DD] bg-white data-checked:border-none data-checked:bg-[#2F0FD1] data-disabled:cursor-not-allowed data-disabled:bg-orange-200"
                      >
                        <svg
                          className="stroke-white opacity-0 group-data-checked:opacity-100"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Checkbox>
                    )}
                  />
                  <p className="text-[14px] font-[300] text-[#09032A]">
                    Reward all participants with points
                  </p>
                </>
              </div>
            )}

            {rewardAllWithPoints && (
              <CustomInput
                label="How many points per participant?"
                placeholder="eg 50"
                type="number"
                error={errors.extraPoints?.message}
                {...register("extraPoints", { valueAsNumber: true })}
              />
            )}

            <div className="mt-6 space-y-2 rounded-[8px] bg-[#EDF2FF] px-9 py-6">
              {step === 2 && step1Data?.rewardType === "Points" ? (
                <>
                  <Button
                    variant="secondary"
                    size="lg"
                    type="submit"
                    className="mt-5 w-full"
                    onClick={() => {
                      // setSheetIsOpen(false);
                      // setOpenQuestSuccess(true);
                      // removeItemFromLocalStorage("growthQuestStep");
                      // removeItemFromLocalStorage("growthQuestStep1Data");
                      handlePublishQuest();
                    }}
                  >
                    {isSubmitting ? "Publishing..." : "Publish Quest"}
                  </Button>
                </>
              ) : step === 2 && step1Data?.rewardType === "Token" ? (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-[300] text-[#09032A]">
                      Total Rewards (to be deposited):
                    </p>
                    <p className="text-2xl font-bold text-[#050215]">
                      {step1Data.rewardMode === "Overall Reward" &&
                        `${step1Data.tokensPerWinner * step1Data.numberOfWinners} ${step1Data?.symbol}`}

                      {step1Data.rewardMode === "Individual Task Reward" &&
                        `${step1Data.tasks.reduce((total, task) => total + task.tokensPerTask, 0) * step1Data.numberOfWinners} ${step1Data?.symbol}`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="font-[300] text-[#09032A]">Fees to Charge</p>
                    <p className="text-2xl font-bold text-[#050215]">
                      100 {step1Data?.symbol}
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    size="lg"
                    type="submit"
                    className="mt-5 w-full"
                    onClick={() => {
                      setStep((prev) => prev + 1);
                      setItemInLocalStorage("growthQuestStep", 3);
                    }}
                    disabled={rewardAllWithPoints && !extraPoints}
                  >
                    Deposit Token
                  </Button>
                </>
              ) : null}

              {step === 3 && (
                <>
                  <div className="space-y-1 text-center">
                    <p className="font-[300] text-[#09032A]">
                      Amount Deposited
                    </p>
                    <p className="text-2xl font-bold text-[#050215]">
                      {step1Data.rewardMode === "Overall Reward" &&
                        `${step1Data.tokensPerWinner * step1Data.numberOfWinners} ${step1Data?.symbol}`}

                      {step1Data.rewardMode === "Individual Task Reward" &&
                        `${step1Data.tasks.reduce((total, task) => total + task.tokensPerTask, 0) * step1Data.numberOfWinners} ${step1Data?.symbol}`}
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    size="lg"
                    type="submit"
                    className="mt-5 w-full"
                    onClick={() => {
                      // setSheetIsOpen(false);
                      // setOpenQuestSuccess(true);
                      // removeItemFromLocalStorage("growthQuestStep");
                      // removeItemFromLocalStorage("growthQuestStep1Data");
                      handlePublishQuest();
                    }}
                    disabled={rewardAllWithPoints && !extraPoints}
                  >
                    {isSubmitting ? "Publishing..." : "Publish Quest"}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default GrowthQuest;
