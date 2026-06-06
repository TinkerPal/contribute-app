import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Compass,
  Link2,
  Send,
  Users,
  WalletCards,
} from "lucide-react";

import Field, { inputClass, textareaClass } from "@/components/ui/Field";
import { useQuests } from "@/context/QuestContext";
import { findQuestById, formatReward } from "@/lib/questUtils";
import Badge2 from "@/components/ui/Badge2";

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
      <Icon className="mb-3 h-4 w-4 text-[#2F0FD1]" />
      <p className="text-xs font-medium text-[#667085]">{label}</p>
      <p className="mt-1 text-base font-semibold text-[#101828]">{value}</p>
    </div>
  );
}

export default function ApplyGeneralQuestPage() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { quests, user, applyToQuest, applicationQuestIds } = useQuests();

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
      <main className="min-h-screen bg-[#F8FAFC] px-3 py-4">
        <div className="rounded-2xl border border-[#EAECF0] bg-white p-8 text-center shadow-sm">
          <Compass className="mx-auto mb-4 h-9 w-9 text-[#2F0FD1]" />
          <h1 className="text-lg font-semibold text-[#101828]">
            Quest not found
          </h1>
          <p className="mt-2 text-sm text-[#667085]">
            This quest may have been removed or the link is incorrect.
          </p>
          <button
            type="button"
            onClick={() => navigate("/quests")}
            className="mt-5 h-10 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white transition hover:bg-[#2409B8]"
          >
            Browse quests
          </button>
        </div>
      </main>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    const success = applyToQuest(quest.id, form);

    if (success) {
      navigate("/applications");
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="space-y-4 px-3 py-4">
        <button
          type="button"
          onClick={() => navigate(`/quests/${quest.id}`)}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#EAECF0] bg-white px-4 text-sm font-medium text-[#344054] shadow-sm transition hover:bg-[#F9FAFB]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to quest
        </button>

        <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge2 tone="purple">{quest.category}</Badge2>
                <Badge2 tone="green">{quest.status}</Badge2>
                <Badge2 tone="blue">{quest.level}</Badge2>
                {alreadyApplied ? (
                  <Badge2 tone="amber">Application submitted</Badge2>
                ) : null}
              </div>

              <h1 className="max-w-4xl text-2xl font-semibold tracking-tight text-[#101828] sm:text-3xl">
                Apply for this quest
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085]">
                Submit a clear application for{" "}
                <span className="font-medium text-[#344054]">
                  {quest.title}
                </span>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] px-4 py-3">
              <p className="text-xs font-medium text-[#667085]">Project</p>
              <p className="mt-1 text-sm font-semibold text-[#101828]">
                {quest.company}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={WalletCards}
              label="Reward"
              value={formatReward(quest)}
            />
            <StatCard icon={Clock3} label="Timeline" value={quest.deadline} />
            <StatCard
              icon={Users}
              label="Applicants"
              value={quest.applicants}
            />
            <StatCard
              icon={CheckCircle2}
              label="Estimated work"
              value={quest.estimatedTime}
            />
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
                  Keep it specific. Share your experience, approach, and
                  delivery timeline.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
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
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </Field>
              </div>

              <Field label="Portfolio or work link">
                <div className="relative">
                  <Link2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                  <input
                    value={form.portfolio}
                    onChange={(e) =>
                      setForm({ ...form, portfolio: e.target.value })
                    }
                    className={`${inputClass} pl-9`}
                    placeholder="https://your-work.com"
                  />
                </div>
              </Field>

              <Field label="Proposal">
                <textarea
                  required
                  rows={8}
                  value={form.proposal}
                  onChange={(e) =>
                    setForm({ ...form, proposal: e.target.value })
                  }
                  className={textareaClass}
                  placeholder="I can help with this quest by..."
                />
              </Field>

              <div className="rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-[#667085]">
                Your application will be shared with the project owner for
                review. Make sure your links are accessible.
              </div>

              <div className="sticky bottom-0 -mx-4 -mb-4 border-t border-[#EAECF0] bg-white/95 px-4 py-4 backdrop-blur sm:-mx-5 sm:-mb-5 sm:px-5">
                <button
                  type="submit"
                  disabled={alreadyApplied}
                  className="h-11 w-full rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#2409B8] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
                >
                  {alreadyApplied
                    ? "Application already submitted"
                    : "Submit application"}
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
                Quest summary
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#667085]">
                {quest.description}
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
