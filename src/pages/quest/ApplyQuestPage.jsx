import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  Link2,
  Loader2,
  Send,
  Sparkles,
  Wand2,
} from "lucide-react";

import Badge2 from "@/components/ui/Badge2";
import { BsTwitterX } from "react-icons/bs";
import { useAuth } from "@/hooks/useAuth";

const API_URL = "http://localhost:4000";

const PLACEHOLDER_REFERENCE_TWEET_URL =
  "https://x.com/Socket_Fi/status/2050208626569069018?s=20";

const inputClass =
  "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:ring-4";

const textareaClass =
  "w-full resize-none rounded-xl border border-[#EAECF0] bg-white px-3.5 py-3 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]";

function isValidXPostUrl(value) {
  return /^https?:\/\/(www\.)?(x|twitter)\.com\/[^/]+\/status\/\d+/i.test(
    value.trim(),
  );
}

function formatDate(value) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatReward(quest) {
  const total = (quest?.reward?.prizes || []).reduce(
    (sum, prize) => sum + (Number(prize.amount) || 0),
    0,
  );

  const asset = quest?.reward?.asset || "USDC";

  if (!total) {
    return `${Number(quest?.reward?.defaultPoints || 500).toLocaleString()} pts`;
  }

  return `${total.toLocaleString()} ${asset}`;
}

function getStatus(quest) {
  if (quest?.status) return quest.status;

  const now = new Date();
  const start = quest?.startAt ? new Date(quest.startAt) : null;
  const end = quest?.endAt ? new Date(quest.endAt) : null;

  if (start && now < start) return "scheduled";
  if (end && now > end) return "completed";

  return "active";
}

function getCompany(quest) {
  return quest?.company || "Contribute.fi";
}

function getHashtags(quest) {
  return quest?.hashtags?.length
    ? quest.hashtags
    : ["Web3", "Stellar", "Contribute"];
}

function getReferenceTweetUrl(quest) {
  return (
    quest?.referenceTweetUrl ||
    quest?.referencePostUrl ||
    quest?.tweetUrl ||
    quest?.xPostUrl ||
    PLACEHOLDER_REFERENCE_TWEET_URL
  );
}

function PreviewModal({ preview, onClose }) {
  if (!preview) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#101828]/25 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/20 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#EAECF0] bg-[#FCFCFD] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D1FADF] bg-[#ECFDF3] px-3 py-1 text-xs font-medium text-[#027A48]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified preview
            </div>

            <h2 className="mt-3 text-base font-semibold tracking-tight text-[#101828]">
              X quote post preview
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              Review the fetched quote post before submitting your quest entry.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#EAECF0] bg-white text-[#667085] shadow-sm transition hover:bg-[#F9FAFB] hover:text-[#101828]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto bg-white p-4 sm:p-6">
          <div className="rounded-[24px] border border-[#EAECF0] bg-gradient-to-b from-white to-[#FCFCFD] p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-sm font-semibold text-[#101828]">
                    {preview.author?.name || "X quote post"}
                  </p>

                  {preview.author?.handle ? (
                    <p className="text-sm text-[#667085]">
                      @{preview.author.handle}
                    </p>
                  ) : null}
                </div>

                <p className="mt-4 text-[15px] leading-7 whitespace-pre-wrap text-[#344054]">
                  {preview.text || "No post text found."}
                </p>

                {preview.hashtags?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {preview.hashtags.map((tag) => (
                      <Badge2 key={tag} tone="purple">
                        #{tag}
                      </Badge2>
                    ))}
                  </div>
                ) : null}

                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#EAECF0] bg-white px-4 py-3">
                    <p className="text-[11px] font-medium tracking-wide text-[#98A2B3] uppercase">
                      Tweet ID
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-[#344054]">
                      {preview.tweet_id || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#EAECF0] bg-white px-4 py-3">
                    <p className="text-[11px] font-medium tracking-wide text-[#98A2B3] uppercase">
                      Date
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#344054]">
                      {preview.date || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-[#98A2B3]">
            Close this modal when you are done reviewing.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReferenceTweetCard({
  referenceTweetUrl,
  referencePreview,
  referencePreviewLoading,
  referencePreviewError,
}) {
  const [expanded, setExpanded] = useState(false);

  const text = referencePreview?.text || "";
  const shortText =
    text.length > 110 ? `${text.slice(0, 110).trim()}...` : text;

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-[#EAECF0] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAECF0] bg-[#FCFCFD] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-[#101828]">
            Reference tweet
          </p>
          <p className="mt-0.5 text-xs text-[#667085]">
            Quote this post to complete the quest.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge2 tone="purple">Required</Badge2>

          <a
            href={referenceTweetUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#EAECF0] bg-white px-3 text-xs font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
          >
            <Link2 className="h-3.5 w-3.5" />
            Open on X
          </a>
        </div>
      </div>

      {referencePreviewLoading ? (
        <div className="flex items-center gap-3 px-4 py-3">
          <Loader2 className="h-4 w-4 animate-spin text-[#2F0FD1]" />
          <p className="text-sm text-[#667085]">Loading reference tweet...</p>
        </div>
      ) : referencePreviewError ? (
        <div className="flex gap-3 bg-[#FFFBFA] px-4 py-3 text-sm text-[#B42318]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Could not load reference tweet.</p>
            <p className="mt-1 text-xs">{referencePreviewError}</p>
          </div>
        </div>
      ) : referencePreview ? (
        <div className="px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#101828] text-white">
              <BsTwitterX className="h-3.5 w-3.5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <p className="truncate text-sm font-semibold text-[#101828]">
                  {referencePreview.author?.name || "X reference post"}
                </p>

                {referencePreview.author?.handle ? (
                  <p className="truncate text-xs text-[#667085]">
                    @{referencePreview.author.handle}
                  </p>
                ) : null}
              </div>

              <div
                className={`mt-2 overflow-hidden transition-all duration-300 ${
                  expanded ? "max-h-[1200px]" : "max-h-[72px]"
                }`}
              >
                <p className="text-sm leading-6 whitespace-pre-wrap text-[#344054]">
                  {expanded ? text || "No post text found." : shortText}
                </p>

                {expanded && referencePreview.media?.length ? (
                  <div className="mt-4 overflow-hidden rounded-xl border border-[#EAECF0]">
                    <img
                      src={referencePreview.media[0]}
                      alt="Reference tweet media"
                      className="h-auto w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#F2F4F7] pt-3">
                <div className="flex flex-wrap items-center gap-3">
                  {referencePreview.tweet_id ? (
                    <span className="text-xs text-[#98A2B3]">
                      Tweet ID: {referencePreview.tweet_id}
                    </span>
                  ) : null}

                  {referencePreview.date ? (
                    <span className="text-xs text-[#98A2B3]">
                      {referencePreview.date}
                    </span>
                  ) : null}
                </div>

                {text.length > 110 ? (
                  <button
                    type="button"
                    onClick={() => setExpanded((value) => !value)}
                    className="text-xs font-semibold text-[#2F0FD1] transition hover:text-[#2409B8]"
                  >
                    {expanded ? "Show less" : "Expand"}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3">
          <p className="text-sm text-[#667085]">
            No reference tweet preview available.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ApplyQuestPage() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [quest, setQuest] = useState(null);
  const [questLoading, setQuestLoading] = useState(true);
  const [questError, setQuestError] = useState("");

  const [draft, setDraft] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [step, setStep] = useState("write");
  const [isRefined, setIsRefined] = useState(false);

  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const [referencePreview, setReferencePreview] = useState(null);
  const [referencePreviewLoading, setReferencePreviewLoading] = useState(false);
  const [referencePreviewError, setReferencePreviewError] = useState("");

  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const hashtags = useMemo(() => getHashtags(quest), [quest]);
  const referenceTweetUrl = useMemo(() => getReferenceTweetUrl(quest), [quest]);

  useEffect(() => {
    let isMounted = true;

    async function fetchQuest() {
      try {
        setQuestLoading(true);
        setQuestError("");

        const res = await fetch(`${API_URL}/api/twitter-quests/${questId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch quest.");
        }

        if (isMounted) {
          const fetchedQuest = data.quest;
          const company = getCompany(fetchedQuest);
          const fetchedHashtags = getHashtags(fetchedQuest);

          setQuest(fetchedQuest);
          setDraft(
            `I am checking out ${company}. ${fetchedQuest.description || ""} #${fetchedHashtags[0]}`,
          );
        }
      } catch (error) {
        if (isMounted) {
          setQuestError(
            error instanceof Error ? error.message : "Failed to fetch quest.",
          );
        }
      } finally {
        if (isMounted) {
          setQuestLoading(false);
        }
      }
    }

    if (questId) {
      fetchQuest();
    }

    return () => {
      isMounted = false;
    };
  }, [questId]);

  useEffect(() => {
    let isMounted = true;

    async function fetchReferencePreview() {
      const url = referenceTweetUrl?.trim();

      if (!url) {
        setReferencePreview(null);
        setReferencePreviewError("");
        return;
      }

      if (!isValidXPostUrl(url)) {
        setReferencePreview(null);
        setReferencePreviewError("The reference quest post URL is invalid.");
        return;
      }

      try {
        setReferencePreviewLoading(true);
        setReferencePreviewError("");
        setReferencePreview(null);

        const res = await fetch(`${API_URL}/api/oembed/twitter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(
            data.message ||
              "There was an error fetching the reference quest post.",
          );
        }

        if (isMounted) {
          setReferencePreview(data.data);
        }
      } catch (error) {
        if (isMounted) {
          setReferencePreviewError(
            error instanceof Error
              ? error.message
              : "There was an error fetching the reference quest post.",
          );
        }
      } finally {
        if (isMounted) {
          setReferencePreviewLoading(false);
        }
      }
    }

    fetchReferencePreview();

    return () => {
      isMounted = false;
    };
  }, [referenceTweetUrl]);

  useEffect(() => {
    const stored = localStorage.getItem(`twitterQuestSubmission:${questId}`);
    setAlreadyApplied(Boolean(stored));
  }, [questId]);

  async function fetchPreview(url) {
    setPreviewLoading(true);
    setPreviewError("");
    setPreview(null);

    try {
      const res = await fetch(`${API_URL}/api/oembed/twitter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "There was an error fetching the quote post.",
        );
      }

      setPreview(data.data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "There was an error fetching the quote post.";

      setPreviewError(message);
      setToast(message);
    } finally {
      setPreviewLoading(false);
    }
  }

  useEffect(() => {
    const url = postUrl.trim();

    setPreview(null);
    setPreviewError("");

    if (!url) return;

    if (!isValidXPostUrl(url)) {
      setPreviewError("Please paste a valid X quote post link.");
      return;
    }

    const timer = setTimeout(() => {
      fetchPreview(url);
    }, 700);

    return () => clearTimeout(timer);
  }, [postUrl]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  function refinePost() {
    const company = getCompany(quest);
    const hashtagText = hashtags.map((tag) => `#${tag}`).join(" ");

    setDraft(
      `${company} is making Web3 engagement feel more practical. ${(
        quest.description || ""
      ).replace(
        /\.$/,
        "",
      )}. Clear onboarding, real participation, and better rewards can help more users discover useful crypto products. ${hashtagText}`,
    );

    setIsRefined(true);
  }

  function openTwitterIntent() {
    const referenceTweetId =
      referencePreview?.tweet_id ||
      referenceTweetUrl.match(/status\/(\d+)/)?.[1];

    if (!referenceTweetId) {
      setToast("Unable to find the reference tweet ID.");
      return;
    }

    const url = `https://x.com/intent/post?text=${encodeURIComponent(
      draft,
    )}&url=${encodeURIComponent(referenceTweetUrl)}`;

    const width = Math.min(900, window.innerWidth * 0.9);
    const height = Math.min(760, window.innerHeight * 0.9);
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      url,
      "twitterQuoteIntent",
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`,
    );

    setStep("submit");
  }
  async function handleSubmit(e) {
    e.preventDefault();

    if (!postUrl || !preview || alreadyApplied || submitting) return;

    setSubmitting(true);

    try {
      const res = await fetch(
        `${API_URL}/api/twitter-quests/${questId}/submissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              accessToken || localStorage.getItem("accessToken")
            }`,
          },
          body: JSON.stringify({
            draft,
            postUrl,
            referenceTweetUrl,
            referencePreview,
            preview,
            tweetId: preview.tweet_id,
            referenceTweetId: referencePreview?.tweet_id,
            status: "submitted",
            submissionType: "quote_tweet",
            score: isRefined ? 91 : 78,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit quest entry.");
      }

      localStorage.setItem(
        `twitterQuestSubmission:${questId}`,
        JSON.stringify({
          submittedAt: new Date().toISOString(),
          postUrl,
          referenceTweetUrl,
          submissionType: "quote_tweet",
        }),
      );

      setAlreadyApplied(true);
      navigate("/applications");
    } catch (error) {
      setToast(
        error instanceof Error
          ? error.message
          : "Failed to submit quest entry.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (questLoading) {
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

  if (questError || !quest) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] px-3 py-4">
        <div className="rounded-2xl border border-[#EAECF0] bg-white p-8 text-center shadow-sm">
          <Compass className="mx-auto mb-4 h-9 w-9 text-[#2F0FD1]" />
          <h1 className="text-lg font-semibold text-[#101828]">
            Quest not found
          </h1>
          <p className="mt-2 text-sm text-[#667085]">
            {questError ||
              "This quest may have been removed or the link is incorrect."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/twitter-quests")}
            className="mt-5 h-10 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white transition hover:bg-[#2409B8]"
          >
            Browse quests
          </button>
        </div>
      </main>
    );
  }

  const status = getStatus(quest);

  const postUrlInputState = previewError
    ? "border-[#FDA29B] focus:border-[#D92D20] focus:ring-[#FEE4E2]"
    : preview
      ? "border-[#75E0A7] focus:border-[#12B76A] focus:ring-[#ECFDF3]"
      : "border-[#EAECF0] focus:border-[#2F0FD1] focus:ring-[#EEF2FF]";

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {toast ? (
        <div className="fixed top-5 right-5 z-[110] flex max-w-sm items-start gap-3 rounded-2xl border border-[#FEE4E2] bg-white px-4 py-3 text-sm text-[#B42318] shadow-xl">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{toast}</p>
        </div>
      ) : null}

      <div className="space-y-4 px-3 py-4">
        <button
          type="button"
          onClick={() => navigate(`/twitter-quests/${quest._id || questId}`)}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-4 text-sm font-medium text-[#344054] shadow-sm transition hover:bg-[#F9FAFB]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to quest
        </button>

        <section className="rounded-2xl border border-[#EAECF0] bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge2 tone="purple">X Quest</Badge2>
                <Badge2 tone="green">{status}</Badge2>
                <Badge2 tone="blue">
                  {quest.reward?.selectionType?.replaceAll("_", " ") || "Quest"}
                </Badge2>

                {alreadyApplied ? (
                  <Badge2 tone="green">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Submitted
                  </Badge2>
                ) : null}
              </div>

              <h1 className="mt-2 max-w-4xl text-xl font-semibold tracking-tight text-[#101828] sm:text-2xl">
                Create and submit your quote post
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-[#667085]">
                Write a quote post for{" "}
                <span className="font-medium text-[#344054]">
                  {quest.title}
                </span>
                , publish on X, then submit the link.
              </p>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-[#FCFCFD] px-3 py-2">
              <p className="text-[11px] text-[#667085]">Project</p>
              <p className="mt-0.5 text-sm font-semibold text-[#101828]">
                {getCompany(quest)}
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {[
              ["Reward", formatReward(quest)],
              [
                "Timeline",
                `${formatDate(quest.startAt)} - ${formatDate(quest.endAt)}`,
              ],
              ["Winners", quest.reward?.winnerCount || 1],
              ["Participants", quest.reward?.maxParticipants || "Open"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-[#F2F4F7] bg-[#FCFCFD] px-3 py-2"
              >
                <p className="text-[11px] text-[#667085]">{label}</p>
                <p className="mt-0.5 text-sm font-semibold text-[#101828]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1]">
                <Send className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-[#101828]">
                  Quote post submission
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#667085]">
                  Draft your quote post, publish it on X with the quest
                  reference, paste the link, and the preview will fetch
                  automatically.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setStep("write")}
                className={`rounded-2xl border p-4 text-left transition ${
                  step === "write"
                    ? "border-[#2F0FD1] bg-[#F4F7FF]"
                    : "border-[#EAECF0] bg-white hover:bg-[#F9FAFB]"
                }`}
              >
                <p className="text-sm font-semibold text-[#101828]">
                  1. Write and quote
                </p>
                <p className="mt-1 text-xs leading-5 text-[#667085]">
                  Create a clear quote post using the quest reference.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStep("submit")}
                className={`rounded-2xl border p-4 text-left transition ${
                  step === "submit"
                    ? "border-[#2F0FD1] bg-[#F4F7FF]"
                    : "border-[#EAECF0] bg-white hover:bg-[#F9FAFB]"
                }`}
              >
                <p className="text-sm font-semibold text-[#101828]">
                  2. Preview and submit
                </p>
                <p className="mt-1 text-xs leading-5 text-[#667085]">
                  Paste the X quote post URL and verify it automatically.
                </p>
              </button>
            </div>

            {step === "write" ? (
              <>
                <ReferenceTweetCard
                  referenceTweetUrl={referenceTweetUrl}
                  referencePreview={referencePreview}
                  referencePreviewLoading={referencePreviewLoading}
                  referencePreviewError={referencePreviewError}
                />

                <div className="mt-5 rounded-2xl border border-[#EAECF0] bg-[#F8FAFC] p-4">
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((tag) => (
                      <Badge2 key={tag} tone="purple">
                        #{tag}
                      </Badge2>
                    ))}
                  </div>

                  <textarea
                    required
                    rows={7}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className={`${textareaClass} mt-4 bg-white`}
                    placeholder="Write your quote post..."
                  />

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-[#667085]">
                    <span>{draft.length}/280 characters</span>
                    <span>{isRefined ? "Post improved" : "Draft ready"}</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={refinePost}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-5 text-sm font-medium text-[#344054] shadow-sm transition hover:bg-[#F9FAFB]"
                  >
                    Improve using AI
                    <Wand2 className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={openTwitterIntent}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#101828] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1D2939]"
                  >
                    Post quote on
                    <BsTwitterX className="h-4 w-4" />
                  </button>
                </div>

                <div className="sticky bottom-0 -mx-4 mt-5 -mb-4 border-t border-[#EAECF0] bg-white/95 px-4 py-4 backdrop-blur sm:-mx-5 sm:-mb-5 sm:px-5">
                  <button
                    type="button"
                    onClick={() => setStep("submit")}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
                  >
                    Continue to submit link
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mt-5 rounded-2xl border border-[#EAECF0] bg-white p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-[#344054]">
                        X quote post link
                      </label>

                      <div className="relative mt-2">
                        <Link2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />

                        <input
                          required
                          value={postUrl}
                          onChange={(e) => setPostUrl(e.target.value)}
                          className={`${inputClass} ${postUrlInputState} pr-32 pl-9`}
                          placeholder="https://x.com/username/status/..."
                        />

                        <div className="absolute top-1/2 right-3 -translate-y-1/2">
                          {previewLoading ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-2.5 py-1 text-xs font-medium text-[#2F0FD1]">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Fetching
                            </span>
                          ) : preview ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF3] px-2.5 py-1 text-xs font-medium text-[#027A48]">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Ready
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  {previewLoading ? (
                    <div className="mt-4 rounded-2xl border border-[#D9E0FF] bg-[#F4F7FF] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#2F0FD1] shadow-sm">
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-[#101828]">
                            Fetching quote post preview
                          </p>
                          <p className="mt-0.5 text-xs text-[#667085]">
                            We are checking the X link and preparing a clean
                            preview.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {previewError ? (
                    <div className="mt-4 flex gap-3 rounded-2xl border border-[#FEE4E2] bg-[#FFFBFA] p-4 text-sm text-[#B42318]">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>{previewError}</p>
                    </div>
                  ) : null}
                  {preview ? (
                    <div className="mt-4 overflow-hidden rounded-[24px] border border-[#EAECF0] bg-white shadow-sm">
                      <div className="border-b border-[#EAECF0] bg-[#FCFCFD] px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="inline-flex items-center gap-2 rounded-full border border-[#D1FADF] bg-[#ECFDF3] px-3 py-1 text-xs font-medium text-[#027A48]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Verified quote post
                          </div>

                          <a
                            href={postUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-medium text-[#2F0FD1] transition hover:text-[#2409B8]"
                          >
                            <Link2 className="h-3.5 w-3.5" />
                            Open on X
                          </a>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#101828] text-white">
                            <BsTwitterX className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <p className="text-sm font-semibold text-[#101828]">
                                {preview.author?.name || "X quote post"}
                              </p>

                              {preview.author?.handle ? (
                                <p className="text-sm text-[#667085]">
                                  @{preview.author.handle}
                                </p>
                              ) : null}
                            </div>

                            <p className="mt-4 text-[15px] leading-7 whitespace-pre-wrap text-[#344054]">
                              {preview.text || "No post text found."}
                            </p>

                            {preview.hashtags?.length ? (
                              <div className="mt-5 flex flex-wrap gap-2">
                                {preview.hashtags.map((tag) => (
                                  <Badge2 key={tag} tone="purple">
                                    #{tag}
                                  </Badge2>
                                ))}
                              </div>
                            ) : null}

                            <div className="mt-5 grid gap-2 sm:grid-cols-2">
                              <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] px-4 py-3">
                                <p className="text-[11px] font-medium tracking-wide text-[#98A2B3] uppercase">
                                  Tweet ID
                                </p>

                                <p className="mt-1 truncate text-sm font-medium text-[#344054]">
                                  {preview.tweet_id || "N/A"}
                                </p>
                              </div>

                              <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] px-4 py-3">
                                <p className="text-[11px] font-medium tracking-wide text-[#98A2B3] uppercase">
                                  Date
                                </p>

                                <p className="mt-1 text-sm font-medium text-[#344054]">
                                  {preview.date || "N/A"}
                                </p>
                              </div>
                            </div>

                            {preview.media?.length ? (
                              <div className="mt-5 overflow-hidden rounded-2xl border border-[#EAECF0]">
                                <img
                                  src={preview.media[0]}
                                  alt="Quote post media"
                                  className="h-auto w-full object-cover"
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="sticky bottom-0 -mx-4 mt-5 -mb-4 border-t border-[#EAECF0] bg-white/95 px-4 py-4 backdrop-blur sm:-mx-5 sm:-mb-5 sm:px-5">
                  <button
                    type="submit"
                    disabled={
                      !postUrl || !preview || alreadyApplied || submitting
                    }
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : alreadyApplied ? (
                      "Submission received"
                    ) : preview ? (
                      <>
                        Submit verified quote post
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      "Waiting for verified preview"
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[#101828]">
                Submission checklist
              </h3>

              <div className="mt-4 space-y-3">
                {[
                  "Quote post is published on X",
                  "Quote post link is public",
                  "Quote post references the quest tweet",
                  "Preview is verified",
                  "Quest hashtags are included",
                  "Message matches the quest brief",
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
                <Sparkles className="h-4 w-4 text-[#2F0FD1]" />
                <h3 className="text-sm font-semibold text-[#101828]">
                  Quest brief
                </h3>
              </div>

              <p className="text-sm leading-6 text-[#667085]">
                {quest.description}
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
