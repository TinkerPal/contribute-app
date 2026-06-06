import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Compass,
  Edit3,
  ExternalLink,
  FileText,
  Loader2,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";

import Badge2 from "@/components/ui/Badge2";
import { useAuth } from "@/hooks/useAuth";

const API_URL = "http://localhost:4000";

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
  const prizes = quest?.reward?.prizes || [];
  const total = prizes.reduce(
    (sum, prize) => sum + (Number(prize.amount) || 0),
    0,
  );

  const asset = quest?.reward?.asset || "USDC";

  if (!total) {
    return `${Number(quest?.reward?.defaultPoints || 500).toLocaleString()} pts`;
  }

  return `${total.toLocaleString()} ${asset}`;
}

function getQuestStatus(quest) {
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

function getCreatorName(quest) {
  return (
    quest?.createdBy?.displayName ||
    quest?.createdBy?.username ||
    quest?.creator?.displayName ||
    quest?.creator?.username ||
    "Project owner"
  );
}

function getCreatorInitials(quest) {
  const name = getCreatorName(quest);

  return name
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getCreatorId(quest) {
  const creator =
    quest?.createdBy || quest?.creator || quest?.user || quest?.userId;

  if (typeof creator === "string") return creator;

  return creator?._id || creator?.id || creator?.userId;
}

function getUserId(user) {
  return user?._id || user?.id || user?.userId || user?.profile?._id;
}

function getCompanyName(quest) {
  return quest?.company || quest?.project?.name || "Contribute.fi";
}

function getRequirements(quest) {
  const rules = [];

  if (quest?.eligibility?.minFollowers) {
    rules.push(`Minimum followers: ${quest.eligibility.minFollowers}`);
  }

  if (quest?.eligibility?.minFollowing) {
    rules.push(`Minimum following: ${quest.eligibility.minFollowing}`);
  }

  if (quest?.eligibility?.minAccountAgeDays) {
    rules.push(
      `Account must be at least ${quest.eligibility.minAccountAgeDays} days old`,
    );
  }

  if (quest?.eligibility?.verifiedOnly) {
    rules.push("Verified X account required");
  }

  if (!quest?.eligibility?.allowProtectedAccounts) {
    rules.push("Public X account recommended for verification");
  }

  return rules.length
    ? rules
    : ["Follow the quest instructions and submit a valid public X post."];
}

function getDeliverables(quest) {
  const deliverables = [];

  if (quest?.hashtags?.length) {
    deliverables.push(
      `Include required hashtags: ${quest.hashtags
        .map((tag) => `#${tag}`)
        .join(", ")}`,
    );
  }

  if (quest?.requiredMentions?.length) {
    deliverables.push(
      `Mention: ${quest.requiredMentions.map((item) => `@${item}`).join(", ")}`,
    );
  }

  if (quest?.requiredLinks?.length) {
    deliverables.push(
      `Include required links: ${quest.requiredLinks.join(", ")}`,
    );
  }

  deliverables.push("Submit the X post URL before the quest deadline.");

  return deliverables;
}

function hasLocalSubmission(questId) {
  return Boolean(localStorage.getItem(`twitterQuestSubmission:${questId}`));
}

function DetailSection({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#2F0FD1]" />
        <h2 className="text-base font-semibold text-[#101828]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InfoGrid({ quest, reward }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
      {[
        ["Reward", reward],
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
          <p className="mt-0.5 truncate text-sm font-semibold text-[#101828]">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

function EntriesList({ entries, loading }) {
  if (loading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-[#EAECF0] bg-white p-8 shadow-sm">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-7 w-7 animate-spin text-[#2F0FD1]" />
          <p className="text-sm font-medium text-[#344054]">
            Loading entries...
          </p>
        </div>
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
          Participant submissions will appear here once users submit their X
          post links.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => {
        const participant =
          entry.user || entry.participant || entry.profile || {};

        const name =
          participant.displayName ||
          participant.username ||
          participant.name ||
          entry.preview?.author?.name ||
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

export default function QuestDetailsPage() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();

  const [quest, setQuest] = useState(null);
  const [entries, setEntries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [serverIsCreator, setServerIsCreator] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const status = useMemo(() => getQuestStatus(quest), [quest]);
  const reward = useMemo(() => formatReward(quest), [quest]);
  const requirements = useMemo(() => getRequirements(quest), [quest]);
  const deliverables = useMemo(() => getDeliverables(quest), [quest]);

  const isCreator = useMemo(() => {
    if (serverIsCreator) return true;

    const userId = getUserId(user);
    const creatorId = getCreatorId(quest);

    return Boolean(userId && creatorId && String(userId) === String(creatorId));
  }, [quest, user, serverIsCreator]);

  const editLocked = hasQuestStarted(quest);

  useEffect(() => {
    let isMounted = true;

    async function fetchQuest() {
      try {
        setLoading(true);
        setErrorMessage("");

        const res = await fetch(`${API_URL}/api/twitter-quests/${questId}`, {
          headers: {
            Authorization: `Bearer ${
              accessToken || localStorage.getItem("accessToken") || ""
            }`,
          },
        });

        const data = await res.json();

        console.log("the data loaded is", data);

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch quest.");
        }

        if (isMounted) {
          setQuest(data.quest);
          setServerIsCreator(Boolean(data.isCreator));
          setAlreadySubmitted(
            Boolean(data.hasSubmitted) || hasLocalSubmission(questId),
          );
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Failed to fetch quest.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (questId) fetchQuest();

    return () => {
      isMounted = false;
    };
  }, [questId, accessToken]);

  useEffect(() => {
    if (!isCreator || !questId) return;

    let isMounted = true;

    async function fetchEntries() {
      try {
        setEntriesLoading(true);

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
          throw new Error(data.message || "Failed to fetch entries.");
        }

        if (isMounted) {
          setEntries(data.submissions || data.entries || []);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) setEntries([]);
      } finally {
        if (isMounted) setEntriesLoading(false);
      }
    }

    fetchEntries();

    return () => {
      isMounted = false;
    };
  }, [isCreator, questId, accessToken]);

  if (loading) {
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

  if (errorMessage || !quest) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] px-3 py-4">
        <div className="rounded-2xl border border-[#EAECF0] bg-white p-8 text-center shadow-sm">
          <Compass className="mx-auto mb-4 h-9 w-9 text-[#2F0FD1]" />
          <h1 className="text-lg font-semibold text-[#101828]">
            Quest not found
          </h1>
          <p className="mt-2 text-sm text-[#667085]">
            {errorMessage ||
              "This quest may have been removed or the link may be incorrect."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/quests")}
            className="mt-5 h-10 rounded-xl border border-[#EAECF0] bg-white px-4 text-sm font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
          >
            Browse quests
          </button>
        </div>
      </main>
    );
  }

  const questIdValue = quest._id || quest.id || questId;

  function goToSubmit() {
    if (!alreadySubmitted && !isCreator) {
      navigate(`/quests/${questIdValue}/submit`);
    }
  }

  function goToEdit() {
    if (!editLocked) {
      navigate(`/quests/${questIdValue}/edit`);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto space-y-4 px-3 py-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-4 text-sm font-medium text-[#344054] shadow-sm transition hover:bg-[#F9FAFB]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <section className="rounded-2xl border border-[#EAECF0] bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge2 tone="purple">X Quest</Badge2>
                <Badge2 tone="green">{status}</Badge2>
                <Badge2 tone="blue">
                  {isCreator ? "Creator view" : "Participant view"}
                </Badge2>

                {quest.reward?.selectionType ? (
                  <Badge2 tone="blue">
                    {quest.reward.selectionType.replaceAll("_", " ")}
                  </Badge2>
                ) : null}

                {alreadySubmitted && !isCreator ? (
                  <Badge2 tone="green">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Entry received
                  </Badge2>
                ) : null}
              </div>

              <h1 className="mt-2 max-w-4xl text-xl font-semibold tracking-tight text-[#101828] sm:text-2xl">
                {quest.title}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#667085]">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-[#98A2B3]" />
                  {getCompanyName(quest)}
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-[#D0D5DD] sm:block" />
                <span>{getCreatorName(quest)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
              {!isCreator ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate("/quests/create")}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-4 text-sm font-medium text-[#344054] shadow-sm transition hover:bg-[#F9FAFB]"
                  >
                    <Plus className="h-4 w-4" />
                    Create quest
                  </button>

                  <button
                    type="button"
                    disabled={alreadySubmitted}
                    onClick={goToSubmit}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
                  >
                    {alreadySubmitted ? "Entry received" : "Submit entry"}
                    {!alreadySubmitted ? (
                      <ArrowRight className="h-4 w-4" />
                    ) : null}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={editLocked}
                  onClick={goToEdit}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
                >
                  <Edit3 className="h-4 w-4" />
                  {editLocked ? "Editing locked" : "Edit quest"}
                </button>
              )}
            </div>
          </div>

          <InfoGrid quest={quest} reward={reward} />
        </section>

        {isCreator ? (
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

              {activeTab === "entries" ? (
                <EntriesList entries={entries} loading={entriesLoading} />
              ) : (
                <>
                  <DetailSection icon={FileText} title="Description">
                    <p className="text-sm leading-7 whitespace-pre-line text-[#667085]">
                      {quest.description || "No description provided."}
                    </p>
                  </DetailSection>

                  {quest.instructions ? (
                    <DetailSection icon={ShieldCheck} title="Instructions">
                      <p className="text-sm leading-7 whitespace-pre-line text-[#667085]">
                        {quest.instructions}
                      </p>
                    </DetailSection>
                  ) : null}

                  <DetailSection icon={ShieldCheck} title="Eligibility rules">
                    <div className="space-y-3">
                      {requirements.map((item) => (
                        <div
                          key={item}
                          className="flex gap-3 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-3 py-3"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F0FD1]" />
                          <p className="text-sm leading-6 text-[#344054]">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </DetailSection>

                  <DetailSection icon={CheckCircle2} title="Deliverables">
                    <div className="space-y-3">
                      {deliverables.map((item) => (
                        <div
                          key={item}
                          className="flex gap-3 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-3 py-3"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F0FD1]" />
                          <p className="text-sm leading-6 text-[#344054]">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </DetailSection>
                </>
              )}
            </div>

            <aside className="h-fit rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-sm xl:sticky xl:top-24">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF2FF] text-sm font-semibold text-[#2F0FD1]">
                  {getCreatorInitials(quest)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#101828]">
                    {getCompanyName(quest)}
                  </p>
                  <p className="truncate text-sm text-[#667085]">
                    Creator dashboard
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] p-3">
                <p className="text-xs font-medium text-[#667085]">Reward</p>
                <p className="mt-1 text-xl font-semibold text-[#101828]">
                  {reward}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[#EAECF0] bg-white p-3">
                  <Clock3 className="mb-2 h-4 w-4 text-[#2F0FD1]" />
                  <p className="text-xs text-[#667085]">Ends</p>
                  <p className="mt-1 text-sm font-semibold text-[#101828]">
                    {formatDate(quest.endAt)}
                  </p>
                </div>

                <div className="rounded-xl border border-[#EAECF0] bg-white p-3">
                  <Users className="mb-2 h-4 w-4 text-[#2F0FD1]" />
                  <p className="text-xs text-[#667085]">Entries</p>
                  <p className="mt-1 text-sm font-semibold text-[#101828]">
                    {entries.length}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[#EAECF0] bg-white p-3 text-sm leading-6 text-[#667085]">
                {editLocked
                  ? "This quest has started, so editing is locked. You can still review all participant entries."
                  : "This quest has not started yet. You can still edit the quest details before it officially begins."}
              </div>

              <button
                type="button"
                disabled={editLocked}
                onClick={goToEdit}
                className="mt-5 h-11 w-full rounded-xl bg-[#2F0FD1] px-5 text-sm font-medium text-white transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
              >
                {editLocked ? "Editing locked" : "Edit quest"}
              </button>
            </aside>
          </section>
        ) : (
          <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <DetailSection icon={FileText} title="Description">
                <p className="text-sm leading-7 whitespace-pre-line text-[#667085]">
                  {quest.description || "No description provided."}
                </p>
              </DetailSection>

              {quest.instructions ? (
                <DetailSection icon={ShieldCheck} title="Instructions">
                  <p className="text-sm leading-7 whitespace-pre-line text-[#667085]">
                    {quest.instructions}
                  </p>
                </DetailSection>
              ) : null}

              <DetailSection icon={ShieldCheck} title="Eligibility rules">
                <div className="space-y-3">
                  {requirements.map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-3 py-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F0FD1]" />
                      <p className="text-sm leading-6 text-[#344054]">{item}</p>
                    </div>
                  ))}
                </div>
              </DetailSection>

              <DetailSection icon={CheckCircle2} title="Deliverables">
                <div className="space-y-3">
                  {deliverables.map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-3 py-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F0FD1]" />
                      <p className="text-sm leading-6 text-[#344054]">{item}</p>
                    </div>
                  ))}
                </div>
              </DetailSection>
            </div>

            <aside className="h-fit rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-sm xl:sticky xl:top-24">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF2FF] text-sm font-semibold text-[#2F0FD1]">
                  {getCreatorInitials(quest)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#101828]">
                    {getCompanyName(quest)}
                  </p>
                  <p className="truncate text-sm text-[#667085]">
                    {getCreatorName(quest)}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] p-3">
                <p className="text-xs font-medium text-[#667085]">Reward</p>
                <p className="mt-1 text-xl font-semibold text-[#101828]">
                  {reward}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[#EAECF0] bg-white p-3">
                  <Clock3 className="mb-2 h-4 w-4 text-[#2F0FD1]" />
                  <p className="text-xs text-[#667085]">Ends</p>
                  <p className="mt-1 text-sm font-semibold text-[#101828]">
                    {formatDate(quest.endAt)}
                  </p>
                </div>

                <div className="rounded-xl border border-[#EAECF0] bg-white p-3">
                  <Users className="mb-2 h-4 w-4 text-[#2F0FD1]" />
                  <p className="text-xs text-[#667085]">Winners</p>
                  <p className="mt-1 text-sm font-semibold text-[#101828]">
                    {quest.reward?.winnerCount || 1}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[#EAECF0] bg-white p-3 text-sm leading-6 text-[#667085]">
                {alreadySubmitted
                  ? "Your entry has been received. The project team can review your submitted X post."
                  : "Submit a valid public X post that satisfies the quest requirements before the deadline."}
              </div>

              <button
                type="button"
                disabled={alreadySubmitted}
                onClick={goToSubmit}
                className="mt-5 h-11 w-full rounded-xl bg-[#2F0FD1] px-5 text-sm font-medium text-white transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
              >
                {alreadySubmitted ? "Entry received" : "Submit entry"}
              </button>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}
