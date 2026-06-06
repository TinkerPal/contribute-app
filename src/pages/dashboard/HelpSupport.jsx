import { useState } from "react";
import {
  LifeBuoy,
  MessageSquare,
  Mail,
  BookOpen,
  ShieldQuestion,
  ChevronRight,
  Search,
  Sparkles,
} from "lucide-react";
import Heading from "@/components/dashboard/Heading";
import { Button } from "@/components/ui/button";

const FAQS = [
  {
    question: "How do I join a community?",
    answer:
      "Open the Communities page, select a community, and click Join Community if membership is available.",
  },
  {
    question: "How do I complete a task?",
    answer:
      "Open a task, follow the required instructions, submit proof where needed, and wait for validation if the task requires review.",
  },
  {
    question: "How do I claim rewards?",
    answer:
      "Open the Earnings page and claim rewards that are marked as claimable.",
  },
  {
    question: "Why is my reward still pending?",
    answer:
      "Some rewards require manual or automated verification before they become claimable.",
  },
];

function SupportStatCard({ label, value, icon, accent = "blue", helperText }) {
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

function HelpCard({ icon, title, description, actionLabel }) {
  return (
    <div className="rounded-2xl border border-[#E6EAF5] bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#2F0FD1] shadow-sm">
          {icon}
        </div>

        <div className="space-y-2">
          <h3 className="text-[18px] font-semibold text-[#101828]">{title}</h3>
          <p className="text-sm leading-6 text-[#667085]">{description}</p>
        </div>

        <Button
          variant="outline"
          className="h-10 rounded-xl border-[#D0D5DD] bg-white px-4 text-sm font-medium text-[#344054] hover:bg-[#F9FAFB]"
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

function FAQRow({ item, isOpen, onToggle }) {
  return (
    <div className="rounded-2xl border border-[#E6EAF5] bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <span className="text-sm font-semibold text-[#101828]">
          {item.question}
        </span>
        <ChevronRight
          className={[
            "h-4 w-4 text-[#667085] transition-transform",
            isOpen ? "rotate-90" : "",
          ].join(" ")}
        />
      </button>

      {isOpen ? (
        <div className="border-t border-[#F2F4F7] px-4 py-4">
          <p className="text-sm leading-6 text-[#667085]">{item.answer}</p>
        </div>
      ) : null}
    </div>
  );
}

function HelpSupport() {
  const [searchValue, setSearchValue] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const filteredFaqs = FAQS.filter((item) => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return true;

    return (
      item.question.toLowerCase().includes(term) ||
      item.answer.toLowerCase().includes(term)
    );
  });

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
                <LifeBuoy className="h-4 w-4" />
                Help & Support
              </div>

              <div className="space-y-2">
                <h2 className="text-[28px] font-semibold tracking-tight text-[#101828]">
                  Get help, find answers, and contact support
                </h2>
                <p className="max-w-2xl text-[15px] leading-7 text-[#667085]">
                  Browse help resources, read frequently asked questions, and
                  find the best way to get support for your account or activity.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:flex-col">
              <Button className="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]">
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 lg:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SupportStatCard
              label="Help Articles"
              value="24"
              icon={<BookOpen className="h-5 w-5" />}
              accent="blue"
              helperText="Guides and walkthroughs"
            />
            <SupportStatCard
              label="FAQs"
              value={FAQS.length}
              icon={<ShieldQuestion className="h-5 w-5" />}
              accent="purple"
              helperText="Frequently asked questions"
            />
            <SupportStatCard
              label="Support Channels"
              value="3"
              icon={<MessageSquare className="h-5 w-5" />}
              accent="green"
              helperText="Ways to reach the team"
            />
            <SupportStatCard
              label="Response Priority"
              value="Standard"
              icon={<Sparkles className="h-5 w-5" />}
              accent="orange"
              helperText="Based on support workflow"
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[28px] border border-[#EEF2FF] bg-white p-4 shadow-sm md:p-5">
          <div className="space-y-4">
            <div className="relative flex h-11 w-full items-center rounded-xl border border-[#E4E7EC] bg-white pr-3 pl-10 shadow-sm transition focus-within:border-[#C7D7FE] focus-within:ring-2 focus-within:ring-[#EEF2FF]">
              <Search className="absolute left-3 h-4 w-4 text-[#98A2B3]" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search help articles or FAQs"
                className="w-full border-none bg-transparent text-sm text-[#344054] outline-none placeholder:text-[#98A2B3]"
              />
            </div>

            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-[#FCFCFD] px-6 py-10 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F7FF] text-[#2F0FD1]">
                    <ShieldQuestion className="h-8 w-8" />
                  </div>

                  <div className="max-w-lg space-y-2">
                    <h3 className="text-[22px] font-semibold tracking-tight text-[#101828]">
                      No matching help results
                    </h3>
                    <p className="text-sm leading-6 text-[#667085]">
                      Try another keyword or contact support for help.
                    </p>
                  </div>
                </div>
              ) : (
                filteredFaqs.map((item, index) => (
                  <FAQRow
                    key={item.question}
                    item={item}
                    isOpen={openFaq === index}
                    onToggle={() =>
                      setOpenFaq(openFaq === index ? null : index)
                    }
                  />
                ))
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <HelpCard
            icon={<Mail className="h-5 w-5" />}
            title="Email Support"
            description="Reach out for account help, bug reports, or reward-related issues."
            actionLabel="Email Us"
          />

          <HelpCard
            icon={<MessageSquare className="h-5 w-5" />}
            title="Community Support"
            description="Get help from the wider ecosystem or project communities."
            actionLabel="Open Community Help"
          />

          <HelpCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Guides & Documentation"
            description="Read walkthroughs for tasks, rewards, communities, and participation."
            actionLabel="Open Guides"
          />
        </section>
      </div>
    </div>
  );
}

export default HelpSupport;
