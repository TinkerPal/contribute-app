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
import { IoIosArrowForward, IoIosRefreshCircle } from "react-icons/io";
import { IoCheckmarkCircle, IoWarning } from "react-icons/io5";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { CreateOnChainQuestSchema } from "@/schemas";
import CustomInput from "../CustomInput";
import CustomSelect from "../CustomSelect";
import { Checkbox, Field, Label, Radio, RadioGroup } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import CustomDateSelect from "../CustomDateSelect";
import { RiArrowDownSFill, RiDeleteBin6Fill } from "react-icons/ri";
import {
  getItemFromLocalStorage,
  removeItemFromLocalStorage,
  setItemInLocalStorage,
} from "@/lib/utils";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  formatDateToYYYYMMDD,
  hydrateQuestData,
  mapFormToCreateOnChainQuestPayload,
} from "@/utils";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import {
  NETWORK_TYPES,
  REWARD_MODES,
  REWARD_TYPES,
  VERIFICATION_MODES,
  WINNER_SELECTION_METHOD,
} from "@/utils/constants";
import { BsFillInfoCircleFill } from "react-icons/bs";
import {
  useCreateOnChainQuest,
  useLoadContractSpec,
} from "@/hooks/useCreateQuest";
import TokenSelectorModal from "./TokenSelectorModal";
import { RxCaretDown } from "react-icons/rx";
import { toast } from "react-toastify";
import { useRequireAuth } from "@/hooks/useRequireAuth";

function OnChainQuest({ setSheetIsOpen, setOpenQuestSuccess, communityId }) {
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
    getItemFromLocalStorage("onChainQuestStep") || 1,
  );
  const [step1Data, setStep1Data] = useState(() => {
    const stored = getItemFromLocalStorage("onChainQuestStep1Data");
    return stored ? hydrateQuestData(stored) : null;
  });
  const [selectedSpecs, setSelectedSpecs] = useState(
    getItemFromLocalStorage("selectedSpecs") || {},
  );

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
    resolver: zodResolver(CreateOnChainQuestSchema),
    defaultValues: step1Data ?? {
      questTitle: "",
      questDescription: "",
      rewardType: "Points",
      networkType: "PUBLIC",
      tokenContract: "",
      symbol: "",
      numberOfWinners: "",
      winnerSelectionMethod: "Random",
      makeConcurrent: false,
      rewardAllWithPoints: step1Data?.rewardAllWithPoints || false,
      startDate: new Date(),
      endDate: "",
      rewardMode: "Overall Reward",
      contractAddress: "",
      verificationMode: "Contract Invocation",
      pointsPerWinner: step1Data?.pointsPerTask || "",
      extraPoints: step1Data?.extraPoints || "",
      tokensPerWinner: step1Data?.tokensPerWinner || "",
      callerAccountId: "",
      tasks: [
        {
          description: "",
          function: "",
          functionSpec: {},
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
    setItemInLocalStorage("onChainQuestStep1Data", {
      ...data,
      tokenContract: rewardToken?.contract,
      symbol: rewardToken?.code,
    });
    setItemInLocalStorage("selectedSpecs", selectedSpecs);
    setStep(2);
    setStep1Data({
      ...data,
      tokenContract: rewardToken?.contract,
      symbol: rewardToken?.code,
    });
    setItemInLocalStorage("onChainQuestStep", 2);
    setItemInLocalStorage("rewardToken", rewardToken);
  };

  const rewardType = watch("rewardType");
  const rewardMode = watch("rewardMode");
  const runContinuously = watch("runContinuously");
  const rewardAllWithPoints = watch("rewardAllWithPoints");
  const extraPoints = watch("extraPoints");
  const verificationMode = watch("verificationMode");
  const contractAddress = watch("contractAddress");
  const networkType = watch("networkType");
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

  const { mutateAsync: createQuest } = useCreateOnChainQuest();

  const handlePublishQuest = async () => {
    if (!requireAuth()) return;

    try {
      let payload = JSON.parse(
        JSON.stringify(mapFormToCreateOnChainQuestPayload(step1Data)),
      );

      payload = {
        ...payload,
        tasks: payload.tasks.map((task, index) => {
          const storedSpec = selectedSpecs[index];
          const specFromSpecs = specs.find((s) => s.name === task.function);
          return {
            ...task,
            functionSpec: storedSpec || specFromSpecs || null,
          };
        }),
      };

      console.log({ payload });

      setIsSubmitting(true);
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
      removeItemFromLocalStorage("selectedSpecs");
    } catch (error) {
      console.error("Failed to create growth quest", error);
      // TODO: toast / error UI
      setIsSubmitting(false);
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

  const [specs, setSpecs] = useState([]);

  const [loadingSpec, setLoadingSpec] = useState(false);
  const [specLoadStatus, setSpecLoadStatus] = useState("idle");
  const lastLoadedRef = useRef("");
  const { mutateAsync: loadContractSpec } = useLoadContractSpec();

  useEffect(() => {
    const loadSpec = async () => {
      const addr = contractAddress || step1Data?.contractAddress || "";
      const net = networkType || step1Data?.networkType || "PUBLIC";

      if (addr.length === 0) {
        lastLoadedRef.current = "";
        setSpecs([]);
        return;
      }

      if (addr.length === 56 && open && addr !== lastLoadedRef.current) {
        try {
          const payload = { contractId: addr, networkType: net };

          setLoadingSpec(true);
          setSpecLoadStatus("loading");
          const res = await loadContractSpec({ payload });

          setSpecs(res?.data?.content);
          lastLoadedRef.current = addr;
          setLoadingSpec(false);
          setSpecLoadStatus("success");

          console.log({ res });
        } catch (error) {
          console.error({ error });
          setLoadingSpec(false);
          setSpecLoadStatus("error");
          toast.error("Failed to load spec");
        }
      }
    };

    loadSpec();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAddress, networkType, open]);

  // const handleLoadSpec = async () => {
  //   console.log({ contractAddress, networkType });

  //   try {
  //     const payload = { contractId: contractAddress, networkType };

  //     setLoadingSpec(true);
  //     const res = await loadContractSpec({ payload });

  //     setSpecs(res?.data?.content);
  //     setLoadingSpec(false);
  //     toast.success("Specs loaded successfully");

  //     console.log({ res });
  //   } catch (error) {
  //     console.error({ error });
  //     setLoadingSpec(false);
  //     toast.error("Failed to load spec");
  //   }
  // };

  const handleSpecSelection = (taskIndex, specData) => {
    setSelectedSpecs((prev) => ({
      ...prev,
      [taskIndex]: {
        name: specData.name,
        doc: specData.doc,
        inputs: specData.inputs,
        outputs: specData.outputs,
      },
    }));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="flex cursor-pointer items-center justify-between gap-4 rounded-md bg-[#F7F9FD] p-5 hover:bg-[#F7F9FF]/70">
          <div className="space-y-2">
            <p className="text-left text-[18px] font-semibold text-[#09032A]">
              On-chain Interaction Quest
            </p>

            <p className="text-[#525866]">
              Blockchain interactions with Soroban or other networks.
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
                      setItemInLocalStorage("onChainQuestStep", 1);
                      if (!extraPoints) {
                        setValue("rewardAllWithPoints", false);
                      }
                    } else {
                      setItemInLocalStorage("onChainQuestStep", 2);
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
                On-Chain Quest
              </SheetTitle>
              <SheetDescription className="font-[300] text-[#525866]">
                Engagement with projects’ smart contracts
              </SheetDescription>
            </>
          )}
        </SheetHeader>

        {step === 1 ? (
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
                  icon={<RiArrowDownSFill className="size-6 text-[#B2B9C7]" />}
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

                  {/* <CustomSelect
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
                name="verificationMode"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <p className="flex items-center gap-1 text-base font-light text-[#09032A]">
                      Verification Mode
                      <BsFillInfoCircleFill className="text-[#2F0FD1]" />
                    </p>
                    <RadioGroup
                      value={field.value}
                      onChange={field.onChange}
                      className="flex w-[100%] flex-col items-start justify-between gap-2 sm:flex-row sm:items-center"
                    >
                      {VERIFICATION_MODES.map((plan) => (
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

                    {errors.verificationMode && (
                      <span className="text-xs text-red-500">
                        {errors.verificationMode.message}
                      </span>
                    )}
                  </div>
                )}
              />

              <Controller
                name="networkType"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label="Network Type"
                    placeholder="Select"
                    options={NETWORK_TYPES}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.networkType?.message}
                  />
                )}
              />

              <CustomInput
                label="Contract Address"
                placeholder="Enter Contract Address"
                type="text"
                error={errors.contractAddress?.message}
                {...register("contractAddress")}
                // handleClickIcon={handleLoadSpec}
                icon={
                  specLoadStatus === "loading" ? (
                    <IoIosRefreshCircle className="animate-spin" />
                  ) : specLoadStatus === "success" ? (
                    <IoCheckmarkCircle className="text-green-500" />
                  ) : specLoadStatus === "error" ? (
                    <IoWarning className="text-red-500" />
                  ) : (
                    <IoIosRefreshCircle title="Load spec" />
                  )
                }
                disabled={loadingSpec}
              />

              {verificationMode === "Observe Account Calls" && (
                <CustomInput
                  label="Caller Account ID"
                  placeholder="Enter Account ID"
                  type="text"
                  error={errors.callerAccountId?.message}
                  {...register("callerAccountId")}
                />
              )}

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

              {fields.map((task, index) => (
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
                      <CustomInput
                        label="Description"
                        placeholder="Enter Task Description"
                        type="text"
                        error={errors.tasks?.[index]?.description?.message}
                        {...register(`tasks.${index}.description`)}
                      />

                      <Controller
                        name={`tasks.${index}.function`}
                        control={control}
                        render={({ field }) => (
                          <CustomSelect
                            label="Function Name"
                            options={specs}
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.tasks?.[index]?.function?.message}
                            onSpecSelect={(specData) =>
                              handleSpecSelection(index, specData)
                            }
                          />
                        )}
                      />

                      {/* <CustomSelect
                        label="Function Name"
                        placeholder="Select"
                        options={specs}
                        error={errors.tasks?.[index]?.function?.message}
                        register={register(`tasks.${index}.function`)}
                        onSpecSelect={(specData) =>
                          handleSpecSelection(index, specData)
                        }
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

                      <CustomInput
                        label={
                          <div className="flex w-full items-center gap-1">
                            <span>Link (optional)</span>
                            <BsFillInfoCircleFill className="text-[#2F0FD1]" />
                          </div>
                        }
                        error={errors.tasks?.[index]?.link?.message}
                        {...register(`tasks.${index}.link`)}
                        placeholder="Paste URL"
                        prefix="https://"
                        type="text"
                      />
                    </>
                  )}
                </div>
              ))}

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
                  onClick={() => append({ function: "", points: 0 })}
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
                    {step1Data.tokenContract.slice(0, 10)}...
                    {step1Data?.tokenContract.slice(-8)}
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

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">
                  Verification Mode
                </p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.verificationMode}
                </p>
              </div>

              {step1Data?.contractAddress && (
                <div className="flex items-center gap-2">
                  <p className="w-1/2 font-[300] text-[#525866]">
                    Contract Address
                  </p>
                  <p className="w-1/2 font-medium text-[#050215]">
                    {step1Data.contractAddress.slice(0, 10)}...
                    {step1Data?.contractAddress.slice(-8)}
                  </p>
                </div>
              )}

              {step1Data?.callerAccountId && (
                <div className="flex items-center gap-2">
                  <p className="w-1/2 font-[300] text-[#525866]">
                    Caller Account ID
                  </p>
                  <p className="w-1/2 font-medium text-[#050215]">
                    {step1Data.callerAccountId}
                  </p>
                </div>
              )}

              {step1Data?.rewardMode === "Overall Reward" && (
                <>
                  <div className="flex items-center gap-2">
                    <p className="w-1/2 font-[300] text-[#525866]">
                      Reward Per Winner
                    </p>
                    <p className="w-1/2 font-medium text-[#050215]">
                      {step1Data?.tokensPerWinner
                        ? `${step1Data?.tokensPerWinner} XLM`
                        : `${step1Data?.pointsPerWinner} Points`}
                    </p>
                  </div>
                </>
              )}
            </div>

            <hr className="my-6 border border-[#F0F4FD]" />

            {step1Data.tasks.map((task, index) => {
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

                          <div className="space-y-2">
                            <p className="font-[300] text-[#525866]">
                              Functional Name
                            </p>
                            <p className="font-medium text-[#050215]">
                              {task.function}
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

                          {task.link && (
                            <div className="space-y-2">
                              <p className="font-[300] text-[#525866]">Link</p>
                              <p className="font-medium text-[#050215]">
                                {task.link}
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
              <div className="mb-4 flex flex-wrap items-center gap-2">
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
                      // removeItemFromLocalStorage("onChainQuestStep");
                      // removeItemFromLocalStorage("onChainQuestStep1Data");
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
                      setStep((prev) => prev + 1);
                      setItemInLocalStorage("onChainQuestStep", 3);
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
                      // removeItemFromLocalStorage("onChainQuestStep");
                      // removeItemFromLocalStorage("onChainQuestStep1Data");
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

export default OnChainQuest;
