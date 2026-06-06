import { useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  Filter,
  Sparkles,
  BriefcaseBusiness,
  Users,
  Wallet,
  Megaphone,
  Info,
} from "lucide-react";
import Heading from "@/components/dashboard/Heading";
import { Button } from "@/components/ui/button";

const VIEW_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Tasks", value: "tasks" },
  { label: "Communities", value: "communities" },
  { label: "Rewards", value: "rewards" },
];

function NotificationStatCard({
  label,
  value,
  icon,
  accent = "blue",
  helperText,
}) {
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

function InfoPill({ icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#E8EDF7] bg-[#F8FAFC] px-3 py-2 text-sm text-[#667085]">
      <span className="text-[#2F0FD1]">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function NotificationIcon({ type }) {
  const iconMap = {
    task: <BriefcaseBusiness className="h-4 w-4" />,
    community: <Users className="h-4 w-4" />,
    reward: <Wallet className="h-4 w-4" />,
    burst: <Megaphone className="h-4 w-4" />,
    system: <Info className="h-4 w-4" />,
  };

  return iconMap[type] || <Bell className="h-4 w-4" />;
}

function NotificationRow({ item, onMarkRead }) {
  return (
    <div
      className={[
        "rounded-2xl border p-4 shadow-sm transition hover:shadow-md",
        item.read
          ? "border-[#E6EAF5] bg-white"
          : "border-[#DCE4F8] bg-[#FAFBFF]",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            item.read
              ? "bg-[#F4F7FF] text-[#667085]"
              : "bg-[#EEF2FF] text-[#2F0FD1]",
          ].join(" ")}
        >
          <NotificationIcon type={item.type} />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-[#101828]">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-[#667085]">
                {item.description}
              </p>
            </div>

            {!item.read ? (
              <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[11px] font-medium text-[#2F0FD1]">
                Unread
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#98A2B3]">
              <span>{item.time}</span>
              <span>•</span>
              <span className="capitalize">{item.type}</span>
            </div>

            <div className="flex items-center gap-2">
              {!item.read ? (
                <Button
                  variant="outline"
                  onClick={() => onMarkRead(item.id)}
                  className="h-9 rounded-xl border-[#D0D5DD] bg-white px-3 text-xs font-medium text-[#344054] hover:bg-[#F9FAFB]"
                >
                  Mark as read
                </Button>
              ) : null}

              <Button
                variant="ghost"
                className="h-9 rounded-xl px-3 text-xs font-medium text-[#2F0FD1] hover:bg-[#F4F7FF]"
              >
                View details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Notifications() {
  const [view, setView] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "task",
      title: "Task approved",
      description:
        "Your submission for 'Growth Task Reward' has been approved.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      type: "community",
      title: "New community joined",
      description: "You have successfully joined Stellar Builders.",
      time: "Yesterday",
      read: true,
    },
    {
      id: "3",
      type: "reward",
      title: "Reward available to claim",
      description: "A reward is now claimable from your recent contribution.",
      time: "2 days ago",
      read: false,
    },
    {
      id: "4",
      type: "burst",
      title: "Burst submission selected",
      description: "One of your burst entries has been shortlisted for review.",
      time: "3 days ago",
      read: true,
    },
    {
      id: "5",
      type: "system",
      title: "System update",
      description:
        "Your dashboard experience has been updated with new features.",
      time: "1 week ago",
      read: true,
    },
  ]);

  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((item) => !item.read).length;
    const tasks = notifications.filter((item) => item.type === "task").length;
    const rewards = notifications.filter(
      (item) => item.type === "reward",
    ).length;

    return { total, unread, tasks, rewards };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (view === "all") return notifications;
    if (view === "unread") return notifications.filter((item) => !item.read);
    if (view === "tasks")
      return notifications.filter((item) => item.type === "task");
    if (view === "communities")
      return notifications.filter((item) => item.type === "community");
    if (view === "rewards")
      return notifications.filter((item) => item.type === "reward");
    return notifications;
  }, [notifications, view]);

  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  return (
    <div className="space-y-6">
      <div className="md:hidden">
        <Heading />
      </div>

      <section className="overflow-hidden rounded-[28px] border border-[#EEF2FF] bg-white shadow-sm">
        <div className="border-b border-[#F2F4F7] bg-gradient-to-r from-[#FCFCFD] to-[#F8FAFF] px-5 py-6 lg:px-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1.5 text-sm font-medium text-[#2F0FD1]">
                <Bell className="h-4 w-4" />
                Notifications
              </div>

              <div className="space-y-2">
                <h2 className="text-[28px] font-semibold tracking-tight text-[#101828]">
                  Stay updated on tasks, rewards, and community activity
                </h2>
                <p className="max-w-2xl text-[15px] leading-7 text-[#667085]">
                  Review important updates, follow task and reward progress, and
                  keep track of platform activity from one place.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <InfoPill
                  icon={<Bell className="h-4 w-4" />}
                  label="All updates in one place"
                />
                <InfoPill
                  icon={<CheckCheck className="h-4 w-4" />}
                  label="Track unread activity"
                />
                <InfoPill
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Stay on top of rewards and tasks"
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:flex-col">
              <Button
                onClick={handleMarkAllRead}
                className="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
              >
                Mark All as Read
              </Button>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 lg:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <NotificationStatCard
              label="Total Notifications"
              value={stats.total}
              icon={<Bell className="h-5 w-5" />}
              accent="blue"
              helperText="All notifications in your feed"
            />
            <NotificationStatCard
              label="Unread"
              value={stats.unread}
              icon={<CheckCheck className="h-5 w-5" />}
              accent="orange"
              helperText="Notifications awaiting review"
            />
            <NotificationStatCard
              label="Task Updates"
              value={stats.tasks}
              icon={<BriefcaseBusiness className="h-5 w-5" />}
              accent="green"
              helperText="Task-related activity and changes"
            />
            <NotificationStatCard
              label="Reward Alerts"
              value={stats.rewards}
              icon={<Wallet className="h-5 w-5" />}
              accent="purple"
              helperText="Reward approvals and claimable notices"
            />
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#EEF2FF] bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex w-full flex-wrap rounded-xl border border-[#EAECF5] bg-[#F8FAFC] p-1.5 lg:w-auto">
              {VIEW_OPTIONS.map((option) => {
                const isActive = view === option.value;

                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant="ghost"
                    onClick={() => setView(option.value)}
                    className={[
                      "h-10 rounded-lg px-4 text-sm font-medium transition-all",
                      "hover:bg-white hover:text-[#2F0FD1]",
                      isActive
                        ? "bg-white text-[#2F0FD1] shadow-sm"
                        : "text-[#667085]",
                    ].join(" ")}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-[#E4E7EC] bg-white px-3 py-2 text-sm text-[#667085] shadow-sm">
              <Filter className="h-4 w-4" />
              <span>{filteredNotifications.length} shown</span>
            </div>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-[#FCFCFD] px-6 py-10 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F7FF] text-[#2F0FD1]">
                <Bell className="h-8 w-8" />
              </div>

              <div className="max-w-lg space-y-2">
                <h3 className="text-[22px] font-semibold tracking-tight text-[#101828]">
                  No notifications found
                </h3>
                <p className="text-sm leading-6 text-[#667085]">
                  Notifications matching this view will appear here when
                  available.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#F8FAFC] p-3 ring-1 ring-[#EEF2FF] md:p-4">
              <div className="space-y-4">
                {filteredNotifications.map((item) => (
                  <NotificationRow
                    key={item.id}
                    item={item}
                    onMarkRead={handleMarkRead}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Notifications;
