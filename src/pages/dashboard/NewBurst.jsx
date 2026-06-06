import BackButton from "@/components/BackButton";
import CustomDateSelect from "@/components/CustomDateSelect";
import CustomInput from "@/components/CustomInput";
import CustomSelect from "@/components/CustomSelect";
import TokenSelectorModal from "@/components/dashboard/TokenSelectorModal";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getItemFromLocalStorage,
  removeItemFromLocalStorage,
  setItemInLocalStorage,
} from "@/lib/utils";
import { CompleteBurstCreateSchema, CreateBurstSchema } from "@/schemas";
import { createBurst, uploadBurstImage } from "@/services";
import {
  BURST_SELECTION_METHOD,
  POST_START_TIME,
  SENTIMENT_CHECK,
  SOCIAL_MEDIA_PLATFORM,
} from "@/utils/constants";
import { Checkbox, Field, Radio, RadioGroup } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoMdArrowDropdown } from "react-icons/io";
import { PiNotePencilFill } from "react-icons/pi";
import { useNavigate, useParams } from "react-router";
import { Switch } from "@/components/ui/switch";
import { hydrateQuestData } from "@/utils";

function NewBurst() {
  const { newBurst } = useParams();
  const [openTokenSelectorModal, setOpenTokenSelectorModal] = useState(false);
  const [rewardToken, setRewardToken] = useState(
    getItemFromLocalStorage("rewardToken") || null,
  );
  const [burstData, setBurstData] = useState(() => {
    const stored = getItemFromLocalStorage("burstData");
    return stored ? hydrateQuestData(stored) : null;
  });
  const [imagePreviews, setImagePreviews] = useState(
    getItemFromLocalStorage("burstImageUrls") || [],
  );
  const [burstCreated, setBurstCreated] = useState(() => {
    return getItemFromLocalStorage("burstCreated") || false;
  });

  const navigate = useNavigate();

  const handleChangeToken = () => {
    setOpenTokenSelectorModal(true);
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    register,
  } = useForm({
    resolver: zodResolver(CreateBurstSchema),
    defaultValues: burstData ?? {
      burstTitle: "",
      platform: "",
      selectionMethod: "",
      numberOfSelections: "",
      tokenContract: "",
      symbol: "",
      tokensForWinner: "",
      conversation: "",
      sentimentCheck: "Positive",
      requireImage: false,
      referenceImages: [],
    },
  });

  const {
    handleSubmit: handleCreateBurst,
    formState: { errors: createBurstErrors },
    control: createBurstControl,
    watch: createBurstWatch,
    setValue: setCreateBurstValue,
  } = useForm({
    resolver: zodResolver(CompleteBurstCreateSchema),
    defaultValues: {
      trendAge: "",
      startDate: null,
      endDate: null,
      autoPostSelected: false,
      aiCheckSelected: false,
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    const updatedData = {
      ...data,
      referenceImages: imagePreviews,
      tokenContract: rewardToken?.contract,
      symbol: rewardToken?.code,
    };

    try {
      //   const response = await createBurst(updatedData);
      console.log("Burst created:", updatedData);
      setItemInLocalStorage("burstData", updatedData);
      setBurstData(updatedData);
      setItemInLocalStorage("rewardToken", rewardToken);
      navigate("/burst/preview");
    } catch (error) {
      console.error("Failed to create burst:", error);
    }
  };

  const onSubmitBurst = async (data) => {
    const storedBurstData = getItemFromLocalStorage("burstData");
    const storedRewardToken = getItemFromLocalStorage("rewardToken");
    const storedImageUrls = getItemFromLocalStorage("burstImageUrls") || [];

    const combinedData = {
      ...storedBurstData,
      ...data,
      referenceImages: storedImageUrls,
      tokenContract:
        storedRewardToken?.contract || storedBurstData?.tokenContract,
      symbol: storedRewardToken?.code || storedBurstData?.symbol,
    };

    console.log("Submitting burst data:", combinedData);

    try {
      const response = await createBurst(combinedData);
      console.log("Burst created:", response);
      setBurstCreated(true);
      setItemInLocalStorage("burstCreated", true);
    } catch (error) {
      console.error("Failed to create burst:", error);
    }
  };

  console.log({ errors, rewardToken, createBurstErrors });

  useEffect(() => {
    setValue(
      "tokenContract",
      rewardToken?.contract
        ? `Contract: ${rewardToken.contract.slice(0, 5)}...${rewardToken.contract.slice(-5)}`
        : rewardToken?.issuer
          ? `Issuer: ${rewardToken.issuer.slice(0, 5)}...${rewardToken.issuer.slice(-5)}`
          : "",
    );
  }, [rewardToken, setValue]);

  useEffect(() => {
    const savedUrls = getItemFromLocalStorage("burstImageUrls") || [];
    if (savedUrls.length > 0) {
      setValue("referenceImages", savedUrls);
    }
  }, [setValue]);

  return (
    <div>
      <div className="space-y-8">
        {!burstCreated && (
          <div className="md:hidden">
            <BackButton />
          </div>
        )}

        <div className="space-y-[32px] rounded-[4px] bg-white px-4 py-6 md:px-[56px] md:pt-[32px] md:pb-[80px]">
          {!burstCreated && (
            <div className="hidden md:block">
              <BackButton />
            </div>
          )}

          {newBurst === "new-burst" && (
            <div className="space-y-[24px]">
              <p className="font-bricolage text-[24px] font-[700] text-[#050215]">
                Create New Burst
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-5 lg:grid-cols-2"
              >
                <CustomInput
                  label="Burst Title"
                  placeholder="Enter Title"
                  type="text"
                  error={errors.burstTitle?.message}
                  {...register("burstTitle")}
                />

                <Controller
                  name="platform"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      label="Social Media Platform"
                      options={SOCIAL_MEDIA_PLATFORM}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.platform?.message}
                    />
                  )}
                />

                <Controller
                  name="selectionMethod"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      label="Selection Method"
                      options={BURST_SELECTION_METHOD}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.selectionMethod?.message}
                    />
                  )}
                />

                <CustomInput
                  label="How many selection?"
                  placeholder="eg 10"
                  type="number"
                  error={errors.numberOfSelections?.message}
                  {...register("numberOfSelections")}
                />

                <CustomInput
                  label="Contract"
                  placeholder="Select or enter an asset or token"
                  type="text"
                  error={errors.tokenContract?.message}
                  {...register("tokenContract")}
                  className={rewardToken ? "pl-28 md:pl-[35%]" : ""}
                  onFocus={handleChangeToken}
                  handleClickIcon={() => {}}
                  icon={rewardToken ? null : <IoMdArrowDropdown />}
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
                        <span className="truncate font-bold">
                          {rewardToken?.code}
                        </span>
                      </div>
                    )
                  }
                />

                <TokenSelectorModal
                  openTokenSelectorModal={openTokenSelectorModal}
                  setOpenTokenSelectorModal={setOpenTokenSelectorModal}
                  setRewardToken={setRewardToken}
                />

                <CustomInput
                  label="How many token for the winner?"
                  placeholder="eg 50"
                  type="number"
                  error={errors.tokensForWinner?.message}
                  {...register("tokensForWinner")}
                />

                <Label className="flex flex-col items-start gap-2 text-base font-light text-[#09032A] lg:col-span-2">
                  Which conversations do you want to engage in?
                  <Textarea
                    className="h-[96px] rounded-[12px] border-none bg-[#F7F9FD] px-4 text-base placeholder:text-base placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0"
                    placeholder="e.g trending topic about new mobile apps"
                    error={errors.conversation?.message}
                    {...register("conversation")}
                  />
                </Label>

                <div className="lg:col-span-2">
                  <Controller
                    name="sentimentCheck"
                    control={control}
                    defaultValue="Positive"
                    render={({ field }) => (
                      <div className="grid gap-2">
                        <p className="text-base font-light text-[#09032A]">
                          Sentiment Check
                        </p>
                        <RadioGroup
                          value={field.value}
                          onChange={field.onChange}
                          className="flex w-[100%] flex-col items-start justify-between gap-2 sm:flex-row sm:items-center"
                        >
                          {SENTIMENT_CHECK.map((plan) => (
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
                </div>

                <div className="flex items-center gap-3 lg:col-span-2">
                  <Controller
                    name="requireImage"
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
                    Add reference image (3 max)
                  </p>
                </div>

                {watch("requireImage") && (
                  <div className="lg:col-span-2">
                    <Controller
                      name="referenceImages"
                      control={control}
                      render={({ field }) => (
                        <FileUpload
                          onUpload={async (file) => {
                            const response = await uploadBurstImage(file);
                            const urls = response?.data?.content || [];
                            const existingUrls =
                              getItemFromLocalStorage("burstImageUrls") || [];
                            const allUrls = [...existingUrls, ...urls];
                            setItemInLocalStorage("burstImageUrls", allUrls);
                            setImagePreviews(allUrls);
                            field.onChange(allUrls);
                            return response;
                          }}
                          previews={imagePreviews}
                          setPreviews={setImagePreviews}
                          disabled={imagePreviews.length >= 3}
                          error={errors.referenceImages?.message}
                        />
                      )}
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="mt-4 w-full cursor-pointer rounded-md bg-[#2F0FD1] px-8 py-5 text-[16px] font-[300] hover:bg-[#2F0FD1]/70 hover:text-white lg:col-span-2"
                >
                  Continue
                </Button>
              </form>
            </div>
          )}

          {newBurst === "preview" && (
            <div className="space-y-[24px]">
              <div className="flex items-center justify-between gap-4">
                <p className="font-bricolage text-[24px] font-[700] text-[#050215]">
                  Preview Burst
                </p>

                {!burstCreated && (
                  <Button
                    onClick={() => navigate(-1)}
                    className="group cursor-pointer rounded-md bg-[#EDF2FF] px-8 py-5 text-[16px] font-[300] text-[#205CE2] hover:bg-[#2F0FD1] hover:text-white"
                  >
                    Edit Burst
                    <PiNotePencilFill className="text-[#2F0FD1] group-hover:text-white" />
                  </Button>
                )}
              </div>

              <div className="space-y-[16px]">
                <div className="flex items-center justify-between gap-4 text-left">
                  <p className="flex-1 text-[16px] text-[#525866]">
                    Burst Title
                  </p>
                  <p className="flex-2 text-[#050215]">
                    {burstData?.burstTitle || "-"}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 text-left">
                  <p className="flex-1 text-[16px] text-[#48484A]">
                    Social Media Platform
                  </p>
                  <p className="flex-2">{burstData?.platform || "-"}</p>
                </div>

                <div className="flex items-center justify-between gap-4 text-left">
                  <p className="flex-1 text-[16px] text-[#48484A]">
                    Number of Winners
                  </p>
                  <p className="flex-2">
                    {burstData?.numberOfSelections || "-"}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 text-left">
                  <p className="flex-1 text-[16px] text-[#48484A]">
                    Reward Per Winner
                  </p>
                  <p className="flex-2">
                    {burstData?.tokensForWinner} {burstData?.symbol || "XLM"}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 text-left">
                  <p className="flex-1 text-[16px] text-[#48484A]">
                    Conversation Type
                  </p>
                  <p className="flex-2">{burstData?.conversation || "-"}</p>
                </div>

                <div className="flex items-center justify-between gap-4 text-left">
                  <p className="flex-1 text-[16px] text-[#48484A]">
                    Reference Images
                  </p>
                  <div className="flex flex-2 flex-wrap gap-2">
                    {(
                      burstData?.referenceImages ||
                      getItemFromLocalStorage("burstImageUrls") ||
                      []
                    ).map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Reference ${idx + 1}`}
                        className="h-10 w-20 rounded object-cover"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 text-left">
                  <p className="flex-1 text-[16px] text-[#48484A]">
                    Sentiment Check
                  </p>
                  <p className="flex-2">{burstData?.sentimentCheck || "-"}</p>
                </div>
              </div>

              <form
                onSubmit={handleCreateBurst(onSubmitBurst)}
                className="grid gap-5 lg:grid-cols-2"
              >
                <div className="col-span-2 w-full space-y-2">
                  <p className="flex w-full items-center justify-between text-base font-light text-[#09032A]">
                    Burst Time Configuration
                  </p>

                  <Controller
                    name="startDate"
                    control={createBurstControl}
                    render={({ field }) => (
                      <CustomDateSelect
                        startDate={field.value}
                        endDate={createBurstWatch("endDate")}
                        onStartDateChange={field.onChange}
                        onEndDateChange={(date) =>
                          setCreateBurstValue("endDate", date, {
                            shouldValidate: true,
                          })
                        }
                        runContinuously={createBurstWatch("runContinuously")}
                        startDateError={createBurstErrors.startDate?.message}
                        endDateError={createBurstErrors.endDate?.message}
                      />
                    )}
                  />
                </div>

                <div className="col-span-2 w-full lg:col-span-1">
                  <Controller
                    name="trendAge"
                    control={createBurstControl}
                    render={({ field }) => (
                      <CustomSelect
                        // label="Social Media Platform"
                        options={POST_START_TIME}
                        value={field.value}
                        onChange={field.onChange}
                        error={createBurstErrors.trendAge?.message}
                      />
                    )}
                  />
                </div>

                <div className="col-span-2 flex items-center gap-3">
                  <Controller
                    name="autoPostSelected"
                    control={createBurstControl}
                    defaultValue={false}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#2F0FD1]"
                      />
                    )}
                  />

                  <p className="text-[14px] font-[300] text-[#09032A]">
                    Allow Contribute to auto-post the selected entry
                  </p>
                </div>

                <div className="col-span-2 flex items-center gap-3">
                  <Controller
                    name="aiCheckSelected"
                    control={createBurstControl}
                    defaultValue={false}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#2F0FD1]"
                      />
                    )}
                  />

                  <p className="text-[14px] font-[300] text-[#09032A]">
                    Allow context check by AI
                  </p>
                </div>

                {!burstCreated && (
                  <Button
                    type="submit"
                    className="col-span-2 mt-4 w-full cursor-pointer rounded-md bg-[#2F0FD1] px-8 py-5 text-[16px] font-[300] hover:bg-[#2F0FD1]/70 hover:text-white"
                  >
                    Continue
                  </Button>
                )}

                {burstCreated && (
                  <div className="col-span-2 mt-6 space-y-2 rounded-[8px] bg-[#EDF2FF] px-9 py-6">
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-[300] text-[#09032A]">
                          Total Rewards (to be deposited):
                        </p>
                        <p className="text-2xl font-bold text-[#050215]">
                          {burstData?.tokensForWinner}{" "}
                          {burstData?.symbol || "XLM"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className="font-[300] text-[#09032A]">
                          Fees to Charge
                        </p>
                        <p className="text-2xl font-bold text-[#050215]">
                          1.5 {burstData?.symbol || "XLM"}
                        </p>
                      </div>

                      <Button
                        variant="secondary"
                        size="lg"
                        type="button"
                        className="mt-5 w-full"
                        onClick={() => {
                          removeItemFromLocalStorage("burstData");
                          setBurstData(null);
                          removeItemFromLocalStorage("rewardToken");
                          removeItemFromLocalStorage("burstImageUrls");
                          removeItemFromLocalStorage("burstCreated");
                          setImagePreviews([]);
                          setBurstCreated(false);
                          navigate("/burst");
                        }}
                      >
                        Deposit Token
                      </Button>
                    </>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewBurst;
