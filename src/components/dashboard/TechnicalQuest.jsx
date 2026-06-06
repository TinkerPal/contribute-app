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
import { CreateTechnicalQuestSchema } from "@/schemas";
import CustomInput from "../CustomInput";
import CustomSelect from "../CustomSelect";
import { Checkbox, Field, Label, Radio, RadioGroup } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import {
  getItemFromLocalStorage,
  removeItemFromLocalStorage,
  setItemInLocalStorage,
} from "@/lib/utils";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import TaskItem from "./TaskItem";
import {
  REWARD_MODES,
  REWARD_TYPES,
  SELECTION_METHOD,
} from "@/utils/constants";
import {
  hydrateQuestData,
  mapFormToCreateTechnicalQuestPayload,
} from "@/utils";
import { BsFillInfoCircleFill } from "react-icons/bs";
import FileUpload from "../FileUpload";
import { useCreateTechnicalQuest } from "@/hooks/useCreateQuest";
import TokenSelectorModal from "./TokenSelectorModal";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const QUEST_GOAL = ["Project-based", "Recruit Candidates"];
const QUEST_VISIBILITY = ["Open Quest", "Closed Quest"];
const QUEST_TYPES = [
  { label: "Design", value: "Design" },
  { label: "Development", value: "Development" },
];

function TechnicalQuest({ setSheetIsOpen, setOpenQuestSuccess, communityId }) {
  const { requireAuth } = useRequireAuth();
  const isDesktop = useIsDesktop();
  const [open, setOpen] = useState(false);
  const side = isDesktop ? "right" : "bottom";
  const [collapsedTasks, setCollapsedTasks] = useState({});
  const [technicalQuestStep, setTechnicalQuestStep] = useState(
    getItemFromLocalStorage("technicalQuestStep") || 1,
  );
  const [step1Data, setStep1Data] = useState(() => {
    const stored = getItemFromLocalStorage("technicalQuestStep1Data");
    return stored ? hydrateQuestData(stored) : null;
  });

  const [openTokenSelectorModal, setOpenTokenSelectorModal] = useState(false);
  const [rewardToken, setRewardToken] = useState(null);

  const handleChangeToken = () => {
    setOpenTokenSelectorModal(true);
  };

  const toggleTask = (index) => {
    setCollapsedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
  } = useForm({
    resolver: zodResolver(CreateTechnicalQuestSchema),
    defaultValues: step1Data ?? {
      questTitle: "",
      questDescription: "",
      questType: "Design",
      rewardType: "Points",
      tokenContract: "",
      questGoal: "Project-based",
      questVisibility: "",
      candidateListFile: null,
      numberOfPeople: 1,
      selectionMethod: "Manual Assignment Required",
      rewardMode: "Overall Reward",
      makeConcurrent: false,
      rewardAllWithPoints: step1Data?.rewardAllWithPoints || false,
      pointsPerWinner: step1Data?.pointsPerTask || "",
      tokensPerWinner: step1Data?.tokensPerWinner || "",
      extraPoints: step1Data?.extraPoints || "",
      tasks: [
        {
          description: "",
          instruction: "",
          links: [
            {
              name: "",
              url: "",
            },
          ],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  const onSubmit = (data) => {
    setItemInLocalStorage("technicalQuestStep1Data", data);
    setTechnicalQuestStep(2);
    setStep1Data(data);
    setItemInLocalStorage("technicalQuestStep", 2);
  };

  const rewardType = watch("rewardType");
  const extraPoints = watch("extraPoints");
  const questGoal = watch("questGoal");
  const questVisibility = watch("questVisibility");
  const rewardMode = watch("rewardMode");
  const rewardAllWithPoints = watch("rewardAllWithPoints");

  const removeTaskSafe = (index) => {
    remove(index);
    setCollapsedTasks((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  useEffect(() => {
    if (questGoal === "Recruit Candidates") {
      setValue("questVisibility", "Open Quest");
      setValue("selectionMethod", "First to Complete");
    } else {
      setValue("questVisibility", "");
      setValue("selectionMethod", "Manual Assignment Required");
    }
  }, [questGoal, setValue, watch]);

  useEffect(() => {
    if (
      questGoal !== "Recruit Candidates" ||
      questVisibility !== "Closed Quest"
    ) {
      setValue("candidateListFile", null);
    }
  }, [questGoal, questVisibility, setValue]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: createQuest } = useCreateTechnicalQuest();

  const handlePublishQuest = async () => {
    if (!requireAuth()) return;

    try {
      const payload = JSON.parse(
        JSON.stringify(mapFormToCreateTechnicalQuestPayload(step1Data)),
      );

      setIsSubmitting(true);
      // await createTechnicalQuest(payload, communityId);
      await createQuest({
        payload,
        communityId,
      });

      setIsSubmitting(false);

      setSheetIsOpen(false);
      setOpenQuestSuccess(true);

      removeItemFromLocalStorage("growthQuestStep");
      removeItemFromLocalStorage("growthQuestStep1Data");
    } catch (error) {
      console.error("Failed to create growth quest", error);
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
              Technical Quest
            </p>

            <p className="text-[#525866]">
              {" "}
              Building or creative tasks that are GitHub-based or design-based.
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
          {technicalQuestStep === 2 || technicalQuestStep === 3 ? (
            <>
              {technicalQuestStep === 2 && (
                <FaArrowLeftLong
                  className="cursor-pointer text-3xl text-[#050215]"
                  onClick={() => {
                    if (technicalQuestStep === 2) {
                      setItemInLocalStorage("technicalQuestStep", 1);
                      if (!extraPoints) {
                        setValue("rewardAllWithPoints", false);
                      }
                    } else {
                      setItemInLocalStorage("technicalQuestStep", 2);
                    }
                    setTechnicalQuestStep((prev) => prev - 1);
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
                Technical Quest
              </SheetTitle>
              <SheetDescription className="font-[300] text-[#525866]">
                Code and design-based tasks
              </SheetDescription>
            </>
          )}
        </SheetHeader>

        {technicalQuestStep === 1 ? (
          <>
            <form
              className="grid gap-5 px-4 py-4"
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

              <CustomSelect
                label="Quest Type"
                placeholder="Select"
                options={QUEST_TYPES}
                error={errors.questType?.message}
                register={register("questType")}
              />

              <CustomSelect
                label="Reward Type"
                placeholder="Select"
                options={REWARD_TYPES}
                error={errors.rewardType?.message}
                register={register("rewardType")}
              />

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

              {/* {rewardType === "Token" && (
                <CustomInput
                  label="Token Contract"
                  placeholder="000000000000000000000"
                  type="text"
                  error={errors.tokenContract?.message}
                  {...register("tokenContract")}
                  className={rewardType !== "Token" ? "hidden" : ""}
                  defaultValue={rewardToken?.contract.slice(0, 20)}
                  onFocus={handleChangeToken}
                  token={
                    rewardToken && (
                      <div className="flex items-center gap-2 rounded-sm border bg-white px-2 py-1 text-sm text-black shadow">
                        <img
                          src={rewardToken?.icon}
                          alt={rewardToken?.code}
                          className="h-3 w-3"
                        />
                        {rewardToken?.name}
                      </div>
                    )
                  }
                />
              )} */}

              {/* {rewardType === "Token" && (
                <CustomInput
                  label="Token Contract"
                  placeholder="000000000000000000000"
                  type="text"
                  error={errors.tokenContract?.message}
                  {...register("tokenContract")}
                  className={rewardType !== "Token" ? "hidden" : ""}
                />
              )} */}

              <Controller
                name="questGoal"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <p className="flex items-center gap-1 text-[14px] font-light text-[#09032A]">
                      Quest Goal
                      <BsFillInfoCircleFill className="text-[#2F0FD1]" />
                    </p>
                    <RadioGroup
                      value={field.value}
                      onChange={field.onChange}
                      className="flex w-[100%] flex-col items-start justify-between gap-2 sm:flex-row sm:items-center"
                    >
                      {QUEST_GOAL.map((plan) => (
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

                    {errors.questGoal && (
                      <span className="text-xs text-red-500">
                        {errors.questGoal.message}
                      </span>
                    )}
                  </div>
                )}
              />

              {questGoal === "Recruit Candidates" && (
                <Controller
                  name="questVisibility"
                  control={control}
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <p className="flex items-center gap-1 text-[14px] font-light text-[#09032A]">
                        Quest Visibility
                      </p>
                      <RadioGroup
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        className="flex w-[100%] flex-col items-start justify-between gap-2 sm:flex-row sm:items-center"
                      >
                        {QUEST_VISIBILITY.map((plan) => (
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

                      {errors.questVisibility && (
                        <span className="text-xs text-red-500">
                          {errors.questVisibility.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              )}

              {questGoal === "Recruit Candidates" &&
                questVisibility === "Closed Quest" && (
                  <div className="space-y-1">
                    <Controller
                      name="candidateListFile"
                      control={control}
                      render={({ field }) => (
                        <FileUpload
                          description="Files supported: CSV"
                          buttonText={
                            watch("candidateListFile")?.name || "Upload List"
                          }
                          accept="text/csv"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            field.onChange(file);
                          }}
                        />
                      )}
                    />
                    {errors.candidateListFile && (
                      <p className="text-xs text-red-500">
                        {errors.candidateListFile.message}
                      </p>
                    )}
                  </div>
                )}

              {((questGoal === "Recruit Candidates" &&
                questVisibility === "Open Quest") ||
                questGoal === "Project-based") && (
                <div className={`grid gap-5 sm:grid-cols-2`}>
                  <CustomInput
                    label="Number of People"
                    placeholder="0"
                    type="number"
                    error={errors.numberOfPeople?.message}
                    {...register("numberOfPeople", { valueAsNumber: true })}
                    disabled={questGoal === "Project-based"}
                  />
                  <CustomSelect
                    label="Selection Method"
                    placeholder="Select"
                    options={SELECTION_METHOD}
                    error={errors.selectionMethod?.message}
                    register={register("selectionMethod")}
                    disabled
                  />
                </div>
              )}

              <Controller
                name="rewardMode"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <p className="text-[14px] font-light text-[#09032A]">
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
                  <TaskItem
                    key={task.id}
                    taskIndex={index}
                    control={control}
                    register={register}
                    errors={errors}
                    removeTask={removeTaskSafe}
                    collapsed={collapsedTasks[index]}
                    toggleTask={toggleTask}
                    totalTasks={fields.length}
                    rewardMode={rewardMode}
                    rewardType={rewardType}
                  />
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
                  onClick={() => {
                    append({
                      description: "",
                      instruction: "",
                      links: [{ name: "", url: "" }],
                    });

                    setCollapsedTasks((prev) => ({
                      ...prev,
                      [fields.length]: false, // new task open by default
                    }));
                  }}
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
                    {step1Data.tokenContract}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">Quest Goal</p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.questGoal}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">
                  Number of People
                </p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.numberOfPeople}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">
                  Selection Method
                </p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.selectionMethod}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">Reward Mode</p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.rewardMode}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">
                  Reward Per Person
                </p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data?.tokensPerWinner
                    ? `${step1Data?.tokensPerWinner} XLM`
                    : `${step1Data?.pointsPerWinner} Points`}
                </p>
              </div>
            </div>

            <hr className="my-6 border border-[#F0F4FD]" />

            {step1Data.tasks.map((task, index) => {
              // const config = TASK_PREVIEW_CONFIG[task.type];
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
                              Task Description
                            </p>
                            <p className="font-medium text-[#050215]">
                              {task.description}
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
                                {task?.tokensPerTask ? "XLM" : "Points"}
                              </p>
                            </div>
                          )}

                          {task.links.map((link) => (
                            <div className="space-y-2">
                              <p className="font-[300] text-[#525866]">
                                {link.name}
                              </p>
                              <p className="font-medium text-[#050215]">
                                {link.url}
                              </p>
                            </div>
                          ))}

                          <div className="space-y-2">
                            <p className="font-[300] text-[#525866]">
                              Task Instruction
                            </p>
                            <p className="font-medium text-[#050215]">
                              {task.instruction}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Fragment>
              );
            })}

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
              {technicalQuestStep === 2 &&
              step1Data?.rewardType === "Points" ? (
                <>
                  <Button
                    variant="secondary"
                    size="lg"
                    type="submit"
                    className="mt-5 w-full"
                    onClick={() => {
                      // setSheetIsOpen(false);
                      // setOpenQuestSuccess(true);
                      // removeItemFromLocalStorage("technicalQuestStep");
                      // removeItemFromLocalStorage("technicalQuestStep1Data");
                      handlePublishQuest();
                    }}
                  >
                    {isSubmitting ? "Publishing..." : "Publish Quest"}
                  </Button>
                </>
              ) : technicalQuestStep === 2 &&
                step1Data?.rewardType === "Token" ? (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-[300] text-[#09032A]">
                      Total Rewards (to be deposited):
                    </p>
                    <p className="text-2xl font-bold text-[#050215]">
                      {step1Data.rewardMode === "Overall Reward" &&
                        `${step1Data.tokensPerWinner * step1Data.numberOfWinners} XLM`}

                      {step1Data.rewardMode === "Individual Task Reward" &&
                        `${step1Data.tasks.reduce((total, task) => total + task.tokensPerTask, 0) * step1Data.numberOfWinners} XLM`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="font-[300] text-[#09032A]">Fees to Charge</p>
                    <p className="text-2xl font-bold text-[#050215]">100 XLM</p>
                  </div>

                  <Button
                    variant="secondary"
                    size="lg"
                    type="submit"
                    className="mt-5 w-full"
                    onClick={() => {
                      setTechnicalQuestStep((prev) => prev + 1);
                      setItemInLocalStorage("technicalQuestStep", 3);
                    }}
                    disabled={rewardAllWithPoints && !extraPoints}
                  >
                    Deposit Token
                  </Button>
                </>
              ) : null}

              {technicalQuestStep === 3 && (
                <>
                  <div className="space-y-1 text-center">
                    <p className="font-[300] text-[#09032A]">
                      Amount Deposited
                    </p>
                    <p className="text-2xl font-bold text-[#050215]">
                      {step1Data.rewardMode === "Overall Reward" &&
                        `${step1Data.tokensPerWinner * step1Data.numberOfWinners} XLM`}

                      {step1Data.rewardMode === "Individual Task Reward" &&
                        `${step1Data.tasks.reduce((total, task) => total + task.tokensPerTask, 0) * step1Data.numberOfWinners} XLM`}
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
                      // removeItemFromLocalStorage("technicalQuestStep");
                      // removeItemFromLocalStorage("technicalQuestStep1Data");
                      handlePublishQuest();
                    }}
                    disabled={rewardAllWithPoints && !extraPoints}
                  >
                    {isSubmitting ? "Publishing..." : "Publish Quest"}
                  </Button>
                </>
              )}
              {/* {technicalQuestStep === 2 && step1Data?.rewardType === "Points" ? ( <>
                                <Button
                                  variant="secondary"
                                  size="lg"
                                  type="submit"
                                  className="mt-5 w-full"
                                  onClick={() => {
                                    setSheetIsOpen(false);
                                    setOpenQuestSuccess(true);
                                    removeItemFromLocalStorage("growthQuestStep");
                                    removeItemFromLocalStorage("growthQuestStep1Data");
                                  }}
                                >
                                  Publish Quest
                                </Button>
                              </>) : */}
              {/* <>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-[300] text-[#09032A]">
                    Total Rewards (to be deposited):
                  </p>
                  <p className="text-2xl font-bold text-[#050215]">6,000 XLM</p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="font-[300] text-[#09032A]">Fees to Charge</p>
                  <p className="text-2xl font-bold text-[#050215]">100 XLM</p>
                </div>
              </>
              )}
              {technicalQuestStep === 3 && (
                <div className="space-y-1 text-center">
                  <p className="font-[300] text-[#09032A]">Amount Deposited</p>
                  <p className="text-2xl font-bold text-[#050215]">6,000 XLM</p>
                </div>
              )} */}
              {/* {technicalQuestStep === 2 && (
                <Button
                  variant="secondary"
                  size="lg"
                  type="submit"
                  className="mt-5 w-full"
                  onClick={() => {
                    setTechnicalQuestStep((prev) => prev + 1);
                    setItemInLocalStorage("technicalQuestStep", 3);
                  }}
                >
                  Deposit Token
                </Button>
              )} */}
              {/* {technicalQuestStep === 3 && (
                <Button
                  variant="secondary"
                  size="lg"
                  type="submit"
                  className="mt-5 w-full"
                  onClick={() => {
                    setSheetIsOpen(false);
                    setOpenQuestSuccess(true);
                  }}
                >
                  Publish Quest
                </Button>
              )} */}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default TechnicalQuest;
