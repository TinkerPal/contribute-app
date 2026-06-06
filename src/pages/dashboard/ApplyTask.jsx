import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Link2,
  Send,
  Users,
  WalletCards,
} from "lucide-react";

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

const inputClass =
  "h-11 w-full rounded-xl border border-[#EAECF0] bg-white px-3.5 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]";

const textareaClass =
  "w-full resize-none rounded-xl border border-[#EAECF0] bg-white px-3.5 py-3 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]";

function Badge({ children }) {
  return (
    <span className="inline-flex h-7 items-center rounded-full border border-[#E0E7FF] bg-[#F4F7FF] px-2.5 text-xs font-medium text-[#2F0FD1]">
      {children}
    </span>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="space-y-2">
      <div>
        <span className="text-sm font-medium text-[#344054]">{label}</span>
        {hint ? <p className="mt-1 text-xs text-[#98A2B3]">{hint}</p> : null}
      </div>
      {children}
    </label>
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

export default function ApplyTask() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const task = useMemo(
    () => tasks.find((item) => item.id === taskId),
    [taskId],
  );

  const [application, setApplication] = useState({
    name: "",
    email: "",
    portfolio: "",
    proposal: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Application submitted successfully");
    navigate("/my-applications");
  };

  if (!task) {
    return (
      <div className="space-y-4 px-3 py-4">
        <div className="rounded-2xl border border-[#EAECF0] bg-white p-8 text-center shadow-sm">
          <BriefcaseBusiness className="mx-auto mb-4 h-9 w-9 text-[#2F0FD1]" />
          <h1 className="text-lg font-semibold text-[#101828]">
            Task not found
          </h1>
          <p className="mt-2 text-sm text-[#667085]">
            This task may have been removed or the link is incorrect.
          </p>
          <button
            onClick={() => navigate("/tasks")}
            className="mt-5 h-10 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white"
          >
            Browse tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-3 py-4">
      <button
        type="button"
        onClick={() => navigate(`/tasks/${task.id}`)}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-4 text-sm font-medium text-[#344054] shadow-sm transition hover:bg-[#F9FAFB]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to task
      </button>

      <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge>{task.category}</Badge>
              <span className="inline-flex h-7 items-center rounded-full border border-[#ABEFC6] bg-[#ECFDF3] px-2.5 text-xs font-medium text-[#027A48]">
                {task.status}
              </span>
            </div>

            <h1 className="max-w-4xl text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">
              Apply for this task
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085]">
              Submit a clear application for{" "}
              <span className="font-medium text-[#344054]">{task.title}</span>.
            </p>
          </div>

          <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] px-4 py-3">
            <p className="text-xs font-medium text-[#667085]">Project</p>
            <p className="mt-1 text-sm font-semibold text-[#101828]">
              {task.company}
            </p>
          </div>
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
                Application details
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#667085]">
                Keep it specific. Show experience, approach, and delivery time.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <input
                  required
                  value={application.name}
                  onChange={(e) =>
                    setApplication({ ...application, name: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Your name"
                />
              </Field>

              <Field label="Email address">
                <input
                  required
                  type="email"
                  value={application.email}
                  onChange={(e) =>
                    setApplication({ ...application, email: e.target.value })
                  }
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </Field>
            </div>

            <Field
              label="Portfolio or work link"
              hint="Add GitHub, website, portfolio, design file, or similar proof of work."
            >
              <div className="relative">
                <Link2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                <input
                  value={application.portfolio}
                  onChange={(e) =>
                    setApplication({
                      ...application,
                      portfolio: e.target.value,
                    })
                  }
                  className={`${inputClass} pl-9`}
                  placeholder="https://your-work.com"
                />
              </div>
            </Field>

            <Field
              label="Proposal"
              hint="Explain why you are a good fit, how you will complete the task, and when you can deliver."
            >
              <textarea
                required
                rows={8}
                value={application.proposal}
                onChange={(e) =>
                  setApplication({
                    ...application,
                    proposal: e.target.value,
                  })
                }
                className={textareaClass}
                placeholder="I can help with this task by..."
              />
            </Field>

            <div className="rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-[#667085]">
              Your application will be shared with the task poster for review.
              Make sure your links are accessible.
            </div>

            <div className="sticky bottom-0 -mx-4 -mb-4 border-t border-[#EAECF0] bg-white/95 px-4 py-4 backdrop-blur sm:-mx-5 sm:-mb-5 sm:px-5">
              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
              >
                Submit application
              </button>
            </div>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#101828]">
              Application checklist
            </h3>

            <div className="mt-4 space-y-3">
              {[
                "Relevant work sample",
                "Clear delivery timeline",
                "Specific execution approach",
                "Short and easy-to-review proposal",
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
            <h3 className="text-sm font-semibold text-[#101828]">
              Task summary
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#667085]">
              {task.description}
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
