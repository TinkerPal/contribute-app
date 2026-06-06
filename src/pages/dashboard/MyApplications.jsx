import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  FileCheck2,
  Filter,
  Grid2X2,
  Link2,
  List,
  Search,
  Send,
  UploadCloud,
  X,
} from "lucide-react";

const APPLICATION_LAYOUT_KEY = "contribute_mvp_application_layout";

const statusFilters = [
  "All",
  "Under review",
  "Shortlisted",
  "Accepted",
  "Submitted work",
];

const initialApplications = [
  {
    id: "app-001",
    title: "Write 10 social posts for a new ecosystem campaign",
    company: "Contribute",
    category: "Social Media",
    submittedAt: "Today",
    status: "Under review",
    decision: "Pending",
    reward: 120,
    rewardAsset: "USDC",
    applicants: 24,
    viewedByPoster: true,
    posterNote: "The poster viewed your application.",
    workSubmitted: false,
  },
  {
    id: "app-002",
    title: "Design three clean task card variations",
    company: "SoroBuild",
    category: "Design",
    submittedAt: "Yesterday",
    status: "Shortlisted",
    decision: "Pending",
    reward: 300,
    rewardAsset: "USDC",
    applicants: 8,
    viewedByPoster: true,
    posterNote: "You are shortlisted for this task.",
    workSubmitted: false,
  },
  {
    id: "app-003",
    title: "Test a quest flow and submit product feedback",
    company: "Stellar Builders Hub",
    category: "Growth",
    submittedAt: "3 days ago",
    status: "Accepted",
    decision: "Accepted",
    reward: 80,
    rewardAsset: "USDC",
    applicants: 31,
    viewedByPoster: true,
    posterNote: "The poster selected you for this task.",
    workSubmitted: false,
  },
  {
    id: "app-004",
    title: "Create a landing page section for a Stellar wallet product",
    company: "SocketFi",
    category: "Development",
    submittedAt: "5 days ago",
    status: "Submitted work",
    decision: "Accepted",
    reward: 450,
    rewardAsset: "USDC",
    applicants: 12,
    viewedByPoster: true,
    posterNote: "Your work is submitted and waiting for final review.",
    workSubmitted: true,
    workLink: "https://example.com/work-submission",
    submittedWorkAt: "Yesterday",
  },
];

function getSavedLayout() {
  if (typeof window === "undefined") return "list";
  const saved = window.localStorage.getItem(APPLICATION_LAYOUT_KEY);
  return saved === "list" || saved === "grid" ? saved : "list";
}

function Badge({ children, tone = "default" }) {
  const styles = {
    default: "border-[#EAECF0] bg-white text-[#344054]",
    purple: "border-[#E0E7FF] bg-[#F4F7FF] text-[#2F0FD1]",
    green: "border-[#ABEFC6] bg-[#ECFDF3] text-[#027A48]",
    amber: "border-[#FEDF89] bg-[#FFFAEB] text-[#B54708]",
    blue: "border-[#B9E6FE] bg-[#F0F9FF] text-[#026AA2]",
    red: "border-[#FECDCA] bg-[#FEF3F2] text-[#B42318]",
  };

  return (
    <span
      className={`inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

function getStatusTone(status) {
  if (status === "Accepted" || status === "Submitted work") return "green";
  if (status === "Shortlisted") return "blue";
  if (status === "Rejected") return "red";
  return "amber";
}

function Field({ label, children }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-[#344054]">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-[#EAECF0] bg-white px-3.5 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]";

const textareaClass =
  "w-full resize-none rounded-xl border border-[#EAECF0] bg-white px-3.5 py-3 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]";

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#101828]/40 px-3 py-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[24px] border border-[#EEF2FF] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#F2F4F7] bg-white/95 px-5 py-4 backdrop-blur">
          <h2 className="text-base font-semibold text-[#101828]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#667085] transition hover:bg-[#F8FAFC]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

function CompactApplicationsDashboard({ summary, onBrowseTasks }) {
  const items = [
    ["Contributions", summary.total],
    ["Accepted", summary.accepted],
    ["Pending", summary.pending],
    ["Submitted", summary.submittedWork],
  ];

  return (
    <section className="rounded-2xl border border-[#EAECF0] bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Badge tone="purple">Applications</Badge>
            <Badge tone="green">{summary.accepted} accepted</Badge>
          </div>

          <h1 className="mt-2 text-xl font-semibold tracking-tight text-[#101828] sm:text-2xl">
            Track applications and submit completed work
          </h1>
        </div>

        <button
          type="button"
          onClick={onBrowseTasks}
          className="h-10 shrink-0 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white transition hover:bg-[#2409B8]"
        >
          Browse Tasks
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
        {items.map(([label, value]) => (
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
  );
}

function ApplicationCard({ application, layout, onSubmitWork, onView }) {
  const canSubmit =
    application.decision === "Accepted" && !application.workSubmitted;

  if (layout === "grid") {
    return (
      <article
        onClick={() => onView(application)}
        className="group cursor-pointer rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm transition hover:border-[#D7DDF0] hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone="purple">{application.category}</Badge>
            <Badge tone={getStatusTone(application.status)}>
              {application.status}
            </Badge>
          </div>

          <ArrowUpRight className="h-4 w-4 shrink-0 text-[#98A2B3] transition group-hover:text-[#2F0FD1]" />
        </div>

        <h3 className="mt-3 line-clamp-2 text-[15px] leading-6 font-semibold text-[#101828]">
          {application.title}
        </h3>

        <p className="mt-1 text-xs text-[#667085]">
          {application.company} • Applied {application.submittedAt}
        </p>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#667085]">
          {application.posterNote}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] text-[#667085]">Reward</p>
            <p className="truncate text-sm font-semibold text-[#101828]">
              {application.reward} {application.rewardAsset}
            </p>
          </div>

          <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] text-[#667085]">Applicants</p>
            <p className="text-sm font-semibold text-[#101828]">
              {application.applicants}
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-[#F2F4F7] pt-3">
          {canSubmit ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSubmitWork(application);
              }}
              className="h-10 w-full rounded-xl bg-[#2F0FD1] text-sm font-medium text-white transition hover:bg-[#2409B8]"
            >
              Submit Work
            </button>
          ) : (
            <div className="flex h-10 items-center justify-center rounded-xl border border-[#EAECF0] bg-[#F8FAFC] text-sm font-medium text-[#667085]">
              {application.workSubmitted
                ? "Work submitted"
                : "Awaiting decision"}
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => onView(application)}
      className="group cursor-pointer rounded-2xl border border-[#EAECF0] bg-white p-3 shadow-sm transition hover:border-[#D7DDF0] hover:shadow-md sm:p-4"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge tone="purple">{application.category}</Badge>
            <Badge tone={getStatusTone(application.status)}>
              {application.status}
            </Badge>
            <Badge tone={getStatusTone(application.decision)}>
              {application.decision}
            </Badge>
            {application.viewedByPoster ? (
              <Badge tone="blue">Viewed</Badge>
            ) : null}
          </div>

          <h3 className="line-clamp-1 text-[15px] font-semibold text-[#101828] sm:text-base">
            {application.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-sm text-[#667085]">
            {application.company} • Applied {application.submittedAt} •{" "}
            {application.posterNote}
          </p>
        </div>

        <div className="grid shrink-0 grid-cols-3 gap-2 md:w-[430px]">
          <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] text-[#667085]">Reward</p>
            <p className="truncate text-sm font-semibold text-[#101828]">
              {application.reward} {application.rewardAsset}
            </p>
          </div>

          <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] text-[#667085]">Applicants</p>
            <p className="text-sm font-semibold text-[#101828]">
              {application.applicants}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-3 py-2">
            <div>
              <p className="text-[11px] text-[#667085]">Action</p>
              <p className="text-sm font-semibold text-[#101828]">
                {application.workSubmitted
                  ? "Submitted"
                  : canSubmit
                    ? "Submit"
                    : "Waiting"}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-[#98A2B3] transition group-hover:text-[#2F0FD1]" />
          </div>
        </div>
      </div>

      {canSubmit ? (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSubmitWork(application);
            }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white transition hover:bg-[#2409B8]"
          >
            Submit Work
            <UploadCloud className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </article>
  );
}

export default function MyApplications() {
  const [applications, setApplications] = useState(initialApplications);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [layout, setLayout] = useState(getSavedLayout);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submission, setSubmission] = useState({
    workLink: "",
    note: "",
  });

  useEffect(() => {
    window.localStorage.setItem(APPLICATION_LAYOUT_KEY, layout);
  }, [layout]);

  const summary = useMemo(() => {
    return {
      total: applications.length,
      accepted: applications.filter((item) => item.decision === "Accepted")
        .length,
      pending: applications.filter((item) => item.decision === "Pending")
        .length,
      submittedWork: applications.filter((item) => item.workSubmitted).length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const term = search.trim().toLowerCase();

      const matchesSearch =
        !term ||
        application.title.toLowerCase().includes(term) ||
        application.company.toLowerCase().includes(term) ||
        application.category.toLowerCase().includes(term) ||
        application.status.toLowerCase().includes(term);

      const matchesStatus =
        activeStatus === "All" ||
        application.status === activeStatus ||
        (activeStatus === "Submitted work" && application.workSubmitted);

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, activeStatus]);

  const openSubmitWork = (application) => {
    setSelectedApplication(application);
    setSubmission({ workLink: "", note: "" });
    setSubmitOpen(true);
  };

  const handleSubmitWork = (e) => {
    e.preventDefault();

    if (!selectedApplication) return;

    if (!submission.workLink.trim()) {
      toast.error("Add a work link before submitting.");
      return;
    }

    setApplications((current) =>
      current.map((item) =>
        item.id === selectedApplication.id
          ? {
              ...item,
              status: "Submitted work",
              workSubmitted: true,
              workLink: submission.workLink.trim(),
              workNote: submission.note.trim(),
              submittedWorkAt: "Just now",
              posterNote: "Your work was submitted and is waiting for review.",
            }
          : item,
      ),
    );

    setSubmitOpen(false);
    setSelectedApplication(null);
    setSubmission({ workLink: "", note: "" });
    toast.success("Work submitted successfully.");
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto space-y-3 px-2 py-2">
        <CompactApplicationsDashboard
          summary={summary}
          onBrowseTasks={() => toast.info("Navigate to task marketplace.")}
        />

        <section className="">
          <div className="sticky top-16 z-30 rounded-2xl border border-[#EAECF0] bg-white/95 p-3 shadow-sm backdrop-blur sm:p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full lg:w-[360px]">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search applications..."
                  className="h-11 w-full rounded-xl border border-[#EAECF0] bg-white pr-3 pl-9 text-sm text-[#101828] transition outline-none focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 lg:overflow-visible lg:pb-0">
                <div className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-2">
                  <Filter className="h-4 w-4 text-[#667085]" />
                  <select
                    value={activeStatus}
                    onChange={(e) => setActiveStatus(e.target.value)}
                    className="h-10 rounded-lg bg-transparent px-1 text-sm font-medium text-[#344054] outline-none"
                  >
                    {statusFilters.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="inline-flex shrink-0 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] p-1">
                  <button
                    type="button"
                    onClick={() => setLayout("grid")}
                    className={`inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-sm font-medium transition ${
                      layout === "grid"
                        ? "bg-white text-[#2F0FD1] shadow-sm"
                        : "text-[#667085] hover:bg-white"
                    }`}
                  >
                    <Grid2X2 className="h-4 w-4" />
                    Grid
                  </button>

                  <button
                    type="button"
                    onClick={() => setLayout("list")}
                    className={`inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-sm font-medium transition ${
                      layout === "list"
                        ? "bg-white text-[#2F0FD1] shadow-sm"
                        : "text-[#667085] hover:bg-white"
                    }`}
                  >
                    <List className="h-4 w-4" />
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3">
            {filteredApplications.length > 0 ? (
              <div
                className={
                  layout === "grid"
                    ? "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
                    : "flex flex-col gap-2.5"
                }
              >
                {filteredApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    layout={layout}
                    onView={setSelectedApplication}
                    onSubmitWork={openSubmitWork}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-[#FCFCFD] px-6 py-10 text-center">
                <BriefcaseBusiness className="mb-4 h-9 w-9 text-[#2F0FD1]" />
                <h3 className="text-lg font-semibold text-[#101828]">
                  No applications found
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#667085]">
                  Try another filter or search for a different task.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {selectedApplication && !submitOpen ? (
        <Modal
          title="Application details"
          onClose={() => setSelectedApplication(null)}
        >
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge tone="purple">{selectedApplication.category}</Badge>
                <Badge tone={getStatusTone(selectedApplication.status)}>
                  {selectedApplication.status}
                </Badge>
                <Badge tone={getStatusTone(selectedApplication.decision)}>
                  {selectedApplication.decision}
                </Badge>
              </div>

              <h2 className="text-xl leading-7 font-semibold text-[#101828]">
                {selectedApplication.title}
              </h2>

              <p className="mt-2 text-sm text-[#667085]">
                {selectedApplication.company} • Applied{" "}
                {selectedApplication.submittedAt}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-[#667085]">Reward</p>
                <p className="mt-1 text-base font-semibold text-[#101828]">
                  {selectedApplication.reward} {selectedApplication.rewardAsset}
                </p>
              </div>

              <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-[#667085]">Applicants</p>
                <p className="mt-1 text-base font-semibold text-[#101828]">
                  {selectedApplication.applicants}
                </p>
              </div>

              <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-[#667085]">Viewed</p>
                <p className="mt-1 text-base font-semibold text-[#101828]">
                  {selectedApplication.viewedByPoster ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-[#101828]">
                Poster note
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#667085]">
                {selectedApplication.posterNote}
              </p>
            </div>

            {selectedApplication.workSubmitted ? (
              <div className="rounded-2xl border border-[#ABEFC6] bg-[#ECFDF3] p-4">
                <h3 className="text-sm font-semibold text-[#027A48]">
                  Submitted work
                </h3>
                <a
                  href={selectedApplication.workLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#2F0FD1]"
                >
                  Open submission
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            ) : selectedApplication.decision === "Accepted" ? (
              <div className="sticky bottom-0 -mx-5 -mb-5 border-t border-[#EAECF0] bg-white/95 px-5 py-4 backdrop-blur">
                <button
                  type="button"
                  onClick={() => openSubmitWork(selectedApplication)}
                  className="h-11 w-full rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
                >
                  Submit Work
                </button>
              </div>
            ) : null}
          </div>
        </Modal>
      ) : null}

      {submitOpen && selectedApplication ? (
        <Modal title="Submit work" onClose={() => setSubmitOpen(false)}>
          <form onSubmit={handleSubmitWork} className="space-y-5">
            <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
              <h3 className="text-sm font-semibold text-[#101828]">
                {selectedApplication.title}
              </h3>
              <p className="mt-1 text-sm text-[#667085]">
                {selectedApplication.company} • {selectedApplication.reward}{" "}
                {selectedApplication.rewardAsset}
              </p>
            </div>

            <Field label="Work link">
              <div className="relative">
                <Link2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                <input
                  required
                  value={submission.workLink}
                  onChange={(e) =>
                    setSubmission({
                      ...submission,
                      workLink: e.target.value,
                    })
                  }
                  className={`${inputClass} pl-9`}
                  placeholder="https://github.com/project/submission"
                />
              </div>
            </Field>

            <Field label="Submission note">
              <textarea
                rows={5}
                value={submission.note}
                onChange={(e) =>
                  setSubmission({
                    ...submission,
                    note: e.target.value,
                  })
                }
                className={textareaClass}
                placeholder="Briefly explain what you completed and how the poster can review it."
              />
            </Field>

            <div className="rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-[#667085]">
              Make sure the link is accessible before submitting.
            </div>

            <div className="sticky bottom-0 -mx-5 -mb-5 border-t border-[#EAECF0] bg-white/95 px-5 py-4 backdrop-blur">
              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
              >
                Submit Work
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </main>
  );
}
