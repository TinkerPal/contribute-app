import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Edit3,
  Eye,
  ExternalLink,
  FileText,
  Link2,
  Loader2,
  Send,
  Sparkles,
  Users,
  Wand2,
  X,
} from "lucide-react";

import Badge2 from "@/components/ui/Badge2";
import { BsTwitterX } from "react-icons/bs";
import { useAuth } from "@/hooks/useAuth";

const API_URL = "http://localhost:4000";

const inputClass =
  "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:ring-4";

const textareaClass =
  "w-full resize-none rounded-xl border border-[#EAECF0] bg-white px-3.5 py-3 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]";

function isValidXPostUrl(value) {
  return /^https?:\/\/(www\.)?(x|twitter)\.com\/[^/]+\/status\/\d+/i.test(
    value.trim(),
  );
}

function formatDate(value, withTime = false) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
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

function hasQuestStarted(quest) {
  if (!quest?.startAt) return false;
  return new Date() >= new Date(quest.startAt);
}

function getCompany(quest) {
  return quest?.company || quest?.project?.name || "Contribute.fi";
}

function getHashtags(quest) {
  return quest?.hashtags?.length
    ? quest.hashtags
    : ["Web3", "Stellar", "Contribute"];
}

function getUserId(user) {
  return user?._id || user?.id || user?.userId || user?.profile?._id;
}

function getCreatorId(quest) {
  const creator =
    quest?.creator || quest?.createdBy || quest?.user || quest?.userId;

  if (typeof creator === "string") return creator;

  return creator?._id || creator?.id || creator?.userId;
}

function isQuestCreator(quest, user, serverValue) {
  if (typeof serverValue === "boolean") return serverValue;

  const userId = getUserId(user);
  const creatorId = getCreatorId(quest);

  return Boolean(userId && creatorId && String(userId) === String(creatorId));
}

function PreviewModal({ preview, onClose }) {
  if (!preview) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#101828]/25 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/20 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#EAECF0] bg-[#FCFCFD] px-5 py-4 sm:px-6">
          <div>
            <Badge2 tone="green">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified preview
            </Badge2>

            <h2 className="mt-3 text-base font-semibold tracking-tight text-[#101828]">
              X post preview
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              Review the fetched post before submitting your quest entry.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#EAECF0] bg-white text-[#667085] shadow-sm transition hover:bg-[#F9FAFB]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto bg-white p-4 sm:p-6">
          <div className="rounded-[24px] border border-[#EAECF0] bg-gradient-to-b from-white to-[#FCFCFD] p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="text-sm font-semibold text-[#101828]">
                {preview.author?.name || "X post"}
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
    </div>
  );
}

function QuestDetailsCard({ quest }) {
  const hashtags = getHashtags(quest);

  return (
    <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1]">
          <FileText className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-[#101828]">
            Quest details
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#667085]">
            Review the quest brief, requirements, timeline, and reward setup.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["Title", quest.title],
          ["Project", getCompany(quest)],
          ["Status", getStatus(quest)],
          ["Reward", formatReward(quest)],
          ["Starts", formatDate(quest.startAt, true)],
          ["Ends", formatDate(quest.endAt, true)],
          ["Winners", quest.reward?.winnerCount || 1],
          ["Participants", quest.reward?.maxParticipants || "Open"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4"
          >
            <p className="text-[11px] text-[#667085]">{label}</p>
            <p className="mt-1 text-sm font-semibold text-[#101828] capitalize">
              {value || "Not set"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
        <h3 className="text-sm font-semibold text-[#101828]">Description</h3>
        <p className="mt-2 text-sm leading-6 whitespace-pre-wrap text-[#667085]">
          {quest.description || "No description provided."}
        </p>
      </div>

      {quest.instructions ? (
        <div className="mt-4 rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
          <h3 className="text-sm font-semibold text-[#101828]">Instructions</h3>
          <p className="mt-2 text-sm leading-6 whitespace-pre-wrap text-[#667085]">
            {quest.instructions}
          </p>
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
        <h3 className="text-sm font-semibold text-[#101828]">
          Post requirements
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <Badge2 key={tag} tone="purple">
              #{tag}
            </Badge2>
          ))}

          {(quest.requiredMentions || []).map((mention) => (
            <Badge2 key={mention} tone="blue">
              @{mention}
            </Badge2>
          ))}
        </div>
      </div>
    </section>
  );
}

function CreatorEntriesPanel({ entries, loading, error }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-[#EAECF0] bg-white p-8 text-center shadow-sm">
        <Loader2 className="mx-auto mb-3 h-7 w-7 animate-spin text-[#2F0FD1]" />
        <p className="text-sm font-medium text-[#344054]">
          Loading submissions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[#FEE4E2] bg-[#FFFBFA] p-5 text-sm text-[#B42318]">
        {error}
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="rounded-2xl border border-[#EAECF0] bg-white p-8 text-center shadow-sm">
        <Users className="mx-auto mb-4 h-9 w-9 text-[#2F0FD1]" />
        <h3 className="text-base font-semibold text-[#101828]">
          No entries yet
        </h3>
        <p className="mt-2 text-sm text-[#667085]">
          Submitted quest entries will appear here once participants apply.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => {
        const participant =
          entry.user ||
          entry.participant ||
          entry.creator ||
          entry.profile ||
          {};

        const name =
          participant.name ||
          participant.username ||
          participant.displayName ||
          `Participant ${index + 1}`;

        const handle =
          entry.preview?.author?.handle ||
          participant.twitterUsername ||
          participant.xUsername;

        return (
          <article
            key={entry._id || entry.id || index}
            className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm transition hover:border-[#D7DDF0] hover:shadow-md"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#101828]">
                    {name}
                  </h3>

                  {handle ? <Badge2 tone="blue">@{handle}</Badge2> : null}

                  <Badge2 tone="green">{entry.status || "submitted"}</Badge2>
                </div>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#667085]">
                  {entry.preview?.text || entry.draft || "No post text found."}
                </p>
              </div>

              {entry.postUrl ? (
                <a
                  href={entry.postUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-4 text-sm font-medium text-[#344054] shadow-sm transition hover:bg-[#F9FAFB]"
                >
                  View post
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              {[
                ["Score", entry.score || "N/A"],
                ["Tweet ID", entry.tweetId || entry.preview?.tweet_id || "N/A"],
                [
                  "Submitted",
                  formatDate(entry.createdAt || entry.submittedAt, true),
                ],
                ["Status", entry.status || "submitted"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#F2F4F7] bg-[#FCFCFD] px-3 py-2"
                >
                  <p className="text-[11px] text-[#667085]">{label}</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-[#101828]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function CreatorQuestView({
  quest,
  entries,
  entriesLoading,
  entriesError,
  activeTab,
  setActiveTab,
}) {
  const navigate = useNavigate();
  const started = hasQuestStarted(quest);

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#EAECF0] bg-white p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-medium transition ${
                activeTab === "details"
                  ? "bg-[#2F0FD1] text-white shadow-sm"
                  : "text-[#667085] hover:bg-[#F9FAFB] hover:text-[#101828]"
              }`}
            >
              <FileText className="h-4 w-4" />
              Details
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("entries")}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-medium transition ${
                activeTab === "entries"
                  ? "bg-[#2F0FD1] text-white shadow-sm"
                  : "text-[#667085] hover:bg-[#F9FAFB] hover:text-[#101828]"
              }`}
            >
              <Users className="h-4 w-4" />
              Entries
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {entries.length}
              </span>
            </button>
          </div>
        </div>

        {activeTab === "details" ? (
          <QuestDetailsCard quest={quest} />
        ) : (
          <CreatorEntriesPanel
            entries={entries}
            loading={entriesLoading}
            error={entriesError}
          />
        )}
      </div>

      <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
        <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#2F0FD1]" />
            <h3 className="text-sm font-semibold text-[#101828]">
              Creator controls
            </h3>
          </div>

          <p className="text-sm leading-6 text-[#667085]">
            You created this quest, so submissions are disabled for your
            account. You can review quest details and manage participant entries
            here.
          </p>

          {!started ? (
            <button
              type="button"
              onClick={() =>
                navigate(`/twitter-quests/${quest._id || quest.id}/edit`)
              }
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
            >
              Edit quest
              <Edit3 className="h-4 w-4" />
            </button>
          ) : (
            <div className="mt-4 rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
              <div className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#667085]" />
                <p className="text-sm leading-6 text-[#667085]">
                  Editing is locked because this quest has already started.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#101828]">Summary</h3>

          <div className="mt-4 space-y-3">
            {[
              ["Entries", entries.length],
              ["Status", getStatus(quest)],
              ["Reward", formatReward(quest)],
              ["Starts", formatDate(quest.startAt, true)],
              ["Ends", formatDate(quest.endAt, true)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-[#F8FAFC] px-3 py-2">
                <p className="text-[11px] text-[#667085]">{label}</p>
                <p className="mt-0.5 text-sm font-semibold text-[#101828]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}

export default function XQuestInteractionPage() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();

  const [quest, setQuest] = useState(null);
  const [serverIsCreator, setServerIsCreator] = useState(false);
  const [questLoading, setQuestLoading] = useState(true);
  const [questError, setQuestError] = useState("");

  const [entries, setEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [entriesError, setEntriesError] = useState("");
  const [activeCreatorTab, setActiveCreatorTab] = useState("details");

  const [draft, setDraft] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [step, setStep] = useState("write");
  const [isRefined, setIsRefined] = useState(false);

  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const creatorView = useMemo(
    () => isQuestCreator(quest, user, serverIsCreator),
    [quest, user, serverIsCreator],
  );

  const hashtags = useMemo(() => getHashtags(quest), [quest]);

  useEffect(() => {
    let isMounted = true;

    async function fetchQuest() {
      try {
        setQuestLoading(true);
        setQuestError("");

        const res = await fetch(`${API_URL}/api/twitter-quests/${questId}`, {
          headers: {
            Authorization: `Bearer ${
              accessToken || localStorage.getItem("accessToken") || ""
            }`,
          },
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch quest.");
        }

        if (isMounted) {
          const fetchedQuest = data.quest;
          const company = getCompany(fetchedQuest);
          const fetchedHashtags = getHashtags(fetchedQuest);

          setQuest(fetchedQuest);
          setServerIsCreator(Boolean(data.isCreator));
          setDraft(
            `I am checking out ${company}. ${
              fetchedQuest.description || ""
            } #${fetchedHashtags[0]}`,
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

    if (questId) fetchQuest();

    return () => {
      isMounted = false;
    };
  }, [questId, accessToken]);

  useEffect(() => {
    const stored = localStorage.getItem(`twitterQuestSubmission:${questId}`);
    setAlreadyApplied(Boolean(stored));
  }, [questId]);

  useEffect(() => {
    if (!creatorView || !questId) return;

    let isMounted = true;

    async function fetchEntries() {
      try {
        setEntriesLoading(true);
        setEntriesError("");

        const res = await fetch(
          `${API_URL}/api/twitter-quests/${questId}/submissions`,
          {
            headers: {
              Authorization: `Bearer ${
                accessToken || localStorage.getItem("accessToken") || ""
              }`,
            },
          },
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch submissions.");
        }

        if (isMounted) {
          setEntries(data.submissions || data.entries || []);
        }
      } catch (error) {
        if (isMounted) {
          setEntriesError(
            error instanceof Error
              ? error.message
              : "Failed to fetch submissions.",
          );
        }
      } finally {
        if (isMounted) {
          setEntriesLoading(false);
        }
      }
    }

    fetchEntries();

    return () => {
      isMounted = false;
    };
  }, [creatorView, questId, accessToken]);

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
          data.message || "There was an error fetching the post.",
        );
      }

      setPreview(data.data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "There was an error fetching the post.";

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
      setPreviewError("Please paste a valid X post link.");
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
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      draft,
    )}`;

    const width = Math.min(900, window.innerWidth * 0.9);
    const height = Math.min(720, window.innerHeight * 0.85);
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      url,
      "twitterIntent",
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`,
    );

    setStep("submit");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (creatorView) {
      setToast("Quest creators cannot submit entries to their own quests.");
      return;
    }

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
            preview,
            tweetId: preview.tweet_id,
            status: "submitted",
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

      <PreviewModal
        preview={showPreviewModal ? preview : null}
        onClose={() => setShowPreviewModal(false)}
      />

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
                  {creatorView ? "Creator view" : "Participant view"}
                </Badge2>

                {alreadyApplied && !creatorView ? (
                  <Badge2 tone="green">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Submitted
                  </Badge2>
                ) : null}
              </div>

              <h1 className="mt-2 max-w-4xl text-xl font-semibold tracking-tight text-[#101828] sm:text-2xl">
                {creatorView ? quest.title : "Create and submit your X post"}
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-[#667085]">
                {creatorView
                  ? "Manage this quest, review details, and track all participant submissions."
                  : `Write a post for ${quest.title}, publish on X, then submit the link.`}
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

        {creatorView ? (
          <CreatorQuestView
            quest={quest}
            entries={entries}
            entriesLoading={entriesLoading}
            entriesError={entriesError}
            activeTab={activeCreatorTab}
            setActiveTab={setActiveCreatorTab}
          />
        ) : (
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
                    Quest submission
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#667085]">
                    Draft your post, publish it on X, paste the link, and the
                    preview will fetch automatically.
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
                    1. Write and publish
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#667085]">
                    Create a clear post using the quest brief.
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
                    Paste the X post URL and verify it automatically.
                  </p>
                </button>
              </div>

              {step === "write" ? (
                <>
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
                      placeholder="Write your X post..."
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
                      Post on
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
                          X post link
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

                      <button
                        type="button"
                        onClick={() => setShowPreviewModal(true)}
                        disabled={!preview || previewLoading}
                        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#101828] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1D2939] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
                      >
                        <Eye className="h-4 w-4" />
                        Open preview
                      </button>
                    </div>

                    {previewError ? (
                      <div className="mt-4 flex gap-3 rounded-2xl border border-[#FEE4E2] bg-[#FFFBFA] p-4 text-sm text-[#B42318]">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <p>{previewError}</p>
                      </div>
                    ) : null}

                    {preview ? (
                      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-[#D1FADF] bg-[#F6FEF9] p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-[#027A48]" />
                          <div>
                            <p className="text-sm font-semibold text-[#101828]">
                              Preview fetched successfully
                            </p>
                            <p className="text-xs text-[#667085]">
                              Click Open preview to review the post.
                            </p>
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
                          Submit verified post
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
                    "Post is published on X",
                    "Post link is public",
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
        )}
      </div>
    </main>
  );
}
