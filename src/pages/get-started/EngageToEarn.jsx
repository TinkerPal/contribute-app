



// =========================================================
// File: src/lib/questUtils.js
// =========================================================

import { layoutStorageKey } from "@/data/demoQuests";

export function getSavedLayout() {
  if (typeof window === "undefined") return "grid";

  const saved = window.localStorage.getItem(layoutStorageKey);
  return saved === "list" || saved === "grid" ? saved : "grid";
}

export function saveLayout(layout) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(layoutStorageKey, layout);
}

export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatReward(quest) {
  return `${Number(quest.budget || 0).toLocaleString()} ${quest.rewardAsset}`;
}

export function findQuestById(quests, questId) {
  return quests.find((quest) => quest.id === questId) || null;
}





// =========================================================
// File: src/components/ui/Field.jsx
// =========================================================

export const inputClass =
  "h-11 w-full rounded-xl border border-[#EAECF0] bg-white px-3.5 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]";

export const textareaClass =
  "w-full resize-none rounded-xl border border-[#EAECF0] bg-white px-3.5 py-3 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]";

export default function Field({ label, children }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-[#344054]">{label}</span>
      {children}
    </label>
  );
}


// =========================================================
// File: src/components/layout/AppShell.jsx
// =========================================================

import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { Plus, UserRound } from "lucide-react";
import { useQuests } from "@/context/QuestContext";

export default function AppShell() {
  const { user, logout } = useQuests();
  const navigate = useNavigate();

  const navItems = [
    { label: "Quests", to: "/quests" },
    { label: "Contributions", to: "/my-applications" },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-40 border-b border-[#EAECF0] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/quests" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2F0FD1] text-sm font-bold text-white">
              C
            </div>
            <div>
              <p className="text-sm font-semibold text-[#101828]">Contribute</p>
              <p className="text-[11px] text-[#667085]">Quest marketplace</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#EEF2FF] text-[#2F0FD1]"
                      : "text-[#667085] hover:bg-[#F9FAFB] hover:text-[#344054]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/quests/create")}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Quest</span>
            </button>

            {user ? (
              <button
                type="button"
                onClick={logout}
                className="hidden h-10 rounded-xl border border-[#EAECF0] bg-white px-3 text-sm font-medium text-[#344054] transition hover:bg-[#F9FAFB] sm:inline-flex sm:items-center"
              >
                Sign out
              </button>
            ) : null}

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EAECF0] bg-white text-[#667085]">
              {user?.initials || <UserRound className="h-4 w-4" />}
            </div>
          </div>
        </div>
      </header>

      <Outlet />
    </main>
  );
}













// =========================================================
// File: src/pages/ApplyQuestPage.jsx
// =========================================================

import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Field, { inputClass, textareaClass } from "@/components/ui/Field";
import { useQuests } from "@/context/QuestContext";
import { findQuestById, formatReward } from "@/lib/questUtils";

export default function ApplyQuestPage() {
  const { questId } = useParams();
  const { quests, user, applyToQuest, applicationQuestIds } = useQuests();
  const navigate = useNavigate();
  const quest = findQuestById(quests, questId);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    portfolio: "",
    proposal: "",
  });

  const alreadyApplied = useMemo(
    () => applicationQuestIds.has(questId),
    [applicationQuestIds, questId],
  );

  if (!quest) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold text-[#101828]">Quest not found</h1>
        <p className="mt-2 text-sm text-[#667085]">
          The quest may have been removed or the link may be incorrect.
        </p>
        <Link
          to="/quests"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#2F0FD1] px-5 text-sm font-medium text-white"
        >
          Back to quests
        </Link>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const success = applyToQuest(quest.id, form);
    if (success) navigate("/my-applications");
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(`/quests/${quest.id}`)}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#667085] transition hover:text-[#101828]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to quest
      </button>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="rounded-[28px] border border-[#EAECF0] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap gap-2">
            <Badge tone="purple">Application</Badge>
            {alreadyApplied ? <Badge tone="amber">Already submitted</Badge> : null}
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">
            Submit your proposal
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#667085]">
            Keep it focused. Share your relevant experience, your approach, and when you can deliver.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                placeholder="Your name"
              />
            </Field>

            <Field label="Email address">
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                placeholder="you@example.com"
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Portfolio or work link">
              <input
                value={form.portfolio}
                onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                className={inputClass}
                placeholder="https://your-work.com"
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Proposal">
              <textarea
                required
                rows={7}
                value={form.proposal}
                onChange={(e) => setForm({ ...form, proposal: e.target.value })}
                className={textareaClass}
                placeholder="Explain your relevant experience, your approach, timeline, and what you will deliver."
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={alreadyApplied}
            className="mt-6 h-11 w-full rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
          >
            {alreadyApplied ? "Application already submitted" : "Submit application"}
          </button>
        </form>

        <aside className="h-fit rounded-[24px] border border-[#EAECF0] bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">Applying to</p>
          <h2 className="mt-2 text-base font-semibold leading-6 text-[#101828]">{quest.title}</h2>
          <p className="mt-2 text-sm text-[#667085]">{quest.company}</p>

          <div className="mt-5 space-y-2">
            <div className="rounded-2xl bg-[#F8FAFC] px-4 py-3">
              <p className="text-xs text-[#667085]">Reward</p>
              <p className="font-semibold text-[#101828]">{formatReward(quest)}</p>
            </div>
            <div className="rounded-2xl bg-[#F8FAFC] px-4 py-3">
              <p className="text-xs text-[#667085]">Timeline</p>
              <p className="font-semibold text-[#101828]">{quest.deadline}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}


// =========================================================
// File: src/pages/CreateQuestPage.jsx
// =========================================================

import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Field, { inputClass, textareaClass } from "@/components/ui/Field";
import { questTypes } from "@/data/demoQuests";
import { useQuests } from "@/context/QuestContext";

export default function CreateQuestPage() {
  const { createQuest } = useQuests();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    company: "",
    category: "Development",
    budget: "",
    rewardAsset: "USDC",
    deadline: "",
    level: "Intermediate",
    estimatedTime: "",
    description: "",
    requirements: "",
    deliverables: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    const quest = createQuest(form);
    if (quest) navigate(`/quests/${quest.id}`);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate("/quests")}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#667085] transition hover:text-[#101828]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to quests
      </button>

      <form onSubmit={handleSubmit} className="rounded-[28px] border border-[#EAECF0] bg-white p-5 shadow-sm sm:p-6">
        <Badge tone="purple">Create Quest</Badge>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">
          Publish a new quest
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
          Give contributors a clear scope, reward, timeline, and application guide.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Quest title">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
              placeholder="Example: Design a launch campaign banner"
            />
          </Field>

          <Field label="Project or business name">
            <input
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className={inputClass}
              placeholder="Project name"
            />
          </Field>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={inputClass}
            >
              {questTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </Field>

          <Field label="Budget">
            <input
              required
              type="number"
              min="1"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className={inputClass}
              placeholder="500"
            />
          </Field>

          <Field label="Reward asset">
            <select
              value={form.rewardAsset}
              onChange={(e) => setForm({ ...form, rewardAsset: e.target.value })}
              className={inputClass}
            >
              <option>USDC</option>
              <option>XLM</option>
            </select>
          </Field>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Timeline">
            <input
              required
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className={inputClass}
              placeholder="Example: 5 days"
            />
          </Field>

          <Field label="Level">
            <select
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className={inputClass}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </Field>

          <Field label="Estimated work">
            <input
              required
              value={form.estimatedTime}
              onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
              className={inputClass}
              placeholder="Example: 2–3 days"
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Quest description">
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={textareaClass}
              placeholder="Describe what needs to be done and why it matters."
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Application guide">
            <textarea
              required
              rows={4}
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              className={textareaClass}
              placeholder="Tell contributors what to include in their application."
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Deliverables">
            <textarea
              required
              rows={5}
              value={form.deliverables}
              onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
              className={textareaClass}
              placeholder={"One deliverable per line\nExample: Responsive React component\nExample: Mobile layout"}
            />
          </Field>
        </div>

        <button className="mt-6 h-11 w-full rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8]">
          Publish quest
        </button>
      </form>
    </div>
  );
}


// =========================================================
// File: src/pages/MyApplicationsPage.jsx
// =========================================================

import { Link } from "react-router";
import Badge from "@/components/ui/Badge";
import { useQuests } from "@/context/QuestContext";
import { findQuestById, formatReward } from "@/lib/questUtils";

function decisionTone(decision) {
  if (decision === "Accepted") return "green";
  if (decision === "Rejected") return "red";
  return "amber";
}

export default function MyApplicationsPage() {
  const { applications, quests } = useQuests();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
      <section className="rounded-[28px] border border-[#EAECF0] bg-white p-5 shadow-sm sm:p-6">
        <Badge tone="purple">Applications</Badge>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">
          Track your quest applications
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
          Review submitted applications, poster activity, and decision status.
        </p>
      </section>

      <section className="mt-5 space-y-3">
        {applications.map((application) => {
          const quest = findQuestById(quests, application.questId);
          if (!quest) return null;

          return (
            <article
              key={application.id}
              className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge tone={decisionTone(application.decision)}>
                      {application.decision}
                    </Badge>
                    <Badge tone="blue">{application.status}</Badge>
                  </div>

                  <Link
                    to={`/quests/${quest.id}`}
                    className="line-clamp-1 text-base font-semibold text-[#101828] transition hover:text-[#2F0FD1]"
                  >
                    {quest.title}
                  </Link>

                  <p className="mt-1 text-sm text-[#667085]">
                    {quest.company} • Submitted {application.submittedAt}
                  </p>
                  <p className="mt-2 text-sm text-[#667085]">
                    {application.posterNote}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 md:w-[280px]">
                  <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
                    <p className="text-[11px] text-[#667085]">Reward</p>
                    <p className="text-sm font-semibold text-[#101828]">
                      {formatReward(quest)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
                    <p className="text-[11px] text-[#667085]">Viewed</p>
                    <p className="text-sm font-semibold text-[#101828]">
                      {application.viewedByPoster ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}


// =========================================================
// File: src/App.jsx
// =========================================================

import { Navigate, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppShell from "@/components/layout/AppShell";
import { QuestProvider } from "@/context/QuestContext";
import ApplyQuestPage from "@/pages/ApplyQuestPage";
import CreateQuestPage from "@/pages/CreateQuestPage";
import MyApplicationsPage from "@/pages/MyApplicationsPage";
import QuestDetailPage from "@/pages/QuestDetailPage";
import QuestMarketplace from "@/pages/QuestMarketplace";

export default function App() {
  return (
    <QuestProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/quests" replace />} />
          <Route path="/quests" element={<QuestMarketplace />} />
          <Route path="/quests/create" element={<CreateQuestPage />} />
          <Route path="/quests/:questId" element={<QuestDetailPage />} />
          <Route path="/quests/:questId/apply" element={<ApplyQuestPage />} />
          <Route path="/my-applications" element={<MyApplicationsPage />} />
          <Route path="*" element={<Navigate to="/quests" replace />} />
        </Route>
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={2600}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="light"
      />
    </QuestProvider>
  );
}


// =========================================================
// File: src/main.jsx
// =========================================================

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "@/App";
import "@/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
