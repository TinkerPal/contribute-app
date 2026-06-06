import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Clock,
  Coins,
  ExternalLink,
  FileText,
  Hash,
  Link2,
  MessageCircle,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
  Twitter,
  Users,
  Wand2,
  X,
} from "lucide-react";

const initialCampaigns = [
  {
    id: "socketfi-launch",
    title: "Share why SocketFi makes Web3 onboarding easier",
    brand: "SocketFi",
    reward: "100 USDC",
    rewardMode: "Best post wins",
    status: "Active",
    deadline: "3 days left",
    participants: 128,
    submissions: 47,
    category: "Product launch",
    hashtags: ["SocketFi", "Stellar", "Web3UX"],
    targetUrl: "https://x.com/socketfi",
    brief:
      "Create a thoughtful X post explaining how SocketFi helps users access Web3 with passkeys, smart wallets, and simpler onboarding.",
    rules: [
      "Mention SocketFi clearly in your post.",
      "Use at least one suggested hashtag.",
      "Post must be original and publicly accessible.",
      "Paste your X post link after publishing.",
    ],
    judging: "AI quality score + creator review",
  },
  {
    id: "contribute-fi",
    title: "Introduce Contribute.fi to builders and communities",
    brand: "Contribute.fi",
    reward: "250 USDC pool",
    rewardMode: "Top 10 + random draw",
    status: "Active",
    deadline: "6 days left",
    participants: 92,
    submissions: 31,
    category: "Community growth",
    hashtags: ["ContributeFi", "BuildInPublic", "Web3"],
    targetUrl: "https://contribute.fi",
    brief:
      "Write a post that helps project founders understand how Contribute.fi can help them launch tasks, bounties, and contributor campaigns.",
    rules: [
      "Include the project name Contribute.fi.",
      "Explain one clear use case.",
      "Avoid spammy or copied posts.",
      "Paste your X post link for review.",
    ],
    judging: "Top 10 posts selected, then winner picked from finalists",
  },
  {
    id: "stellar-builders",
    title: "Tell developers why they should build on Stellar",
    brand: "Stellar Builders",
    reward: "75 USDC",
    rewardMode: "Creator selects winner",
    status: "Active",
    deadline: "2 days left",
    participants: 64,
    submissions: 22,
    category: "Developer awareness",
    hashtags: ["Stellar", "Soroban", "Web3Dev"],
    targetUrl: "https://stellar.org",
    brief:
      "Create a concise post for developers about building fast, affordable, real-world apps on Stellar and Soroban.",
    rules: [
      "Make the post useful for builders.",
      "Use at least one suggested hashtag.",
      "No copied content or low-effort replies.",
      "Submit your post URL before the deadline.",
    ],
    judging: "Creator review + engagement quality",
  },
];

const sampleSubmissions = [
  {
    name: "Ari",
    handle: "@ari_builds",
    campaign: "SocketFi",
    score: 94,
    status: "Finalist",
    text: "SocketFi makes crypto feel less like setup and more like signing in. Passkeys, smart wallets, and better UX can bring Web3 to regular users.",
  },
  {
    name: "Maya",
    handle: "@mayawrites",
    campaign: "Contribute.fi",
    score: 89,
    status: "Reviewed",
    text: "Contributor campaigns should feel simple: post tasks, attract builders, verify work, and reward value. That is the promise of Contribute.fi.",
  },
  {
    name: "Tolu",
    handle: "@toludev",
    campaign: "Stellar Builders",
    score: 86,
    status: "Reviewed",
    text: "Stellar keeps Web3 practical: fast settlement, low fees, and Soroban smart contracts for real products people can actually use.",
  },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "border-slate-200 bg-white text-slate-700",
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    purple: "border-violet-100 bg-violet-50 text-violet-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary:
      "bg-slate-950 text-white shadow-sm shadow-slate-950/10 hover:bg-slate-800",
    secondary:
      "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
    ghost: "text-slate-700 hover:bg-slate-100",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function MetricCard({ icon: Icon, label, value, description }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
        <Icon size={20} />
      </div>
      <p className="text-2xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function CampaignCard({ campaign, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(campaign)}
      className={cn(
        "w-full rounded-3xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        selected ? "border-slate-950" : "border-slate-200",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge tone="green">{campaign.status}</Badge>
        <span className="text-sm font-semibold text-slate-500">
          {campaign.deadline}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold text-violet-700">
          {campaign.brand}
        </p>
        <h3 className="mt-1 text-lg leading-snug font-bold text-slate-950">
          {campaign.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {campaign.brief}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-500">Reward</p>
          <p className="mt-1 font-bold text-slate-950">{campaign.reward}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-500">Submissions</p>
          <p className="mt-1 font-bold text-slate-950">
            {campaign.submissions}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {campaign.hashtags.map((tag) => (
          <Badge key={tag}>#{tag}</Badge>
        ))}
      </div>
    </button>
  );
}

function CreateCampaignPanel({ onCreate }) {
  const [form, setForm] = useState({
    title: "",
    reward: "",
    brief: "",
    hashtags: "",
    rewardMode: "Best post wins",
  });

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitCampaign() {
    if (!form.title || !form.reward || !form.brief) return;

    const campaign = {
      id: crypto.randomUUID(),
      title: form.title,
      brand: "New campaign",
      reward: form.reward,
      rewardMode: form.rewardMode,
      status: "Active",
      deadline: "7 days left",
      participants: 0,
      submissions: 0,
      category: "Engagement",
      hashtags: form.hashtags
        .split(",")
        .map((tag) => tag.trim().replace(/^#/, ""))
        .filter(Boolean),
      targetUrl: "https://x.com",
      brief: form.brief,
      rules: [
        "Create an original public X post.",
        "Follow the campaign brief.",
        "Paste your X post link after publishing.",
      ],
      judging: form.rewardMode,
    };

    onCreate(campaign);
    setForm({
      title: "",
      reward: "",
      brief: "",
      hashtags: "",
      rewardMode: "Best post wins",
    });
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge tone="purple">
            <Plus size={13} /> Create request
          </Badge>
          <h2 className="mt-3 text-xl font-bold text-slate-950">
            Launch an engagement campaign
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Set the brief, reward pool, hashtags, and winner selection method.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <input
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="Campaign title"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition outline-none focus:border-slate-950"
        />
        <textarea
          value={form.brief}
          onChange={(event) => updateField("brief", event.target.value)}
          placeholder="What should people post about?"
          rows={4}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition outline-none focus:border-slate-950"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            value={form.reward}
            onChange={(event) => updateField("reward", event.target.value)}
            placeholder="Reward, e.g. 100 USDC"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition outline-none focus:border-slate-950"
          />
          <select
            value={form.rewardMode}
            onChange={(event) => updateField("rewardMode", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition outline-none focus:border-slate-950"
          >
            <option>Best post wins</option>
            <option>Top 10 + random draw</option>
            <option>Creator selects winner</option>
            <option>Reward pool split</option>
          </select>
        </div>
        <input
          value={form.hashtags}
          onChange={(event) => updateField("hashtags", event.target.value)}
          placeholder="Suggested hashtags, comma separated"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition outline-none focus:border-slate-950"
        />
        <Button onClick={submitCampaign} className="w-full">
          Publish campaign <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function CampaignDetails({ campaign, onStart }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge tone="green">{campaign.status}</Badge>
        <Badge tone="blue">
          <Clock size={13} /> {campaign.deadline}
        </Badge>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-violet-700">
          {campaign.brand}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          {campaign.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {campaign.brief}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <Coins className="text-slate-700" size={18} />
          <p className="mt-3 text-xs font-medium text-slate-500">Reward</p>
          <p className="mt-1 font-bold text-slate-950">{campaign.reward}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <Trophy className="text-slate-700" size={18} />
          <p className="mt-3 text-xs font-medium text-slate-500">Selection</p>
          <p className="mt-1 font-bold text-slate-950">{campaign.rewardMode}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <Users className="text-slate-700" size={18} />
          <p className="mt-3 text-xs font-medium text-slate-500">
            Participants
          </p>
          <p className="mt-1 font-bold text-slate-950">
            {campaign.participants}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-slate-950">Campaign rules</h3>
        <div className="mt-3 space-y-2">
          {campaign.rules.map((rule) => (
            <div key={rule} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
              <CheckCircle2
                className="mt-0.5 shrink-0 text-emerald-600"
                size={16}
              />
              <p className="text-sm leading-6 text-slate-600">{rule}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {campaign.hashtags.map((tag) => (
          <Badge key={tag}>
            <Hash size={13} /> {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={onStart} className="flex-1">
          Create post <Send size={16} />
        </Button>
        <Button variant="secondary" className="flex-1">
          View source <ExternalLink size={16} />
        </Button>
      </div>
    </div>
  );
}

function ComposerPanel({ campaign, onClose, onSubmit }) {
  const starter = `I am checking out ${campaign.brand}. ${campaign.brief} #${campaign.hashtags[0] || "Web3"}`;
  const [draft, setDraft] = useState(starter);
  const [postUrl, setPostUrl] = useState("");
  const [step, setStep] = useState("write");
  const [isRefined, setIsRefined] = useState(false);

  function refinePost() {
    const hashtagText = campaign.hashtags.map((tag) => `#${tag}`).join(" ");
    setDraft(
      `${campaign.brand} is making Web3 engagement feel more practical. ${campaign.brief.replace(
        /\.$/,
        "",
      )}. Clear onboarding, real participation, and better rewards can help more users discover useful crypto products. ${hashtagText}`,
    );
    setIsRefined(true);
  }

  function openTwitterIntent() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(draft)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setStep("submit");
  }

  function submitPost() {
    if (!postUrl) return;
    onSubmit({
      name: "You",
      handle: "@yourhandle",
      campaign: campaign.brand,
      score: isRefined ? 91 : 78,
      status: "Submitted",
      text: draft,
      url: postUrl,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/40 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge tone="purple">
              <Sparkles size={13} /> AI assisted post
            </Badge>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              Create your campaign post
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Draft, improve, publish on X, then paste your post link for
              review.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div
            className={cn(
              "rounded-2xl border p-4",
              step === "write"
                ? "border-slate-950 bg-slate-50"
                : "border-slate-200",
            )}
          >
            <p className="text-sm font-bold text-slate-950">
              1. Write and publish
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Create a clear post using the campaign brief.
            </p>
          </div>
          <div
            className={cn(
              "rounded-2xl border p-4",
              step === "submit"
                ? "border-slate-950 bg-slate-50"
                : "border-slate-200",
            )}
          >
            <p className="text-sm font-bold text-slate-950">
              2. Submit post link
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Paste the public X post URL for verification.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap gap-2">
            {campaign.hashtags.map((tag) => (
              <Badge key={tag}>#{tag}</Badge>
            ))}
          </div>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={7}
            className="mt-4 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 transition outline-none focus:border-slate-950"
          />
          <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-500">
            <span>{draft.length}/280 characters</span>
            <span>{isRefined ? "AI improved" : "Draft ready"}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={refinePost} className="flex-1">
            Improve with AI <Wand2 size={16} />
          </Button>
          <Button onClick={openTwitterIntent} className="flex-1">
            Post on X <Twitter size={16} />
          </Button>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4">
          <label className="text-sm font-bold text-slate-950">
            Paste your X post link
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              value={postUrl}
              onChange={(event) => setPostUrl(event.target.value)}
              placeholder="https://x.com/username/status/..."
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm transition outline-none focus:border-slate-950"
            />
            <Button onClick={submitPost} disabled={!postUrl}>
              Submit <ArrowRight size={16} />
            </Button>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            The platform can fetch the public embed, read the post content, and
            send it for AI scoring and creator review.
          </p>
        </div>
      </div>
    </div>
  );
}

function Leaderboard({ submissions }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950">Live submissions</h2>
          <p className="mt-1 text-sm text-slate-500">
            AI-assisted review helps surface quality posts.
          </p>
        </div>
        <Badge tone="amber">
          <BarChart3 size={13} /> Scored
        </Badge>
      </div>

      <div className="mt-5 space-y-3">
        {submissions.map((item) => (
          <div
            key={`${item.handle}-${item.text}`}
            className="rounded-3xl border border-slate-200 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-950">{item.name}</p>
                <p className="text-sm text-slate-500">{item.handle}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={item.status === "Finalist" ? "green" : "blue"}>
                  {item.status}
                </Badge>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-bold text-white">
                  {item.score}
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EngageToEarn2() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState(initialCampaigns[0]);
  const [query, setQuery] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [submissions, setSubmissions] = useState(sampleSubmissions);

  const filteredCampaigns = useMemo(() => {
    const search = query.toLowerCase().trim();
    if (!search) return campaigns;

    return campaigns.filter((campaign) => {
      return [
        campaign.title,
        campaign.brand,
        campaign.brief,
        campaign.category,
        campaign.hashtags.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
  }, [campaigns, query]);

  function createCampaign(campaign) {
    setCampaigns((current) => [campaign, ...current]);
    setSelectedCampaign(campaign);
  }

  function addSubmission(submission) {
    setSubmissions((current) => [submission, ...current]);
    setCampaigns((current) =>
      current.map((campaign) =>
        campaign.id === selectedCampaign.id
          ? {
              ...campaign,
              submissions: campaign.submissions + 1,
              participants: campaign.participants + 1,
            }
          : campaign,
      ),
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#EEF2FF,transparent_32%),linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              <MessageCircle size={20} />
            </div>
            <div>
              <p className="text-base font-black tracking-tight">Engage2Earn</p>
              <p className="text-xs font-medium text-slate-500">
                Social campaigns powered by rewards
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            <a href="#campaigns" className="hover:text-slate-950">
              Campaigns
            </a>
            <a href="#create" className="hover:text-slate-950">
              Create
            </a>
            <a href="#submissions" className="hover:text-slate-950">
              Submissions
            </a>
          </nav>

          <Button className="hidden sm:inline-flex">
            Connect wallet <ShieldCheck size={16} />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 sm:p-8 lg:p-10">
            <Badge tone="purple">
              <Sparkles size={13} /> Twitter/X engagement marketplace
            </Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Reward high-quality posts, not empty engagement.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Create campaigns, guide contributors with clear context, let AI
              improve submissions, and reward the best posts from a funded prize
              pool.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() =>
                  document
                    .getElementById("campaigns")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore campaigns <ArrowRight size={16} />
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  document
                    .getElementById("create")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Create request <Plus size={16} />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <MetricCard
              icon={Coins}
              value="$425"
              label="Active rewards"
              description="Reward pools currently available for creators."
            />
            <MetricCard
              icon={FileText}
              value="100"
              label="Submitted posts"
              description="Public X posts submitted for review and scoring."
            />
            <MetricCard
              icon={BadgeCheck}
              value="AI + review"
              label="Quality selection"
              description="Score posts by relevance, originality, clarity, and impact."
            />
          </div>
        </section>

        <section
          id="campaigns"
          className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Search size={18} className="text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search campaigns, brands, or hashtags"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  selected={selectedCampaign.id === campaign.id}
                  onSelect={setSelectedCampaign}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <CampaignDetails
              campaign={selectedCampaign}
              onStart={() => setComposerOpen(true)}
            />
          </div>
        </section>

        <section
          id="create"
          className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <CreateCampaignPanel onCreate={createCampaign} />

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <Badge tone="blue">
              <Link2 size={13} /> Verification flow
            </Badge>
            <h2 className="mt-4 text-2xl font-bold tracking-tight">
              Simple flow for contributors and campaign creators.
            </h2>
            <div className="mt-6 grid gap-3">
              {[
                "Creator funds or defines a campaign reward pool.",
                "Contributor opens the brief and writes a post with optional AI refinement.",
                "Contributor posts on X and submits the public post URL.",
                "Platform fetches the public embed, extracts content, scores quality, and queues review.",
                "Winner is selected by best post, finalists, random draw, or creator review.",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-2xl bg-white/10 p-4"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-slate-950">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="submissions" className="mt-8">
          <Leaderboard submissions={submissions} />
        </section>
      </main>

      {composerOpen && (
        <ComposerPanel
          campaign={selectedCampaign}
          onClose={() => setComposerOpen(false)}
          onSubmit={addSubmission}
        />
      )}
    </div>
  );
}
