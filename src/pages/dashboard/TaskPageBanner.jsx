import { ArrowRight, Building2 } from "lucide-react";

function Badge({ children, tone = "default" }) {
  const styles = {
    default: "border-[#EAECF0] bg-white text-[#344054]",
    purple: "border-[#E0E7FF] bg-[#F4F7FF] text-[#2F0FD1]",
    green: "border-[#ABEFC6] bg-[#ECFDF3] text-[#027A48]",
    blue: "border-[#B9E6FE] bg-[#F0F9FF] text-[#026AA2]",
  };

  return (
    <span
      className={`inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

export default function TaskPageBanner({
  task,
  title,
  subtitle,
  actionLabel,
  onAction,
}) {
  const items = [
    ["Reward", `${task.budget} ${task.rewardAsset}`],
    ["Timeline", task.deadline],
    ["Applicants", task.applicants],
    ["Status", task.status],
  ];

  return (
    <section className="rounded-2xl border border-[#EAECF0] bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="purple">{task.category}</Badge>
            <Badge tone="green">{task.status}</Badge>
            <Badge tone="blue">{task.company}</Badge>
          </div>

          <h1 className="mt-2 text-xl font-semibold tracking-tight text-[#101828] sm:text-2xl">
            {title}
          </h1>

          {task?.company ? (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#667085]">
              <span className="inline-flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#98A2B3]" />
                {task.company}
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-[#D0D5DD] sm:block" />
              <span>Posted by {task.postedBy?.name || "Project owner"}</span>
            </div>
          ) : null}
        </div>

        {actionLabel && onAction ? (
          //   <button
          //     type="button"
          //     onClick={onAction}
          //     className="h-10 shrink-0 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white transition hover:bg-[#2409B8]"
          //   >
          //     {actionLabel}
          //   </button>

          <button
            type="button"
            onClick={onAction}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
        {items.map(([label, value]) => (
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
    </section>
  );
}
