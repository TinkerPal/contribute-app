import { useMemo } from "react";
import {
  Camera,
  Mail,
  User,
  CalendarDays,
  ShieldCheck,
  Wallet,
  Link2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { FaUserLarge } from "react-icons/fa6";
import Heading from "@/components/dashboard/Heading";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";

function ProfileStatCard({ label, value, icon, accent = "blue", helperText }) {
  const accentStyles = {
    blue: {
      card: "border-[#E0E7FF] bg-gradient-to-br from-white to-[#F8FAFF]",
      iconWrap: "bg-[#EEF2FF] text-[#2F0FD1]",
      line: "bg-[#2F0FD1]",
    },
    green: {
      card: "border-[#D9F3DC] bg-gradient-to-br from-white to-[#F6FFF7]",
      iconWrap: "bg-[#EAFBF0] text-[#2E9B4F]",
      line: "bg-[#2E9B4F]",
    },
    orange: {
      card: "border-[#FDE7C7] bg-gradient-to-br from-white to-[#FFF9F2]",
      iconWrap: "bg-[#FFF1DE] text-[#D9822F]",
      line: "bg-[#D9822F]",
    },
    purple: {
      card: "border-[#E9DDFF] bg-gradient-to-br from-white to-[#FAF7FF]",
      iconWrap: "bg-[#F3ECFF] text-[#7C3AED]",
      line: "bg-[#7C3AED]",
    },
  };

  const theme = accentStyles[accent] || accentStyles.blue;

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        theme.card,
      ].join(" ")}
    >
      <div className={`absolute top-0 left-0 h-full w-1 ${theme.line}`} />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium tracking-wide text-[#667085]">
            {label}
          </p>
          <p className="mt-2 text-[28px] leading-none font-semibold tracking-tight text-[#101828]">
            {value}
          </p>
          {helperText ? (
            <p className="mt-2 text-xs text-[#98A2B3]">{helperText}</p>
          ) : null}
        </div>

        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-200",
            "group-hover:scale-105",
            theme.iconWrap,
          ].join(" ")}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, muted = false }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#F2F4F7] bg-[#FCFCFD] px-4 py-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4F7FF] text-[#2F0FD1]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium tracking-[0.08em] text-[#98A2B3] uppercase">
          {label}
        </p>
        <p
          className={[
            "mt-1 text-sm font-medium",
            muted ? "text-[#98A2B3]" : "text-[#101828]",
          ].join(" ")}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ connected, label }) {
  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium",
        connected
          ? "bg-[#ECFDF3] text-[#027A48]"
          : "bg-[#FEF3F2] text-[#B42318]",
      ].join(" ")}
    >
      {connected ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <span>{label}</span>
    </div>
  );
}

function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { publicKey } = useWallet();

  const fullName = useMemo(() => {
    const first = user?.firstName || "";
    const last = user?.lastName || "";
    const joined = `${first} ${last}`.trim();
    return joined || user?.username || "Unnamed User";
  }, [user]);

  const username = user?.username || user?.handle || "No username set";
  const email = user?.email || "No email connected";
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "Not available";

  const stats = [
    {
      label: "Tasks In Progress",
      value: user?.stats?.tasksInProgress ?? 0,
      icon: <Sparkles className="h-5 w-5" />,
      accent: "blue",
      helperText: "Tasks you are currently working on",
    },
    {
      label: "Amount Earned",
      value: `$${user?.stats?.amountEarned ?? 0}`,
      icon: <Wallet className="h-5 w-5" />,
      accent: "green",
      helperText: "Rewards earned from participation",
    },
    {
      label: "Communities Joined",
      value: user?.stats?.communitiesJoined ?? 0,
      icon: <User className="h-5 w-5" />,
      accent: "purple",
      helperText: "Communities you are actively part of",
    },
    {
      label: "Reputation Score",
      value: `${user?.stats?.reputationScore ?? 0}/10`,
      icon: <ShieldCheck className="h-5 w-5" />,
      accent: "orange",
      helperText: "Your current contributor standing",
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="md:hidden">
          <Heading />
        </div>

        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[#D9E1F2] bg-white px-6 py-10 text-center shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F7FF] text-[#2F0FD1]">
            <User className="h-8 w-8" />
          </div>

          <div className="max-w-lg space-y-2">
            <h2 className="text-[24px] font-semibold tracking-tight text-[#101828]">
              Sign in to view your profile
            </h2>
            <p className="text-sm leading-6 text-[#667085]">
              Your profile will show your connected accounts, contributor stats,
              wallet details, and activity summary.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:hidden">
        <Heading />
      </div>

      <section className="overflow-hidden rounded-[28px] border border-[#EEF2FF] bg-white shadow-sm">
        <div className="border-b border-[#F2F4F7] bg-gradient-to-r from-[#FCFCFD] to-[#F8FAFF] px-5 py-6 lg:px-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[#E4E7EC] bg-[#F8FAFC] shadow-sm">
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaUserLarge className="text-[34px] text-[#B2B9C7]" />
                  )}
                </div>

                <div className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border border-white bg-[#2F0FD1] text-white shadow-sm">
                  <Camera className="h-4 w-4" />
                </div>
              </div>

              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center rounded-full bg-[#EEF2FF] px-3 py-1 text-sm font-medium text-[#2F0FD1]">
                    Profile
                  </div>
                  <StatusBadge
                    connected={Boolean(publicKey)}
                    label={
                      publicKey ? "Wallet connected" : "Wallet not connected"
                    }
                  />
                </div>

                <div>
                  <h1 className="truncate text-[28px] font-semibold tracking-tight text-[#101828]">
                    {fullName}
                  </h1>
                  <p className="mt-1 text-sm text-[#667085]">@{username}</p>
                </div>

                <p className="max-w-2xl text-[15px] leading-7 text-[#667085]">
                  Manage your account details, review connected services, and
                  keep track of your contributor activity from one place.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
              <Button
                variant="outline"
                className="h-11 rounded-xl border-[#D0D5DD] bg-white px-6 text-sm font-medium text-[#344054] hover:bg-[#F9FAFB]"
              >
                Edit Profile
              </Button>

              <Button className="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]">
                Manage Account
              </Button>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 lg:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <ProfileStatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                accent={stat.accent}
                helperText={stat.helperText}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[28px] border border-[#EEF2FF] bg-white p-5 shadow-sm lg:p-6">
          <div className="mb-5">
            <h2 className="text-[22px] font-semibold tracking-tight text-[#101828]">
              Account Information
            </h2>
            <p className="mt-1 text-sm text-[#667085]">
              Your personal and account-related information.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoRow
              icon={<User className="h-4 w-4" />}
              label="Full Name"
              value={fullName}
            />
            <InfoRow
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={email}
              muted={!user?.email}
            />
            <InfoRow
              icon={<Link2 className="h-4 w-4" />}
              label="Username"
              value={`@${username}`}
            />
            <InfoRow
              icon={<CalendarDays className="h-4 w-4" />}
              label="Joined"
              value={joinedDate}
            />
          </div>
        </section>

        <section className="rounded-[28px] border border-[#EEF2FF] bg-white p-5 shadow-sm lg:p-6">
          <div className="mb-5">
            <h2 className="text-[22px] font-semibold tracking-tight text-[#101828]">
              Connected Services
            </h2>
            <p className="mt-1 text-sm text-[#667085]">
              Review the services and accounts linked to your profile.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-[#F2F4F7] bg-[#FCFCFD] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[#101828]">Wallet</p>
                <p className="mt-1 text-xs text-[#667085]">
                  {publicKey ? publicKey : "No wallet connected"}
                </p>
              </div>
              <StatusBadge
                connected={Boolean(publicKey)}
                label={publicKey ? "Connected" : "Not connected"}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#F2F4F7] bg-[#FCFCFD] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[#101828]">Email</p>
                <p className="mt-1 text-xs text-[#667085]">
                  {user?.email || "No email connected"}
                </p>
              </div>
              <StatusBadge
                connected={Boolean(user?.email)}
                label={user?.email ? "Connected" : "Not connected"}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#F2F4F7] bg-[#FCFCFD] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[#101828]">
                  Profile Status
                </p>
                <p className="mt-1 text-xs text-[#667085]">
                  Keep your account information updated for better
                  participation.
                </p>
              </div>
              <StatusBadge connected label="Active" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
