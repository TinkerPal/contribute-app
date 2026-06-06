import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertCircle,
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

import Badge2 from "@/components/ui/Badge2";
import { useAuth } from "@/hooks/useAuth";

const API_URL = "http://localhost:4000";
const PLATFORM_FEE_PERCENT = 5;

const inputClass =
  "h-11 w-full rounded-xl border border-[#EAECF0] bg-white px-3.5 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]";

const textareaClass =
  "w-full resize-none rounded-xl border border-[#EAECF0] bg-white px-3.5 py-3 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]";

const selectClass =
  "h-11 w-full rounded-xl border border-[#EAECF0] bg-white px-3.5 text-sm text-[#101828] outline-none transition focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]";

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
            ["Winners", winnerCount],
            ["Reward", `${asset} prizes + ${defaultPoints || 500} pts`],
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
  const { accessToken } = useAuth();

  const [pageStep, setPageStep] = useState("form");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");

  const [hashtags, setHashtags] = useState("ContributeFi, Stellar, Web3");
  const [requiredMentions, setRequiredMentions] = useState("");
  const [requiredLinks, setRequiredLinks] = useState("");

  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  const [minFollowers, setMinFollowers] = useState("");
  const [minFollowing, setMinFollowing] = useState("");
  const [minAccountAgeDays, setMinAccountAgeDays] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [allowProtectedAccounts, setAllowProtectedAccounts] = useState(false);

  const [defaultPoints, setDefaultPoints] = useState(500);
  const [asset, setAsset] = useState("USDC");
  const [selectionType, setSelectionType] = useState("random_single");
  const [winnerCount, setWinnerCount] = useState(1);
  const [maxParticipants, setMaxParticipants] = useState("");
  const [prizes, setPrizes] = useState([{ rank: 1, amount: "" }]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  const totalRewardAmount = useMemo(() => {
    return prizes.reduce((sum, prize) => sum + (Number(prize.amount) || 0), 0);
  }, [prizes]);

  const platformFeeAmount = useMemo(() => {
    return (totalRewardAmount * PLATFORM_FEE_PERCENT) / 100;
  }, [totalRewardAmount]);

  const totalAmountDue = useMemo(() => {
    return totalRewardAmount + platformFeeAmount;
  }, [totalRewardAmount, platformFeeAmount]);

  function syncPrizeCount(nextCount) {
    const safeCount = Math.max(1, Number(nextCount) || 1);
    setWinnerCount(safeCount);

    setPrizes((current) =>
      Array.from({ length: safeCount }, (_, index) => ({
        rank: index + 1,
        amount: current[index]?.amount ?? "",
      })),
    );

    if (selectionType === "random_single" && safeCount !== 1) {
      setSelectionType("random_multiple");
    }
  }

  function updatePrizeAmount(index, value) {
    setPrizes((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, amount: value } : item,
      ),
    );

    setPaymentConfirmed(false);
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

    if (selectionType === "random_single" && Number(winnerCount) !== 1) {
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

  function goToReview() {
    const validationMessage = validateForm();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setError("");
    setPageStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function buildPayload() {
    return {
      title: title.trim(),
      description: description.trim(),
      instructions: instructions.trim() || undefined,
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
      reward: {
        defaultPoints: Number(defaultPoints) || 500,
        asset,
        selectionType,
        winnerCount: Number(winnerCount),
        maxParticipants:
          selectionType === "first_come_first_serve"
            ? Number(maxParticipants)
            : undefined,
        prizes: prizes.map((prize, index) => ({
          rank: index + 1,
          amount: Number(prize.amount),
        })),
      },
      metadata: {
        payment: {
          simulated: true,
          platformFeePercent: PLATFORM_FEE_PERCENT,
          totalRewardAmount,
          platformFeeAmount,
          totalAmountDue,
        },
      },
    };
  }

  async function createQuest() {
    if (!paymentConfirmed) {
      setError("Please complete payment before creating the quest.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/twitter-quests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            accessToken || localStorage.getItem("accessToken")
          }`,
        },
        body: JSON.stringify(buildPayload()),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create quest.");
      }

      navigate(`/twitter-quests/${data.quest._id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create quest.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="space-y-4 px-3 py-4">
        <button
          type="button"
          onClick={() =>
            pageStep === "review" ? setPageStep("form") : navigate(-1)
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-4 text-sm font-medium text-[#344054] shadow-sm transition hover:bg-[#F9FAFB]"
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
                <Badge2 tone={pageStep === "review" ? "green" : "blue"}>
                  {pageStep === "review" ? "Review" : "Setup"}
                </Badge2>
              </div>

              <h1 className="mt-2 max-w-4xl text-xl font-semibold tracking-tight text-[#101828] sm:text-2xl">
                {pageStep === "review"
                  ? "Review and fund X Quest"
                  : "Create X Quest"}
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-[#667085]">
                {pageStep === "review"
                  ? "Confirm the quest details, simulate funding, then create the quest."
                  : "Set the brief, timeline, eligibility, and rewards for a public X participation quest."}
              </p>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-[#FCFCFD] px-3 py-2">
              <p className="text-[11px] text-[#667085]">Total due</p>
              <p className="mt-0.5 text-sm font-semibold text-[#101828]">
                {totalAmountDue.toLocaleString()} {asset}
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {[
              ["Status", startAt ? "Scheduled" : "Draft"],
              ["Winners", winnerCount],
              ["Reward asset", asset],
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

        {error ? (
          <div className="flex gap-3 rounded-2xl border border-[#FEE4E2] bg-[#FFFBFA] p-4 text-sm text-[#B42318]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        {pageStep === "review" ? (
          <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
            <div className="space-y-4 rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm sm:p-5">
              <SectionHeader
                icon={CheckCircle2}
                title="Review quest"
                description="Make sure everything is correct before funding and creating this quest."
              />

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Title", title],
                  ["Start", startAt],
                  ["End", endAt],
                  ["Selection", selectionType.replaceAll("_", " ")],
                  ["Winners", winnerCount],
                  ["Asset", asset],
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
                      key={index}
                      className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm"
                    >
                      <span className="text-[#667085]">Rank {index + 1}</span>
                      <span className="font-semibold text-[#101828]">
                        {(Number(prize.amount) || 0).toLocaleString()} {asset}
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
                      {totalRewardAmount.toLocaleString()} {asset}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[#667085]">
                      Platform fee ({PLATFORM_FEE_PERCENT}%)
                    </span>
                    <span className="font-semibold text-[#101828]">
                      {platformFeeAmount.toLocaleString()} {asset}
                    </span>
                  </div>

                  <div className="mt-3 border-t border-[#EAECF0] pt-3">
                    <div className="flex justify-between text-base">
                      <span className="font-semibold text-[#101828]">
                        Total due
                      </span>
                      <span className="font-bold text-[#2F0FD1]">
                        {totalAmountDue.toLocaleString()} {asset}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 -mx-4 -mb-4 border-t border-[#EAECF0] bg-white/95 px-4 py-4 backdrop-blur sm:-mx-5 sm:-mb-5 sm:px-5">
                {!paymentConfirmed ? (
                  <button
                    type="button"
                    onClick={() => setPaymentConfirmed(true)}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#101828] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#1D2939]"
                  >
                    Simulate payment
                    <Coins className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={createQuest}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating quest...
                      </>
                    ) : (
                      <>
                        Create quest
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
              <div className="rounded-2xl border border-[#D1FADF] bg-[#F6FEF9] p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#027A48]" />
                  <h3 className="text-sm font-semibold text-[#101828]">
                    Funding status
                  </h3>
                </div>

                <p className="text-sm leading-6 text-[#667085]">
                  {paymentConfirmed
                    ? "Payment confirmed. You can now create the quest."
                    : "Payment is required before the quest can be created."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPageStep("form")}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#EAECF0] bg-white px-5 text-sm font-medium text-[#344054] shadow-sm transition hover:bg-[#F9FAFB]"
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
                      onChange={(e) => {
                        setStartAt(e.target.value);
                        setPaymentConfirmed(false);
                      }}
                      className={`${inputClass} mt-2`}
                    />
                  </div>

                  <div>
                    <FieldLabel>End date</FieldLabel>
                    <input
                      required
                      type="datetime-local"
                      value={endAt}
                      onChange={(e) => {
                        setEndAt(e.target.value);
                        setPaymentConfirmed(false);
                      }}
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
                        <span className="ml-2 rounded-full bg-[#F2F4F7] px-2 py-0.5 text-[11px] text-[#667085]">
                          Optional
                        </span>
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
                        <span className="ml-2 rounded-full bg-[#F2F4F7] px-2 py-0.5 text-[11px] text-[#667085]">
                          Optional
                        </span>
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
                      value={asset}
                      onChange={(e) => {
                        setAsset(e.target.value);
                        setPaymentConfirmed(false);
                      }}
                      className={`${selectClass} mt-2`}
                    >
                      <option value="USDC">USDC</option>
                      <option value="XLM">XLM</option>
                    </select>
                  </div>

                  <div>
                    <FieldLabel>Selection type</FieldLabel>
                    <select
                      value={selectionType}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectionType(value);
                        setPaymentConfirmed(false);

                        if (value === "random_single") {
                          syncPrizeCount(1);
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
                      type="number"
                      min="1"
                      value={winnerCount}
                      disabled={selectionType === "random_single"}
                      onChange={(e) => {
                        syncPrizeCount(e.target.value);
                        setPaymentConfirmed(false);
                      }}
                      className={`${inputClass} mt-2 disabled:bg-[#F9FAFB] disabled:text-[#98A2B3]`}
                    />
                  </div>

                  {selectionType === "first_come_first_serve" ? (
                    <div>
                      <FieldLabel>Participant limit</FieldLabel>
                      <input
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
                      onClick={() => {
                        syncPrizeCount(Number(winnerCount) + 1);
                        setPaymentConfirmed(false);
                      }}
                      disabled={selectionType === "random_single"}
                      className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-3 text-xs font-medium text-[#344054] shadow-sm transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add winner
                    </button>
                  </div>

                  {prizes.map((prize, index) => (
                    <div
                      key={prize.rank}
                      className="grid gap-3 rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-3 sm:grid-cols-[120px_1fr_44px]"
                    >
                      <div className="flex h-11 items-center rounded-xl bg-white px-3 text-sm font-medium text-[#344054]">
                        Rank {index + 1}
                      </div>

                      <input
                        type="number"
                        min="0"
                        value={prize.amount}
                        onChange={(e) =>
                          updatePrizeAmount(index, e.target.value)
                        }
                        className={inputClass}
                        placeholder={`Prize amount in ${asset}`}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          syncPrizeCount(Number(winnerCount) - 1);
                          setPaymentConfirmed(false);
                        }}
                        disabled={prizes.length === 1}
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
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
                >
                  Continue to review
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            <StickySummary
              title={title}
              startAt={startAt}
              endAt={endAt}
              winnerCount={winnerCount}
              asset={asset}
              defaultPoints={defaultPoints}
              minFollowers={minFollowers}
              minFollowing={minFollowing}
              minAccountAgeDays={minAccountAgeDays}
              verifiedOnly={verifiedOnly}
              allowProtectedAccounts={allowProtectedAccounts}
            />
          </section>
        )}
      </div>
    </main>
  );
}
