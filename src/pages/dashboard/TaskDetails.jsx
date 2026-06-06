import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Clock3,
  FileText,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import TaskPageBanner from "./TaskPageBanner";

const tasks = [
  {
    id: "task-001",
    title: "Create a landing page section for a Stellar wallet product",
    company: "SocketFi",
    postedBy: {
      name: "Amara Okafor",
      role: "Product Lead",
      email: "amara@socketfi.com",
      initials: "AO",
    },
    category: "Development",
    budget: 450,
    rewardAsset: "USDC",
    deadline: "5 days",
    applicants: 12,
    status: "Open",
    description:
      "Build a clean, responsive landing page section that explains the wallet value proposition, key features, and main call to action.",
    requirements:
      "Share previous frontend work, your estimated delivery time, and how you would structure the section.",
  },
  {
    id: "task-002",
    title: "Write 10 social posts for a new ecosystem campaign",
    company: "Contribute",
    postedBy: {
      name: "Daniel Reed",
      role: "Growth Manager",
      email: "daniel@contribute.fi",
      initials: "DR",
    },
    category: "Social Media",
    budget: 120,
    rewardAsset: "USDC",
    deadline: "3 days",
    applicants: 24,
    status: "Open",
    description:
      "Create short, clear social posts that explain how contributors can discover tasks and earn from projects.",
    requirements:
      "Include samples of previous writing and a short explanation of your content style.",
  },
  {
    id: "task-003",
    title: "Design three clean task card variations",
    company: "SoroBuild",
    postedBy: {
      name: "Maya Chen",
      role: "Design Partner",
      email: "maya@soro.build",
      initials: "MC",
    },
    category: "Design",
    budget: 300,
    rewardAsset: "USDC",
    deadline: "7 days",
    applicants: 8,
    status: "Open",
    description:
      "Design premium task card variations for a contributor marketplace interface.",
    requirements:
      "Submit portfolio links and explain your approach to hierarchy, spacing, and mobile design.",
  },
  {
    id: "task-004",
    title: "Test a quest flow and submit product feedback",
    company: "Stellar Builders Hub",
    postedBy: {
      name: "Leo Martins",
      role: "Community Operator",
      email: "leo@stellarhub.io",
      initials: "LM",
    },
    category: "Growth",
    budget: 80,
    rewardAsset: "USDC",
    deadline: "2 days",
    applicants: 31,
    status: "Open",
    description:
      "Go through a new quest flow, identify friction points, and provide clear feedback with screenshots.",
    requirements:
      "Explain your testing process and include examples of past product feedback if available.",
  },
];

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

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
      <Icon className="mb-3 h-4 w-4 text-[#2F0FD1]" />
      <p className="text-xs font-medium text-[#667085]">{label}</p>
      <p className="mt-1 text-base font-semibold text-[#101828]">{value}</p>
    </div>
  );
}

export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const task = useMemo(
    () => tasks.find((item) => item.id === taskId),
    [taskId],
  );

  if (!task) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] px-3 py-4">
        <div className="rounded-2xl border border-[#EAECF0] bg-white p-8 text-center shadow-sm">
          <BriefcaseBusiness className="mx-auto mb-4 h-9 w-9 text-[#2F0FD1]" />
          <h1 className="text-lg font-semibold text-[#101828]">
            Task not found
          </h1>
          <button
            onClick={() => navigate("/")}
            className="mt-5 h-10 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white"
          >
            Browse tasks
          </button>
        </div>
      </main>
    );
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

        <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge tone="purple">{task.category}</Badge>
                <Badge tone="green">{task.status}</Badge>
              </div>

              <h1 className="max-w-4xl text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">
                {task.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#667085]">
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#98A2B3]" />
                  {task.company}
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-[#D0D5DD] sm:block" />
                <span>Posted by {task.postedBy?.name || "Project owner"}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/${task.id}/apply`)}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
            >
              Apply now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <StatCard
              icon={WalletCards}
              label="Reward"
              value={`${task.budget} ${task.rewardAsset}`}
            />
            <StatCard icon={Clock3} label="Timeline" value={task.deadline} />
            <StatCard icon={Users} label="Applicants" value={task.applicants} />
          </div>
        </section>

        <TaskPageBanner
          task={task}
          title={task.title}
          subtitle={`Published by ${task.postedBy?.name || "Project owner"} from ${task.company}. Review the task details before applying.`}
          actionLabel="Apply Now"
          onAction={() => navigate(`/${task.id}/apply`)}
        />

        <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#2F0FD1]" />
                <h2 className="text-base font-semibold text-[#101828]">
                  Description
                </h2>
              </div>
              <p className="text-sm leading-7 text-[#667085]">
                {task.description}
              </p>
            </div>

            <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#2F0FD1]" />
                <h2 className="text-base font-semibold text-[#101828]">
                  Application guide
                </h2>
              </div>
              <p className="text-sm leading-7 text-[#667085]">
                {task.requirements}
              </p>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#101828]">
              Before you apply
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              Send a focused proposal with relevant experience, your approach,
              portfolio link, and estimated delivery time.
            </p>

            <div className="mt-4 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] p-3 text-sm text-[#667085]">
              Strong applications are short, specific, and easy for the poster
              to evaluate.
            </div>

            <button
              type="button"
              onClick={() => navigate(`/${task.id}/apply`)}
              className="mt-5 h-11 w-full rounded-xl bg-[#2F0FD1] px-5 text-sm font-medium text-white transition hover:bg-[#2409B8]"
            >
              Apply for this task
            </button>
          </aside>
        </section>
      </div>
    </main>
  );
}
