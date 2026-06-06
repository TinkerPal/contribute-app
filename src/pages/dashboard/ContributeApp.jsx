import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronRight,
  Filter,
  Grid2X2,
  List,
  Search,
  Send,
  Star,
  Trophy,
  WalletCards,
  X,
} from "lucide-react";
import { useSocketFi } from "@socketfi/react";

const LAYOUT_KEY = "contribute_mvp_task_layout";

const categories = [
  "All",
  "Development",
  "Design",
  "Content",
  "Growth",
  "Social Media",
  "On-chain",
];

const taskTypes = categories.filter((item) => item !== "All");

const demoUser = {
  name: "Shola",
  email: "shola@contribute.fi",
  initials: "SH",
  reputation: 92,
  completedTasks: 14,
  activeApplications: 3,
  earned: 2840,
  responseRate: "96%",
  role: "Frontend Contributor",
};

const initialTasks = [
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

const initialApplications = [
  {
    id: "app-001",
    taskId: "task-002",
    submittedAt: "Today",
    status: "Under review",
    decision: "Pending",
    viewedByPoster: true,
    posterNote: "The poster viewed your application.",
  },
  {
    id: "app-002",
    taskId: "task-003",
    submittedAt: "Yesterday",
    status: "Shortlisted",
    decision: "Pending",
    viewedByPoster: true,
    posterNote: "You are shortlisted for this task.",
  },
  {
    id: "app-003",
    taskId: "task-004",
    submittedAt: "3 days ago",
    status: "Decision made",
    decision: "Accepted",
    viewedByPoster: true,
    posterNote: "The poster selected you for this task.",
  },
];

function getSavedLayout() {
  if (typeof window === "undefined") return "list";
  const saved = window.localStorage.getItem(LAYOUT_KEY);
  return saved === "list" || saved === "grid" ? saved : "list";
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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

function Drawer({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#101828]/40 backdrop-blur-sm">
      <div className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#F2F4F7] px-5 py-4">
          <h2 className="text-base font-semibold text-[#101828]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#667085] transition hover:bg-[#F8FAFC]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

function ProfileDrawer({ user, onClose, onLogout }) {
  const profile = user || demoUser;

  const stats = [
    { label: "Reputation", value: profile.reputation, icon: Star },
    { label: "Completed", value: profile.completedTasks, icon: Trophy },
    { label: "Contributions", value: profile.activeApplications, icon: Send },
    { label: "Earned", value: `$${profile.earned}`, icon: WalletCards },
  ];

  return (
    <Drawer title="Profile" onClose={onClose}>
      <div className="space-y-5">
        <div className="rounded-2xl border border-[#EEF2FF] bg-[#FCFCFD] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF2FF] text-sm font-semibold text-[#2F0FD1]">
              {profile.initials}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-[#101828]">
                {profile.name}
              </h3>
              <p className="truncate text-sm text-[#667085]">{profile.email}</p>
              <p className="mt-1 text-xs font-medium text-[#2F0FD1]">
                {profile.role}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#EEF2FF] bg-white p-4"
              >
                <Icon className="mb-3 h-4 w-4 text-[#2F0FD1]" />
                <p className="text-lg font-semibold text-[#101828]">
                  {stat.value}
                </p>
                <p className="text-xs text-[#667085]">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-4 rounded-2xl border border-[#EEF2FF] bg-[#FCFCFD] p-4">
          <Field label="Display name">
            <input value={profile.name} readOnly className={inputClass} />
          </Field>

          <Field label="Email address">
            <input value={profile.email} readOnly className={inputClass} />
          </Field>

          <Field label="Role">
            <input value={profile.role} readOnly className={inputClass} />
          </Field>

          <button
            type="button"
            className="h-11 w-full rounded-xl border border-[#D0D5DD] bg-white text-sm font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
          >
            Edit profile
          </button>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="h-11 w-full rounded-xl bg-[#101828] text-sm font-medium text-white transition hover:bg-[#1D2939]"
        >
          Logout
        </button>
      </div>
    </Drawer>
  );
}

function CompactDashboard({
  tasks,
  totalBudget,
  totalApplicants,
  acceptedApplications,
  onCreateTask,
}) {
  const items = [
    ["Open tasks", tasks.length],
    ["Rewards", `${totalBudget} USDC`],
    ["Applicants", totalApplicants],
    ["Accepted", acceptedApplications],
  ];

  return (
    <section className="rounded-2xl border border-[#EAECF0] bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Badge tone="purple">Marketplace</Badge>
            <Badge tone="green">{tasks.length} open</Badge>
          </div>

          <h1 className="mt-2 text-xl font-semibold tracking-tight text-[#101828] sm:text-2xl">
            Find paid work from ecosystem projects
          </h1>
        </div>

        <button
          type="button"
          onClick={onCreateTask}
          className="h-10 shrink-0 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white transition hover:bg-[#2409B8]"
        >
          Create Task
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

function PosterMini({ poster }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF] text-[11px] font-semibold text-[#2F0FD1]">
        {poster?.initials || "CO"}
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-[#101828]">
          {poster?.name || "Contribute Team"}
        </p>
        <p className="truncate text-[11px] text-[#667085]">
          {poster?.role || "Project owner"}
        </p>
      </div>
    </div>
  );
}

function TaskCard({ task, layout, onView, hasApplied }) {
  if (layout === "grid") {
    return (
      <article
        onClick={() => onView(task)}
        className="group cursor-pointer rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm transition hover:border-[#D7DDF0] hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone="purple">{task.category}</Badge>
            {hasApplied ? <Badge tone="blue">Applied</Badge> : null}
          </div>

          <ArrowUpRight className="h-4 w-4 shrink-0 text-[#98A2B3] transition group-hover:text-[#2F0FD1]" />
        </div>

        <h3 className="mt-3 line-clamp-2 text-[15px] leading-6 font-semibold text-[#101828]">
          {task.title}
        </h3>

        <p className="mt-1 text-xs text-[#667085]">{task.company}</p>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#667085]">
          {task.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F2F4F7] pt-3">
          <PosterMini poster={task.postedBy} />

          <div className="text-right">
            <p className="text-sm font-semibold text-[#101828]">
              {task.budget} {task.rewardAsset}
            </p>
            <p className="text-[11px] text-[#667085]">
              {task.applicants} applicants
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => onView(task)}
      className="group cursor-pointer rounded-2xl border border-[#EAECF0] bg-white p-3 shadow-sm transition hover:border-[#D7DDF0] hover:shadow-md sm:p-4"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge tone="purple">{task.category}</Badge>
            <Badge tone="green">{task.status}</Badge>
            {hasApplied ? <Badge tone="blue">Applied</Badge> : null}
          </div>

          <h3 className="line-clamp-1 text-[15px] font-semibold text-[#101828] sm:text-base">
            {task.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-sm text-[#667085]">
            {task.company} • {task.description}
          </p>
        </div>

        <div className="grid shrink-0 grid-cols-3 gap-2 md:w-[430px]">
          <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] text-[#667085]">Reward</p>
            <p className="truncate text-sm font-semibold text-[#101828]">
              {task.budget} {task.rewardAsset}
            </p>
          </div>

          <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
            <p className="text-[11px] text-[#667085]">Applicants</p>
            <p className="text-sm font-semibold text-[#101828]">
              {task.applicants}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-3 py-2">
            <div>
              <p className="text-[11px] text-[#667085]">Due</p>
              <p className="text-sm font-semibold text-[#101828]">
                {task.deadline}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-[#98A2B3] transition group-hover:text-[#2F0FD1]" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ContributeApp() {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTask, setSelectedTask] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [layout, setLayout] = useState(getSavedLayout);
  const [applications, setApplications] = useState(initialApplications);

  const [loginForm, setLoginForm] = useState({
    name: demoUser.name,
    email: demoUser.email,
  });

  const [newTask, setNewTask] = useState({
    title: "",
    company: "",
    category: "Development",
    budget: "",
    rewardAsset: "USDC",
    deadline: "",
    description: "",
    requirements: "",
  });

  const [application, setApplication] = useState({
    name: "",
    email: "",
    proposal: "",
    portfolio: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    window.localStorage.setItem(LAYOUT_KEY, layout);
  }, [layout]);

  const socketfi = useSocketFi();
  useEffect(() => {
    console.log("USE EFFECT STARTED");

    async function run() {
      try {
        const data = await socketfi.onSuccessRedirect();
        console.log("the data is", data);
      } catch (err) {
        console.error(err);
      }
    }

    run();
  }, [socketfi]);

  const userApplicationTaskIds = useMemo(
    () => new Set(applications.map((item) => item.taskId)),
    [applications],
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesCategory =
        activeCategory === "All" || task.category === activeCategory;

      const term = search.trim().toLowerCase();

      const matchesSearch =
        !term ||
        task.title.toLowerCase().includes(term) ||
        task.company.toLowerCase().includes(term) ||
        task.category.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term) ||
        task.postedBy?.name?.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [tasks, search, activeCategory]);

  const totalBudget = tasks.reduce((sum, task) => sum + Number(task.budget), 0);
  const totalApplicants = tasks.reduce((sum, task) => sum + task.applicants, 0);
  const acceptedApplications = applications.filter(
    (item) => item.decision === "Accepted",
  ).length;

  const openCreateTask = () => {
    if (!user) {
      setLoginOpen(true);
      toast.error("Login to create a task.");
      return;
    }

    setCreateOpen(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const name = loginForm.name.trim() || demoUser.name;
    const email = loginForm.email.trim() || demoUser.email;

    setUser({
      ...demoUser,
      name,
      email,
      initials: getInitials(name),
    });

    setApplication((current) => ({
      ...current,
      name,
      email,
    }));

    setLoginOpen(false);
    toast.success("You are now logged in.");
  };

  const handleLogout = () => {
    setUser(null);
    setProfileOpen(false);
    toast.success("You have been logged out.");
  };

  const handleCreateTask = (e) => {
    e.preventDefault();

    if (!user) {
      setCreateOpen(false);
      setLoginOpen(true);
      return;
    }

    const task = {
      id: `task-${Date.now()}`,
      ...newTask,
      budget: Number(newTask.budget),
      applicants: 0,
      status: "Open",
      postedBy: {
        name: user.name,
        role: "Task publisher",
        email: user.email,
        initials: user.initials,
      },
    };

    setTasks((current) => [task, ...current]);
    setCreateOpen(false);
    toast.success("Task published successfully.");

    setNewTask({
      title: "",
      company: "",
      category: "Development",
      budget: "",
      rewardAsset: "USDC",
      deadline: "",
      description: "",
      requirements: "",
    });
  };

  const openApply = () => {
    if (!user) {
      setLoginOpen(true);
      toast.error("Login to apply for this task.");
      return;
    }

    if (userApplicationTaskIds.has(selectedTask.id)) {
      toast.error("You have already applied for this task.");
      setSelectedTask(null);
      return;
    }

    setApplication((current) => ({
      ...current,
      name: current.name || user.name,
      email: current.email || user.email,
    }));

    setApplyOpen(true);
  };

  const handleApply = (e) => {
    e.preventDefault();

    const newApplication = {
      id: `app-${Date.now()}`,
      taskId: selectedTask.id,
      submittedAt: "Just now",
      status: "Submitted",
      decision: "Pending",
      viewedByPoster: false,
      posterNote: "Your application was submitted and is waiting for review.",
    };

    setTasks((current) =>
      current.map((task) =>
        task.id === selectedTask.id
          ? { ...task, applicants: task.applicants + 1 }
          : task,
      ),
    );

    setApplications((current) => [newApplication, ...current]);
    setApplyOpen(false);
    setSelectedTask(null);
    toast.success("Application submitted successfully.");

    setApplication({
      name: user?.name || "",
      email: user?.email || "",
      proposal: "",
      portfolio: "",
    });
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto space-y-3 px-2 py-2">
        <CompactDashboard
          tasks={tasks}
          totalBudget={totalBudget}
          totalApplicants={totalApplicants}
          acceptedApplications={acceptedApplications}
          onCreateTask={openCreateTask}
        />

        <section className="rounded-2xl">
          <div className="sticky top-16 z-30 rounded-2xl border border-[#EAECF0] bg-white/95 p-3 shadow-sm backdrop-blur sm:p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full lg:w-[360px]">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks..."
                  className="h-11 w-full rounded-xl border border-[#EAECF0] bg-white pr-3 pl-9 text-sm text-[#101828] transition outline-none focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 lg:overflow-visible lg:pb-0">
                <div className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-2">
                  <Filter className="h-4 w-4 text-[#667085]" />
                  <select
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="h-10 rounded-lg bg-transparent px-1 text-sm font-medium text-[#344054] outline-none"
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
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
            {filteredTasks.length > 0 ? (
              <div
                className={
                  layout === "grid"
                    ? "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
                    : "flex flex-col gap-2.5"
                }
              >
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    layout={layout}
                    hasApplied={userApplicationTaskIds.has(task.id)}
                    onView={(task) => navigate(`/${task.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-[#FCFCFD] px-6 py-10 text-center">
                <BriefcaseBusiness className="mb-4 h-9 w-9 text-[#2F0FD1]" />
                <h3 className="text-lg font-semibold text-[#101828]">
                  No tasks found
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#667085]">
                  Try a different keyword or category.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {profileOpen ? (
        <ProfileDrawer
          user={user}
          onClose={() => setProfileOpen(false)}
          onLogout={handleLogout}
        />
      ) : null}

      {loginOpen ? (
        <Modal title="Login" onClose={() => setLoginOpen(false)}>
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Name">
              <input
                required
                value={loginForm.name}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, name: e.target.value })
                }
                className={inputClass}
              />
            </Field>

            <Field label="Email address">
              <input
                required
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                className={inputClass}
              />
            </Field>

            <button className="h-11 w-full rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white transition hover:bg-[#2409B8]">
              Continue
            </button>
          </form>
        </Modal>
      ) : null}

      {selectedTask ? (
        <Modal title="Task details" onClose={() => setSelectedTask(null)}>
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge tone="purple">{selectedTask.category}</Badge>
                <Badge tone="green">{selectedTask.status}</Badge>
                {userApplicationTaskIds.has(selectedTask.id) ? (
                  <Badge tone="blue">Already applied</Badge>
                ) : null}
              </div>

              <h2 className="text-xl leading-7 font-semibold text-[#101828]">
                {selectedTask.title}
              </h2>

              <p className="mt-2 text-sm text-[#667085]">
                Published by{" "}
                <span className="font-medium text-[#344054]">
                  {selectedTask.company}
                </span>
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-[#667085]">Reward</p>
                <p className="mt-1 text-base font-semibold text-[#101828]">
                  {selectedTask.budget} {selectedTask.rewardAsset}
                </p>
              </div>

              <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-[#667085]">Timeline</p>
                <p className="mt-1 text-base font-semibold text-[#101828]">
                  {selectedTask.deadline}
                </p>
              </div>

              <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-[#667085]">Applicants</p>
                <p className="mt-1 text-base font-semibold text-[#101828]">
                  {selectedTask.applicants}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-[#101828]">
                Description
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#667085]">
                {selectedTask.description}
              </p>
            </div>

            <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-[#101828]">
                Application guide
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#667085]">
                {selectedTask.requirements}
              </p>
            </div>

            <div className="sticky bottom-0 -mx-5 -mb-5 border-t border-[#EAECF0] bg-white/95 px-5 py-4 backdrop-blur">
              <button
                type="button"
                onClick={openApply}
                className="h-11 w-full rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
                disabled={userApplicationTaskIds.has(selectedTask.id)}
              >
                {userApplicationTaskIds.has(selectedTask.id)
                  ? "Application submitted"
                  : "Apply for this task"}
              </button>
            </div>
          </div>
        </Modal>
      ) : null}

      {applyOpen && selectedTask ? (
        <Modal title="Submit application" onClose={() => setApplyOpen(false)}>
          <form onSubmit={handleApply} className="space-y-5">
            <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
              <h3 className="text-sm font-semibold text-[#101828]">
                {selectedTask?.title}
              </h3>
              <p className="mt-1 text-sm text-[#667085]">
                {selectedTask?.company} • {selectedTask?.budget}{" "}
                {selectedTask?.rewardAsset}
              </p>
            </div>

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

            <Field label="Portfolio or work link">
              <input
                value={application.portfolio}
                onChange={(e) =>
                  setApplication({ ...application, portfolio: e.target.value })
                }
                className={inputClass}
                placeholder="https://your-work.com"
              />
            </Field>

            <Field label="Proposal">
              <textarea
                required
                rows={5}
                value={application.proposal}
                onChange={(e) =>
                  setApplication({ ...application, proposal: e.target.value })
                }
                className={textareaClass}
                placeholder="Briefly explain your relevant experience, how you would approach this task, and your estimated delivery time."
              />
            </Field>

            <div className="rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-[#667085]">
              Keep it clear and specific. Strong applications explain
              experience, approach, and timeline.
            </div>

            <div className="sticky bottom-0 -mx-5 -mb-5 border-t border-[#EAECF0] bg-white/95 px-5 py-4 backdrop-blur">
              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
              >
                Submit application
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {createOpen ? (
        <Modal title="Create Task" onClose={() => setCreateOpen(false)}>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <Field label="Task title">
              <input
                required
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className={inputClass}
              />
            </Field>

            <Field label="Project or business name">
              <input
                required
                value={newTask.company}
                onChange={(e) =>
                  setNewTask({ ...newTask, company: e.target.value })
                }
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <select
                  value={newTask.category}
                  onChange={(e) =>
                    setNewTask({ ...newTask, category: e.target.value })
                  }
                  className={inputClass}
                >
                  {taskTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </Field>

              <Field label="Budget">
                <input
                  required
                  type="number"
                  min="1"
                  value={newTask.budget}
                  onChange={(e) =>
                    setNewTask({ ...newTask, budget: e.target.value })
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Reward asset">
                <select
                  value={newTask.rewardAsset}
                  onChange={(e) =>
                    setNewTask({ ...newTask, rewardAsset: e.target.value })
                  }
                  className={inputClass}
                >
                  <option>USDC</option>
                  <option>XLM</option>
                </select>
              </Field>

              <Field label="Timeline">
                <input
                  required
                  placeholder="Example: 5 days"
                  value={newTask.deadline}
                  onChange={(e) =>
                    setNewTask({ ...newTask, deadline: e.target.value })
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Task description">
              <textarea
                required
                rows={4}
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className={textareaClass}
              />
            </Field>

            <Field label="Application guide">
              <textarea
                required
                rows={4}
                value={newTask.requirements}
                onChange={(e) =>
                  setNewTask({ ...newTask, requirements: e.target.value })
                }
                className={textareaClass}
              />
            </Field>

            <button className="h-11 w-full rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white transition hover:bg-[#2409B8]">
              Publish Task
            </button>
          </form>
        </Modal>
      ) : null}
    </main>
  );
}
