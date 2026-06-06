import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Globe,
  Heart,
  Instagram,
  MessageCircle,
  Music2,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Twitter,
  Users,
  WalletCards,
} from "lucide-react";

const twitterProfile = {
  id: "1827473072988864512",
  username: "Socket_Fi",
  displayName: "SocketFi",
  provider: "twitter",
  avatar:
    "https://pbs.twimg.com/profile_images/1828184024059154432/IInR1E_8_normal.jpg",
  banner:
    "https://pbs.twimg.com/profile_banners/1827473072988864512/1724708026",
  description:
    "Smart non-custodial wallet, simplifying access to web3 and decentralized applications",
  website: "https://socket.fi",
  followers: 166,
  following: 24,
  listed: 1,
  likes: 30,
  posts: 26,
  verified: false,
  protected: false,
  createdAt: "Sat Aug 24 22:28:48 +0000 2024",
  latestPost: {
    text: "🔥 SocketFi Smart Wallet & SDK\n\n❌ No passwords\n❌ No friction\n✅ Just seamless, secure access with passkeys\n\nBuild and…",
    createdAt: "Fri May 01 13:40:02 +0000 2026",
    retweets: 3,
    likes: 9,
    source: "Twitter Web App",
  },
};

const contributorStats = {
  reputationScore: 82,
  globalRank: "Top 12%",
  completedQuests: 18,
  approvedSubmissions: 14,
  earned: "1,250 USDC",
  connectedPlatforms: 4,
};

const platforms = [
  {
    name: "X / Twitter",
    handle: "@Socket_Fi",
    icon: Twitter,
    status: "Connected",
    score: 84,
    activity: "Strong",
    description: "Profile, posts, engagement, audience and quest performance.",
  },
  {
    name: "TikTok",
    handle: "@socketfi",
    icon: Music2,
    status: "Connected",
    score: 71,
    activity: "Growing",
    description: "Video engagement, creator reach, campaign submissions.",
  },
  {
    name: "Instagram",
    handle: "@socketfi",
    icon: Instagram,
    status: "Coming soon",
    score: 0,
    activity: "Pending",
    description: "Creator profile, posts, reels and social proof.",
  },
  {
    name: "Discord",
    handle: "SocketFi",
    icon: MessageCircle,
    status: "Coming soon",
    score: 0,
    activity: "Pending",
    description: "Community reputation, messages and participation quality.",
  },
];

function MetricCard({ label, value, helper }) {
  return (
    <div className="rounded-xl border border-[#F2F4F7] bg-[#FCFCFD] px-4 py-3">
      <p className="text-[11px] text-[#667085]">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tracking-tight text-[#101828]">
        {value}
      </p>
      {helper ? (
        <p className="mt-0.5 text-[11px] text-[#98A2B3]">{helper}</p>
      ) : null}
    </div>
  );
}

function PlatformCard({ platform, active }) {
  const Icon = platform.icon;
  const isConnected = platform.status === "Connected";

  return (
    <button
      type="button"
      className={`group rounded-2xl border bg-white p-4 text-left transition hover:border-[#D6D9E6] hover:shadow-sm ${
        active ? "border-[#2F0FD1] shadow-sm" : "border-[#EAECF0]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#2F0FD1]">
          <Icon className="h-5 w-5" />
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            isConnected
              ? "bg-[#ECFDF3] text-[#027A48]"
              : "bg-[#F2F4F7] text-[#667085]"
          }`}
        >
          {platform.status}
        </span>
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[#101828]">
        {platform.name}
      </h3>
      <p className="mt-1 text-xs font-medium text-[#2F0FD1]">
        {platform.handle}
      </p>
      <p className="mt-2 text-sm leading-6 text-[#667085]">
        {platform.description}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#F2F4F7] pt-3">
        <div>
          <p className="text-[11px] text-[#98A2B3]">Platform score</p>
          <p className="text-sm font-semibold text-[#101828]">
            {platform.score ? `${platform.score}/100` : "—"}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-[#98A2B3]">Activity</p>
          <p className="text-sm font-semibold text-[#101828]">
            {platform.activity}
          </p>
        </div>
      </div>
    </button>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#F2F4F7] py-3 last:border-b-0">
      <span className="text-sm text-[#667085]">{label}</span>
      <span className="text-sm font-medium text-[#101828]">{value}</span>
    </div>
  );
}

function StatusItem({ icon: Icon, title, description }) {
  return (
    <div className="flex gap-3 rounded-xl bg-[#F8FAFC] px-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#2F0FD1] shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#101828]">{title}</p>
        <p className="mt-1 text-sm text-[#667085]">{description}</p>
      </div>
    </div>
  );
}

export default function ContributorProfilePage() {
  const accountCreated = new Date(twitterProfile.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <main className="min-h-screen">
      <div className="space-y-3 px-2 py-2">
        <section className="overflow-hidden rounded-3xl border border-[#EAECF0] bg-white shadow-sm">
          <div className="relative p-5 sm:p-6 lg:p-7">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-[#EEF2FF] blur-3xl" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex h-7 items-center gap-2 rounded-full border border-[#E0E7FF] bg-[#F4F7FF] px-2.5 text-xs font-medium text-[#2F0FD1]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Contributor profile
                </div>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#101828] sm:text-4xl">
                  Reputation and connected accounts
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085] sm:text-base">
                  View global contributor reputation, connected social accounts,
                  and platform-specific engagement metrics.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
              >
                Edit profile
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-4">
              <MetricCard
                label="Reputation score"
                value={`${contributorStats.reputationScore}/100`}
                helper={contributorStats.globalRank}
              />
              <MetricCard
                label="Completed quests"
                value={contributorStats.completedQuests}
                helper="Across connected platforms"
              />
              <MetricCard
                label="Approved submissions"
                value={contributorStats.approvedSubmissions}
                helper="Verified by projects"
              />
              <MetricCard
                label="Total earned"
                value={contributorStats.earned}
                helper="Approved rewards"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold text-[#101828]">
                  Connected platforms
                </h2>
                <p className="text-sm text-[#667085]">
                  Each platform can have its own engagement metrics, profile
                  strength, quest history, and contribution score.
                </p>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {platforms.map((platform) => (
                  <PlatformCard
                    key={platform.name}
                    platform={platform}
                    active={platform.name === "X / Twitter"}
                  />
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-[#EAECF0] bg-white shadow-sm">
              <div
                className="h-32 bg-cover bg-center"
                style={{ backgroundImage: `url(${twitterProfile.banner})` }}
              />

              <div className="p-4">
                <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-end gap-3">
                    <img
                      src={twitterProfile.avatar}
                      alt={twitterProfile.displayName}
                      className="h-20 w-20 rounded-2xl border-4 border-white bg-white object-cover shadow-sm"
                    />

                    <div className="pb-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-[#101828]">
                          {twitterProfile.displayName}
                        </h2>
                        {twitterProfile.verified ? (
                          <BadgeCheck className="h-4 w-4 text-[#2F0FD1]" />
                        ) : null}
                      </div>
                      <p className="text-sm text-[#667085]">
                        @{twitterProfile.username}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`https://x.com/${twitterProfile.username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-4 text-sm font-medium text-[#101828] transition hover:bg-[#F9FAFB]"
                  >
                    View on X
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
                  {twitterProfile.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F7FF] px-2.5 py-1 text-xs font-medium text-[#2F0FD1]">
                    <Globe className="h-3.5 w-3.5" />
                    {twitterProfile.website}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#667085]">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Joined {accountCreated}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF3] px-2.5 py-1 text-xs font-medium text-[#027A48]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {twitterProfile.protected ? "Protected" : "Public profile"}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-5">
                  <MetricCard
                    label="Followers"
                    value={twitterProfile.followers}
                    helper="Audience size"
                  />
                  <MetricCard
                    label="Following"
                    value={twitterProfile.following}
                    helper="Network"
                  />
                  <MetricCard
                    label="Posts"
                    value={twitterProfile.posts}
                    helper="Published content"
                  />
                  <MetricCard
                    label="Likes"
                    value={twitterProfile.likes}
                    helper="Total favorites"
                  />
                  <MetricCard
                    label="Listed"
                    value={twitterProfile.listed}
                    helper="Public lists"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold text-[#101828]">
                  Latest X activity
                </h2>
                <p className="text-sm text-[#667085]">
                  Recent profile activity can help calculate social contribution
                  quality.
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
                <p className="text-sm leading-6 whitespace-pre-line text-[#101828]">
                  {twitterProfile.latestPost.text}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-[#F2F4F7] pt-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[#667085]">
                    <ArrowRight className="h-3.5 w-3.5" />
                    {twitterProfile.latestPost.retweets} reposts
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[#667085]">
                    <Heart className="h-3.5 w-3.5" />
                    {twitterProfile.latestPost.likes} likes
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[#667085]">
                    <Globe className="h-3.5 w-3.5" />
                    {twitterProfile.latestPost.source}
                  </span>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-[#101828]">
                Reputation breakdown
              </h3>

              <div className="mt-4 space-y-3">
                <StatusItem
                  icon={Trophy}
                  title="Contribution quality"
                  description="Approved submissions and project feedback."
                />
                <StatusItem
                  icon={BarChart3}
                  title="Social engagement"
                  description="Platform reach, post activity, and campaign proof."
                />
                <StatusItem
                  icon={CheckCircle2}
                  title="Verification"
                  description="Connected accounts and verified contribution history."
                />
              </div>
            </section>

            <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-[#101828]">
                Account details
              </h3>

              <div className="mt-2">
                <InfoRow label="Provider" value="Twitter" />
                <InfoRow
                  label="Username"
                  value={`@${twitterProfile.username}`}
                />
                <InfoRow
                  label="Verified"
                  value={twitterProfile.verified ? "Yes" : "No"}
                />
                <InfoRow
                  label="Protected"
                  value={twitterProfile.protected ? "Yes" : "No"}
                />
                <InfoRow label="Account ID" value={twitterProfile.id} />
              </div>
            </section>

            <section className="rounded-2xl bg-[#101828] p-5 text-white shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <WalletCards className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                Build portable reputation
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Combine social accounts, contribution history, and platform
                analytics into one trusted contributor profile.
              </p>

              <button
                type="button"
                className="mt-5 h-10 w-full rounded-xl bg-white px-4 text-sm font-medium text-[#101828] transition hover:bg-[#F2F4F7]"
              >
                Connect another account
              </button>
            </section>

            <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-[#101828]">
                Suggested scoring model
              </h3>

              <div className="mt-4 space-y-3">
                <StatusItem
                  icon={Users}
                  title="Audience"
                  description="Followers, reach, profile completeness."
                />
                <StatusItem
                  icon={Star}
                  title="Engagement"
                  description="Likes, reposts, comments, campaign activity."
                />
                <StatusItem
                  icon={ShieldCheck}
                  title="Trust"
                  description="Verified accounts, completed quests, approvals."
                />
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
