import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Networks, nativeToScVal, xdr } from "@stellar/stellar-sdk";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Coins,
  FileText,
  Gift,
  Hash,
  Info,
  Loader2,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Trophy,
} from "lucide-react";
import { useSocketFi } from "@socketfi/react";

import Badge2 from "@/components/ui/Badge2";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import {
  activeFeeAssets,
  escrowContract,
  selectedNetwork,
} from "@/lib/contracts";
import { datetimeLocalToUnixSeconds } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";
import { WalletKitService } from "@/utils/wallet-kit/services/global-service";
import { apiRequest } from "@/api/client";
import { useDispatch, useSelector } from "react-redux";
import { clearSocketfiSession } from "@/store/socketfiAuthSlice";

const PLATFORM_FEE_PERCENT = 10;

const inputClass =
  "h-11 w-full rounded-xl border border-[#EAECF0] bg-white px-3.5 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]";

const textareaClass =
  "w-full resize-none rounded-xl border border-[#EAECF0] bg-white px-3.5 py-3 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]";

const selectClass =
  "h-11 w-full rounded-xl border border-[#EAECF0] bg-white px-3.5 text-sm text-[#101828] outline-none transition focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]";

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

function getDefaultStartAt() {
  return toDateTimeLocal(new Date());
}

function getDefaultEndAt() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return toDateTimeLocal(date);
}

function getAssetByCode(code) {
  return (
    activeFeeAssets?.find((item) => item.code === code) || activeFeeAssets[0]
  );
}

function extractRewardId(res) {
  return (
    res?.data?.resultMetaJson?.v4?.soroban_meta?.return_value?.bytes ||
    res?.data?.resultMetaJson?.v3?.soroban_meta?.return_value?.bytes ||
    res?.data?.resultMetaXdr?.v4?.soroban_meta?.return_value?.bytes ||
    null
  );
}

function FieldLabel({ children, optional }) {
  return (
    <label className="text-sm font-medium text-[#344054]">
      {children}
      {optional ? (
        <span className="ml-2 rounded-full bg-[#F2F4F7] px-2 py-0.5 text-[11px] font-medium text-[#667085]">
          Optional
        </span>
      ) : null}
    </label>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1]">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h2 className="text-base font-semibold text-[#101828]">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-[#667085]">{description}</p>
      </div>
    </div>
  );
}

function StickySummary({
  title,
  startAt,
  endAt,
  winnerCount,
  asset,
  defaultPoints,
  minFollowers,
  minFollowing,
  minAccountAgeDays,
  verifiedOnly,
  allowProtectedAccounts,
  rewardId,
}) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
      <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#2F0FD1]" />
          <h3 className="text-sm font-semibold text-[#101828]">
            Quest summary
          </h3>
        </div>

        <div className="space-y-3">
          {[
            ["Title", title || "Not set"],
            ["Starts", startAt || "Not set"],
            ["Ends", endAt || "Not set"],
            ["Winners", winnerCount || 1],
            ["Reward", `${asset} prizes + ${defaultPoints || 500} pts`],
            ["Funding", rewardId ? "Confirmed" : "Pending"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-[#F8FAFC] px-3 py-2">
              <p className="text-[11px] text-[#667085]">{label}</p>
              <p className="mt-0.5 truncate text-sm font-semibold text-[#101828]">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Info className="h-4 w-4 text-[#2F0FD1]" />
          <h3 className="text-sm font-semibold text-[#101828]">
            Eligibility rules
          </h3>
        </div>

        <div className="space-y-3">
          {[
            `Minimum followers: ${minFollowers || 0}`,
            `Minimum following: ${minFollowing || 0}`,
            `Account age: ${minAccountAgeDays || 0} days`,
            verifiedOnly
              ? "Verified accounts only"
              : "Verification not required",
            allowProtectedAccounts
              ? "Protected accounts allowed"
              : "Public accounts recommended",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl bg-[#F8FAFC] px-3 py-2 text-sm text-[#667085]"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#027A48]" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-[#2F0FD1]" />
          <h3 className="text-sm font-semibold text-[#101828]">Prize rules</h3>
        </div>

        <p className="text-sm leading-6 text-[#667085]">
          Higher-ranked winners must receive an amount greater than or equal to
          lower-ranked winners. Equal rewards are allowed.
        </p>
      </div>
    </aside>
  );
}

export default function CreateXQuestPage() {
  const navigate = useNavigate();
  const { questId } = useParams();
  const { accessToken, user } = useAuth();
  const { openAuthModal, publicKey } = useWallet();

  const isExistingQuest = Boolean(questId);

  const [pageStep, setPageStep] = useState("form");
  const [loadingQuest, setLoadingQuest] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [draftQuestId, setDraftQuestId] = useState(questId || null);
  const [rewardId, setRewardId] = useState(null);
  const [questStatus, setQuestStatus] = useState("draft");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");

  const [hashtags, setHashtags] = useState("ContributeFi, Stellar, Web3");
  const [requiredMentions, setRequiredMentions] = useState("");
  const [requiredLinks, setRequiredLinks] = useState("");

  const [startAt, setStartAt] = useState(getDefaultStartAt);
  const [endAt, setEndAt] = useState(getDefaultEndAt);

  const [minFollowers, setMinFollowers] = useState("");
  const [minFollowing, setMinFollowing] = useState("");
  const [minAccountAgeDays, setMinAccountAgeDays] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [allowProtectedAccounts, setAllowProtectedAccounts] = useState(false);

  const [defaultPoints, setDefaultPoints] = useState(500);
  const [asset, setAsset] = useState(activeFeeAssets[0]);
  const [selectionType, setSelectionType] = useState("random_single");
  const [winnerCount, setWinnerCount] = useState("1");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [prizes, setPrizes] = useState([{ rank: 1, amount: "" }]);
  const [questFee, setQuestFee] = useState(null);

  const isDraft = questStatus === "draft";
  const paymentConfirmed = Boolean(rewardId);
  const rewardConfigLocked = Boolean(rewardId);
  const isBusy = savingDraft || processingPayment || submitting;
  const socketfi = useSocketFi();

  const parsedHashtags = useMemo(
    () =>
      hashtags
        .split(",")
        .map((tag) => tag.trim().replace(/^#/, ""))
        .filter(Boolean),
    [hashtags],
  );

  const parsedMentions = useMemo(
    () =>
      requiredMentions
        .split(",")
        .map((item) => item.trim().replace(/^@/, ""))
        .filter(Boolean),
    [requiredMentions],
  );

  const parsedLinks = useMemo(
    () =>
      requiredLinks
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [requiredLinks],
  );

  const normalizedWinnerCount = useMemo(() => {
    return Math.max(1, Number(winnerCount) || 1);
  }, [winnerCount]);

  const totalRewardAmount = useMemo(() => {
    return prizes.reduce((sum, prize) => sum + (Number(prize.amount) || 0), 0);
  }, [prizes]);

  const platformFeeAmount = useMemo(() => {
    return (totalRewardAmount * PLATFORM_FEE_PERCENT) / 100;
  }, [totalRewardAmount]);

  const totalAmountDue = useMemo(() => {
    return totalRewardAmount + platformFeeAmount;
  }, [totalRewardAmount, platformFeeAmount]);

  function markDraftChanged() {
    if (!paymentConfirmed) return;
  }

  function syncPrizeCount(nextCount) {
    const safeCount = Math.max(1, Number(nextCount) || 1);

    setWinnerCount(String(safeCount));

    setPrizes((current) =>
      Array.from({ length: safeCount }, (_, index) => ({
        rank: index + 1,
        amount: current[index]?.amount ?? "",
      })),
    );
  }

  useEffect(() => {
    async function fetchFee() {
      console.log("the ran fee 1");
      const data = await apiRequest({
        resource: "/api/soroban/any-read",
        method: "POST",
        token: accessToken || localStorage.getItem("accessToken"),
        body: {
          contractId: escrowContract,
          callFunction: {
            name: "get_fee",
            inputs: [{ value: asset.contract, type: "scSpecTypeAddress" }],
          },
        },
      });

      setQuestFee(data?.result?.i128);
    }

    fetchFee();
  }, [escrowContract, asset.contract]);

  function handleWinnerCountChange(value) {
    setWinnerCount(value);

    if (value === "") return;

    const nextCount = Math.max(1, Number(value) || 1);

    setPrizes((current) =>
      Array.from({ length: nextCount }, (_, index) => ({
        rank: index + 1,
        amount: current[index]?.amount ?? "",
      })),
    );

    markDraftChanged();
  }

  function handleWinnerCountBlur() {
    const safeCount = Math.max(1, Number(winnerCount) || 1);
    syncPrizeCount(safeCount);
  }

  function updatePrizeAmount(index, value) {
    setPrizes((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, amount: value } : item,
      ),
    );

    markDraftChanged();
  }

  function removePrize(indexToRemove) {
    setPrizes((current) => {
      if (current.length <= 1) return current;

      const next = current
        .filter((_, index) => index !== indexToRemove)
        .map((item, index) => ({
          ...item,
          rank: index + 1,
        }));

      setWinnerCount(String(next.length));

      return next;
    });

    markDraftChanged();
  }

  function addPrize() {
    setPrizes((current) => {
      const next = [
        ...current,
        {
          rank: current.length + 1,
          amount: "",
        },
      ];

      setWinnerCount(String(next.length));

      return next;
    });

    if (selectionType === "random_single") {
      setSelectionType("random_multiple");
    }

    markDraftChanged();
  }

  function validateForm() {
    if (!title.trim()) return "Quest title is required.";
    if (!description.trim()) return "Quest description is required.";
    if (!startAt) return "Start date is required.";
    if (!endAt) return "End date is required.";

    const start = new Date(startAt);
    const end = new Date(endAt);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return "Please provide valid start and end dates.";
    }

    if (end <= start) return "End date must be after start date.";

    if (selectionType === "random_single" && normalizedWinnerCount !== 1) {
      return "Single winner quests must have exactly one winner.";
    }

    if (selectionType === "first_come_first_serve" && !maxParticipants) {
      return "First come, first serve quests require a participant limit.";
    }

    const normalizedPrizes = prizes.map((prize) => Number(prize.amount));

    if (normalizedPrizes.some((amount) => Number.isNaN(amount) || amount < 0)) {
      return "Every prize must be a valid amount.";
    }

    if (totalRewardAmount <= 0) {
      return "Total reward amount must be greater than zero.";
    }

    for (let i = 1; i < normalizedPrizes.length; i += 1) {
      if (normalizedPrizes[i] > normalizedPrizes[i - 1]) {
        return "Lower-ranked prizes cannot be greater than higher-ranked prizes.";
      }
    }

    return "";
  }

  function buildPayload(nextRewardId = rewardId) {
    return {
      title: title.trim(),
      description: description.trim(),
      instructions: instructions.trim() || undefined,
      rewardId: nextRewardId || null,
      hashtags: parsedHashtags,
      requiredMentions: parsedMentions,
      requiredLinks: parsedLinks,
      startAt: new Date(startAt).toISOString(),
      endAt: new Date(endAt).toISOString(),
      eligibility: {
        minFollowers: Number(minFollowers) || 0,
        minFollowing: Number(minFollowing) || 0,
        minAccountAgeDays: Number(minAccountAgeDays) || 0,
        verifiedOnly,
        allowProtectedAccounts,
      },
      reward: rewardConfigLocked
        ? undefined
        : {
            defaultPoints: Number(defaultPoints) || 500,
            asset: asset?.code,
            selectionType,
            winnerCount: normalizedWinnerCount,
            maxParticipants:
              selectionType === "first_come_first_serve"
                ? Number(maxParticipants)
                : undefined,
            prizes: prizes.map((prize, index) => ({
              rank: index + 1,
              amount: Number(prize.amount),
            })),
          },
      // reward: {
      //   defaultPoints: Number(defaultPoints) || 500,
      //   asset: asset?.code,
      //   selectionType,
      //   winnerCount: normalizedWinnerCount,
      //   maxParticipants:
      //     selectionType === "first_come_first_serve"
      //       ? Number(maxParticipants)
      //       : undefined,
      //   prizes: prizes.map((prize, index) => ({
      //     rank: index + 1,
      //     amount: Number(prize.amount),
      //   })),
      // },
      metadata: {
        payment: {
          platformFeePercent: PLATFORM_FEE_PERCENT,
          totalRewardAmount,
          platformFeeAmount,
          totalAmountDue,
        },
      },
    };
  }

  async function saveDraft(nextRewardId = rewardId) {
    const validationMessage = validateForm();

    if (validationMessage) {
      throw new Error(validationMessage);
    }

    const token = accessToken || localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Please sign in before saving this quest.");
    }

    const currentDraftId = draftQuestId || questId;

    const resource = currentDraftId
      ? `/api/twitter-quests/${currentDraftId}/draft`
      : "/api/twitter-quests/drafts";

    const method = currentDraftId ? "PATCH" : "POST";

    const data = await apiRequest({
      resource,
      method,
      token,
      body: buildPayload(nextRewardId),
    });

    const quest = data.quest;

    setDraftQuestId(quest._id);
    setRewardId(quest.rewardId || null);
    setQuestStatus(quest.status || "draft");

    return quest;
  }

  async function goToReview() {
    try {
      setSavingDraft(true);

      const quest = await saveDraft();

      setPageStep("review");
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (!questId && quest?._id) {
        navigate(`/quests/create/${quest._id}`, { replace: true });
      }

      toast.success("Draft saved.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save draft.",
      );
    } finally {
      setSavingDraft(false);
    }
  }

  const dispatch = useDispatch();
  // dispatch(clearSocketfiSession());

  async function handleDepositQuestEscrow() {
    try {
      const validationMessage = validateForm();

      if (validationMessage) {
        toast.error(validationMessage);
        return;
      }

      if (!walletIsConnected) {
        openAuthModal();
        return;
      }

      setProcessingPayment(true);

      const draft = await saveDraft();

      const token = accessToken || localStorage.getItem("accessToken");

      const rewards = prizes.map((prize) =>
        String(Math.round(Number(prize.amount) * 1e7)),
      );

      let submitResponse;

      if (publicKey) {
        const args = [
          nativeToScVal(questId, { type: "string" }),
          nativeToScVal(user?._id, { type: "string" }),
          nativeToScVal("x", { type: "string" }),
          nativeToScVal(publicKey, { type: "address" }),
          nativeToScVal(asset?.contract, { type: "address" }),
          nativeToScVal(String(Math.round(totalRewardAmount * 1e7)), {
            type: "i128",
          }),
          nativeToScVal(rewards, { type: "i128" }),
          nativeToScVal(asset?.contract, { type: "address" }),
          nativeToScVal(datetimeLocalToUnixSeconds(startAt), { type: "u64" }),
          nativeToScVal(datetimeLocalToUnixSeconds(endAt), { type: "u64" }),
        ];

        const argsXdr = args.map((arg) => arg.toXDR("base64"));

        const xdrResponse = await apiRequest({
          resource: "/api/soroban/any-invoke-xdr",
          method: "POST",
          token,
          body: {
            pubKey: publicKey,
            contractId: escrowContract,
            functionName: "deposit_reward_escrow",
            argsXdr,
          },
        });

        const signedTx = await WalletKitService.signTx(xdrResponse.xdr, {
          network: selectedNetwork,
          networkPassphrase: Networks[selectedNetwork],
        });

        submitResponse = await apiRequest({
          resource: "/api/soroban/submit-transaction",
          method: "POST",
          token,
          body: {
            signedTx,
            network: selectedNetwork,
          },
        });
      } else if (socketfiAccessToken) {
        const dappArgs = nativeToScVal(
          [
            nativeToScVal(questId, { type: "string" }),
            nativeToScVal(user?._id, { type: "string" }),
            nativeToScVal("x", { type: "string" }),
            nativeToScVal(userProfile?.address?.TESTNET, { type: "address" }),
            nativeToScVal(asset?.contract, { type: "address" }),
            nativeToScVal(String(Math.round(totalRewardAmount * 1e7)), {
              type: "i128",
            }),
            nativeToScVal(rewards, { type: "i128" }),
            nativeToScVal(asset?.contract, { type: "address" }),
            nativeToScVal(datetimeLocalToUnixSeconds(startAt), { type: "u64" }),
            nativeToScVal(datetimeLocalToUnixSeconds(endAt), { type: "u64" }),
          ],
          { type: "vec" },
        );

        const feePreference = { asset: asset?.contract, max: "10000000" };

        const authArgs = nativeToScVal(
          [
            xdr.ScVal.scvMap([
              new xdr.ScMapEntry({
                key: xdr.ScVal.scvString("args"),
                val: xdr.ScVal.scvVec([
                  nativeToScVal(userProfile?.address?.TESTNET, {
                    type: "address",
                  }),
                  nativeToScVal(escrowContract, { type: "address" }),
                  nativeToScVal(
                    String(
                      Math.round(totalRewardAmount * 1e7) + Number(questFee),
                    ),
                    {
                      type: "i128",
                    },
                  ),
                ]),
              }),
              new xdr.ScMapEntry({
                key: xdr.ScVal.scvString("contract"),
                val: nativeToScVal(asset.contract, { type: "address" }),
              }),
              new xdr.ScMapEntry({
                key: xdr.ScVal.scvString("func"),
                val: xdr.ScVal.scvSymbol("transfer"),
              }),
            ]),
          ],
          { type: "vec" },
        );

        // const argsXdr = args.map((arg) => arg.toXDR("base64"));
        const args = [
          nativeToScVal(escrowContract, { type: "address" }),
          nativeToScVal("deposit_reward_escrow", { type: "symbol" }),
          dappArgs,
          authArgs,
        ];

        const argsXdr = args.map((arg) => arg.toXDR("base64"));
        // const argsXdr = vecScVal.toXDR("base64");

        submitResponse = await socketfi.requestTransaction({
          contractId: userProfile?.address?.TESTNET,
          callFunction: { name: "dapp_invoker" },
          argsXdr: argsXdr,
          accessToken: socketfiAccessToken,
          feePreference: feePreference,
        });

        console.log("the tx response for this is ", submitResponse);
      }

      if (submitResponse) {
        const nextRewardId = extractRewardId(submitResponse);
        if (!nextRewardId) {
          throw new Error("Payment succeeded, but reward ID was not returned.");
        }

        const updatedDraft = await saveDraft(nextRewardId);

        setRewardId(updatedDraft.rewardId || nextRewardId);
        setDraftQuestId(draft?._id || updatedDraft._id);
      }

      toast.success("Payment confirmed. You can now publish this quest.");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Payment could not be completed.",
      );
    } finally {
      setProcessingPayment(false);
    }
  }

  async function publishQuest() {
    const currentDraftId = draftQuestId || questId;

    if (!currentDraftId) {
      toast.error("Please save this quest before publishing.");
      return;
    }

    if (!rewardId) {
      toast.error("Payment is required before publishing.");
      return;
    }

    try {
      setSubmitting(true);

      const token = accessToken || localStorage.getItem("accessToken");

      const data = await apiRequest({
        resource: `/api/twitter-quests/${currentDraftId}/publish`,
        method: "PATCH",
        token,
      });

      toast.success("Quest published successfully.");
      navigate(`/quests/${data.quest?._id || currentDraftId}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to publish quest.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (!isExistingQuest) return;

    let isMounted = true;

    async function fetchQuestForEdit() {
      try {
        setLoadingQuest(true);

        const token = accessToken || localStorage.getItem("accessToken");

        const data = await apiRequest({
          resource: `/api/twitter-quests/${questId}`,
          method: "GET",
          token,
        });

        if (!data.success) {
          throw new Error(data.message || "Failed to load quest.");
        }

        if (!data.isCreator) {
          toast.error("You can only edit quests you created.");
          navigate(`/quests/${questId}`);
          return;
        }

        const quest = data.quest;

        if (!quest) {
          throw new Error("Quest not found.");
        }

        const hasStarted =
          quest.status !== "draft" &&
          quest.startAt &&
          new Date() >= new Date(quest.startAt);

        if (hasStarted) {
          toast.error("This quest has already started and cannot be edited.");
          navigate(`/quests/${questId}`);
          return;
        }

        if (!isMounted) return;

        setDraftQuestId(quest._id);
        setRewardId(quest.rewardId || null);
        setQuestStatus(quest.status || "draft");

        setTitle(quest.title || "");
        setDescription(quest.description || "");
        setInstructions(quest.instructions || "");

        setHashtags((quest.hashtags || []).join(", "));
        setRequiredMentions((quest.requiredMentions || []).join(", "));
        setRequiredLinks((quest.requiredLinks || []).join(", "));

        setStartAt(toDateTimeLocal(quest.startAt) || getDefaultStartAt());
        setEndAt(toDateTimeLocal(quest.endAt) || getDefaultEndAt());

        setMinFollowers(
          quest.eligibility?.minFollowers
            ? String(quest.eligibility.minFollowers)
            : "",
        );
        setMinFollowing(
          quest.eligibility?.minFollowing
            ? String(quest.eligibility.minFollowing)
            : "",
        );
        setMinAccountAgeDays(
          quest.eligibility?.minAccountAgeDays
            ? String(quest.eligibility.minAccountAgeDays)
            : "",
        );
        setVerifiedOnly(Boolean(quest.eligibility?.verifiedOnly));
        setAllowProtectedAccounts(
          Boolean(quest.eligibility?.allowProtectedAccounts),
        );

        setDefaultPoints(Number(quest.reward?.defaultPoints || 500));
        setAsset(getAssetByCode(quest.reward?.asset));
        setSelectionType(quest.reward?.selectionType || "random_single");
        setWinnerCount(String(quest.reward?.winnerCount || 1));
        setMaxParticipants(
          quest.reward?.maxParticipants
            ? String(quest.reward.maxParticipants)
            : "",
        );

        setPrizes(
          quest.reward?.prizes?.length
            ? quest.reward.prizes.map((prize, index) => ({
                rank: Number(prize.rank || index + 1),
                amount:
                  prize.amount || prize.amount === 0
                    ? String(prize.amount)
                    : "",
              }))
            : [{ rank: 1, amount: "" }],
        );

        if (quest.status === "draft") {
          setPageStep("review");
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load quest.",
        );
        navigate("/quests");
      } finally {
        if (isMounted) {
          setLoadingQuest(false);
        }
      }
    }

    fetchQuestForEdit();

    return () => {
      isMounted = false;
    };
  }, [isExistingQuest, questId, accessToken, navigate]);

  const socketfiAccessToken = useSelector(
    (state) => state.socketfiAuth.accessToken,
  );
  const userProfile = useSelector((state) => state.socketfiAuth.userProfile);

  // console.log("the user profile is", userProfile?.address?.TESTNET);

  const walletIsConnected = !!publicKey || socketfiAccessToken;

  if (loadingQuest) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] px-3 py-4">
        <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-[#EAECF0] bg-white p-8 shadow-sm">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[#2F0FD1]" />
            <p className="text-sm font-medium text-[#344054]">
              Loading quest...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="space-y-4 px-3 py-4">
        <button
          type="button"
          disabled={isBusy}
          onClick={() =>
            pageStep === "review" ? setPageStep("form") : navigate(-1)
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-4 text-sm font-medium text-[#344054] shadow-sm transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ArrowLeft className="h-4 w-4" />
          {pageStep === "review" ? "Edit quest details" : "Back"}
        </button>

        <section className="rounded-2xl border border-[#EAECF0] bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge2 tone="blue">X Quest</Badge2>
                <Badge2 tone="purple">Creator</Badge2>
                <Badge2 tone={paymentConfirmed ? "green" : "blue"}>
                  {paymentConfirmed ? "Funded" : "Draft"}
                </Badge2>
                <Badge2 tone={pageStep === "review" ? "green" : "blue"}>
                  {pageStep === "review" ? "Review" : "Setup"}
                </Badge2>
              </div>

              <h1 className="mt-2 max-w-4xl text-xl font-semibold tracking-tight text-[#101828] sm:text-2xl">
                {pageStep === "review"
                  ? paymentConfirmed
                    ? "Review and publish X Quest"
                    : "Review and fund X Quest"
                  : "Create X Quest"}
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-[#667085]">
                {pageStep === "review"
                  ? paymentConfirmed
                    ? "Payment is confirmed. Publish when the quest details are ready."
                    : "Review the details, fund the reward escrow, then publish the quest."
                  : "Set the brief, timeline, eligibility, and rewards for a public X participation quest."}
              </p>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-[#FCFCFD] px-3 py-2">
              <p className="text-[11px] text-[#667085]">Total due</p>
              <p className="mt-0.5 text-sm font-semibold text-[#101828]">
                {totalAmountDue.toLocaleString()} {asset?.code}
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {[
              ["Status", paymentConfirmed ? "Funded draft" : "Draft"],
              ["Winners", normalizedWinnerCount],
              ["Reward asset", asset?.code],
              ["Selection", selectionType.replaceAll("_", " ")],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-[#F2F4F7] bg-[#FCFCFD] px-3 py-2"
              >
                <p className="text-[11px] text-[#667085]">{label}</p>
                <p className="mt-0.5 text-sm font-semibold text-[#101828] capitalize">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {pageStep === "review" ? (
          <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
            <div className="space-y-4 rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm sm:p-5">
              <SectionHeader
                icon={CheckCircle2}
                title="Review quest"
                description="Confirm the quest details before funding or publishing."
              />

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Title", title],
                  ["Start", startAt],
                  ["End", endAt],
                  ["Selection", selectionType.replaceAll("_", " ")],
                  ["Winners", normalizedWinnerCount],
                  ["Asset", asset?.code],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4"
                  >
                    <p className="text-[11px] text-[#667085]">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-[#101828]">
                      {value || "Not set"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
                <h3 className="text-sm font-semibold text-[#101828]">
                  Description
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  {description}
                </p>
              </div>

              <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
                <h3 className="text-sm font-semibold text-[#101828]">
                  Prize breakdown
                </h3>

                <div className="mt-3 space-y-2">
                  {prizes.map((prize, index) => (
                    <div
                      key={prize.rank}
                      className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm"
                    >
                      <span className="text-[#667085]">Rank {index + 1}</span>
                      <span className="font-semibold text-[#101828]">
                        {(Number(prize.amount) || 0).toLocaleString()}{" "}
                        {asset?.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
                <h3 className="text-sm font-semibold text-[#101828]">
                  Payment summary
                </h3>

                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#667085]">Total rewards</span>
                    <span className="font-semibold text-[#101828]">
                      {totalRewardAmount.toLocaleString()} {asset?.code}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[#667085]">
                      Platform fee ({PLATFORM_FEE_PERCENT}%)
                    </span>
                    <span className="font-semibold text-[#101828]">
                      {platformFeeAmount.toLocaleString()} {asset?.code}
                    </span>
                  </div>

                  <div className="mt-3 border-t border-[#EAECF0] pt-3">
                    <div className="flex justify-between text-base">
                      <span className="font-semibold text-[#101828]">
                        Total due
                      </span>
                      <span className="font-bold text-[#2F0FD1]">
                        {totalAmountDue.toLocaleString()} {asset?.code}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 -mx-4 -mb-4 border-t border-[#EAECF0] bg-white/95 px-4 py-4 backdrop-blur sm:-mx-5 sm:-mb-5 sm:px-5">
                {!paymentConfirmed ? (
                  walletIsConnected ? (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={handleDepositQuestEscrow}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#101828] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#1D2939] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
                    >
                      {processingPayment ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing payment...
                        </>
                      ) : savingDraft ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving draft...
                        </>
                      ) : (
                        <>
                          Fund reward escrow
                          <Coins className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={openAuthModal}
                      // onClick={() =>
                      //   socketfi.requestTransaction({
                      //     contractId: "testing",
                      //     callFunction: { name: "test_invoke" },
                      //     accessToken: socketfiAccessToken,
                      //   })
                      // }
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#101828] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#1D2939] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
                    >
                      Connect wallet
                      <Coins className="h-4 w-4" />
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={publishQuest}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Publishing quest...
                      </>
                    ) : (
                      <>
                        Publish quest
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
              <div
                className={`rounded-2xl border p-5 shadow-sm ${
                  paymentConfirmed
                    ? "border-[#D1FADF] bg-[#F6FEF9]"
                    : "border-[#FEF0C7] bg-[#FFFCF5]"
                }`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2
                    className={`h-4 w-4 ${
                      paymentConfirmed ? "text-[#027A48]" : "text-[#B54708]"
                    }`}
                  />
                  <h3 className="text-sm font-semibold text-[#101828]">
                    Funding status
                  </h3>
                </div>

                <p className="text-sm leading-6 text-[#667085]">
                  {paymentConfirmed
                    ? "Payment is confirmed. You can publish this quest."
                    : "Payment is required before this quest can be published."}
                </p>
              </div>

              <button
                type="button"
                disabled={isBusy}
                onClick={() => setPageStep("form")}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#EAECF0] bg-white px-5 text-sm font-medium text-[#344054] shadow-sm transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Edit quest details
              </button>
            </aside>
          </section>
        ) : (
          <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                goToReview();
              }}
              className="space-y-4 rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm sm:p-5"
            >
              <section className="rounded-2xl border border-[#EAECF0] bg-white p-4">
                <SectionHeader
                  icon={FileText}
                  title="Quest details"
                  description="Describe what participants should post and what the quest is about."
                />

                <div className="grid gap-4">
                  <div>
                    <FieldLabel>Quest title</FieldLabel>
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`${inputClass} mt-2`}
                      placeholder="Post about Contribute.fi"
                    />
                  </div>

                  <div>
                    <FieldLabel>Description</FieldLabel>
                    <textarea
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`${textareaClass} mt-2`}
                      placeholder="Explain the goal of this quest..."
                    />
                  </div>

                  <div>
                    <FieldLabel optional>Instructions</FieldLabel>
                    <textarea
                      rows={4}
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className={`${textareaClass} mt-2`}
                      placeholder="Mention any tone, talking points, or content rules..."
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-[#EAECF0] bg-white p-4">
                <SectionHeader
                  icon={Hash}
                  title="Post requirements"
                  description="Add required hashtags, mentions, and links participants should include."
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <FieldLabel>Required hashtags</FieldLabel>
                    <input
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      className={`${inputClass} mt-2`}
                      placeholder="ContributeFi, Stellar, Web3"
                    />
                  </div>

                  <div>
                    <FieldLabel optional>Required mentions</FieldLabel>
                    <input
                      value={requiredMentions}
                      onChange={(e) => setRequiredMentions(e.target.value)}
                      className={`${inputClass} mt-2`}
                      placeholder="contributefi, stellarorg"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FieldLabel optional>Required links</FieldLabel>
                    <input
                      value={requiredLinks}
                      onChange={(e) => setRequiredLinks(e.target.value)}
                      className={`${inputClass} mt-2`}
                      placeholder="https://contribute.fi"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-[#EAECF0] bg-white p-4">
                <SectionHeader
                  icon={CalendarDays}
                  title="Timeline"
                  description="Schedule when the quest starts and closes."
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <FieldLabel>Start date</FieldLabel>
                    <input
                      required
                      type="datetime-local"
                      value={startAt}
                      onChange={(e) => setStartAt(e.target.value)}
                      className={`${inputClass} mt-2`}
                    />
                  </div>

                  <div>
                    <FieldLabel>End date</FieldLabel>
                    <input
                      required
                      type="datetime-local"
                      value={endAt}
                      onChange={(e) => setEndAt(e.target.value)}
                      className={`${inputClass} mt-2`}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-[#EAECF0] bg-white p-4">
                <SectionHeader
                  icon={ShieldCheck}
                  title="Participant restrictions"
                  description="Optional rules to reduce spam and improve participant quality."
                />

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <FieldLabel optional>Minimum followers</FieldLabel>
                    <input
                      type="number"
                      min="0"
                      value={minFollowers}
                      onChange={(e) => setMinFollowers(e.target.value)}
                      className={`${inputClass} mt-2`}
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <FieldLabel optional>Minimum following</FieldLabel>
                    <input
                      type="number"
                      min="0"
                      value={minFollowing}
                      onChange={(e) => setMinFollowing(e.target.value)}
                      className={`${inputClass} mt-2`}
                      placeholder="20"
                    />
                  </div>

                  <div>
                    <FieldLabel optional>Account age in days</FieldLabel>
                    <input
                      type="number"
                      min="0"
                      value={minAccountAgeDays}
                      onChange={(e) => setMinAccountAgeDays(e.target.value)}
                      className={`${inputClass} mt-2`}
                      placeholder="90"
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-start gap-3 rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="mt-1"
                    />
                    <span>
                      <span className="block text-sm font-medium text-[#344054]">
                        Verified accounts only
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#667085]">
                        Restrict participation to verified X accounts.
                      </span>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
                    <input
                      type="checkbox"
                      checked={allowProtectedAccounts}
                      onChange={(e) =>
                        setAllowProtectedAccounts(e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      <span className="block text-sm font-medium text-[#344054]">
                        Allow protected accounts
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#667085]">
                        Protected accounts may be harder to verify publicly.
                      </span>
                    </span>
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-[#EAECF0] bg-white p-4">
                <SectionHeader
                  icon={Gift}
                  title="Rewards"
                  description="Set points and token rewards for winners."
                />
                {rewardConfigLocked ? (
                  <div className="mb-4 rounded-2xl border border-[#D1FADF] bg-[#F6FEF9] px-4 py-3">
                    <p className="text-sm font-medium text-[#027A48]">
                      Reward funding is confirmed.
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#667085]">
                      Reward asset, winner count, selection type, and prize
                      amounts are locked. You can still update the quest
                      details, timeline, post requirements, and eligibility
                      rules before publishing.
                    </p>
                  </div>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <FieldLabel>Participant points</FieldLabel>
                    <input
                      type="number"
                      min="0"
                      value={defaultPoints}
                      onChange={(e) => setDefaultPoints(e.target.value)}
                      className={`${inputClass} mt-2`}
                    />
                  </div>

                  <div>
                    <FieldLabel>Reward asset</FieldLabel>
                    <select
                      disabled={rewardConfigLocked}
                      value={asset?.code}
                      onChange={(e) => setAsset(getAssetByCode(e.target.value))}
                      className={`${selectClass} mt-2`}
                    >
                      {activeFeeAssets?.map((item) => (
                        <option key={item?.contract} value={item?.code}>
                          {item?.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <FieldLabel>Selection type</FieldLabel>
                    <select
                      disabled={rewardConfigLocked}
                      value={selectionType}
                      onChange={(e) => {
                        const value = e.target.value;

                        setSelectionType(value);

                        if (value === "random_single") {
                          syncPrizeCount(1);
                        }

                        if (
                          value === "random_multiple" &&
                          normalizedWinnerCount < 2
                        ) {
                          syncPrizeCount(2);
                        }
                      }}
                      className={`${selectClass} mt-2`}
                    >
                      <option value="random_single">
                        Random single winner
                      </option>
                      <option value="random_multiple">
                        Random multiple winners
                      </option>
                      <option value="first_come_first_serve">
                        First come, first serve
                      </option>
                    </select>
                  </div>

                  <div>
                    <FieldLabel>Winner count</FieldLabel>
                    <input
                      // disabled={rewardConfigLocked}
                      type="number"
                      min={selectionType === "random_multiple" ? 2 : 1}
                      value={winnerCount}
                      disabled={
                        selectionType === "random_single" || rewardConfigLocked
                      }
                      onChange={(e) => handleWinnerCountChange(e.target.value)}
                      onBlur={handleWinnerCountBlur}
                      className={`${inputClass} mt-2 disabled:bg-[#F9FAFB] disabled:text-[#98A2B3]`}
                    />
                  </div>

                  {selectionType === "first_come_first_serve" ? (
                    <div>
                      <FieldLabel>Participant limit</FieldLabel>
                      <input
                        disabled={rewardConfigLocked}
                        type="number"
                        min="1"
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(e.target.value)}
                        className={`${inputClass} mt-2`}
                        placeholder="10"
                      />
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-[#101828]">
                      Prize breakdown
                    </h3>

                    <button
                      type="button"
                      onClick={addPrize}
                      disabled={
                        selectionType === "random_single" || rewardConfigLocked
                      }
                      className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-3 text-xs font-medium text-[#344054] shadow-sm transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add winner
                    </button>
                  </div>

                  {prizes.map((prize, index) => (
                    <div
                      key={`${prize.rank}-${index}`}
                      className="grid gap-3 rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-3 sm:grid-cols-[120px_1fr_44px]"
                    >
                      <div className="flex h-11 items-center rounded-xl bg-white px-3 text-sm font-medium text-[#344054]">
                        Rank {index + 1}
                      </div>

                      <input
                        type="number"
                        min="0"
                        step="0.0000001"
                        disabled={rewardConfigLocked}
                        value={prize.amount}
                        onChange={(e) =>
                          updatePrizeAmount(index, e.target.value)
                        }
                        className={inputClass}
                        placeholder={`Prize amount in ${asset?.code}`}
                      />

                      <button
                        type="button"
                        onClick={() => removePrize(index)}
                        disabled={
                          rewardConfigLocked ||
                          prizes.length === 1 ||
                          selectionType === "random_single"
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#EAECF0] bg-white text-[#667085] transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <div className="sticky bottom-0 -mx-4 -mb-4 border-t border-[#EAECF0] bg-white/95 px-4 py-4 backdrop-blur sm:-mx-5 sm:-mb-5 sm:px-5">
                <button
                  type="submit"
                  disabled={isBusy}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
                >
                  {savingDraft ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving draft...
                    </>
                  ) : (
                    <>
                      Continue to review
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <StickySummary
              title={title}
              startAt={startAt}
              endAt={endAt}
              winnerCount={normalizedWinnerCount}
              asset={asset?.code}
              defaultPoints={defaultPoints}
              minFollowers={minFollowers}
              minFollowing={minFollowing}
              minAccountAgeDays={minAccountAgeDays}
              verifiedOnly={verifiedOnly}
              allowProtectedAccounts={allowProtectedAccounts}
              rewardId={rewardId}
            />
          </section>
        )}
      </div>
    </main>
  );
}
