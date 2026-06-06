import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Mic2,
  PlayCircle,
  Repeat2,
  ShieldCheck,
  Sparkles,
  Star,
  Users2,
  Video,
  Wand2,
} from "lucide-react";

const sessions = [
  {
    title: "Founder pitch practice",
    time: "Weekly live rooms",
    description: "Present your idea in 3–5 minutes and learn how to make it clearer, sharper, and easier to remember.",
    icon: Mic2,
  },
  {
    title: "Demo walkthroughs",
    time: "Product-focused",
    description: "Practice showing your product without losing people in unnecessary details or technical depth.",
    icon: Video,
  },
  {
    title: "Structured feedback",
    time: "After every session",
    description: "Get useful feedback on clarity, story, pacing, confidence, and what your audience actually understood.",
    icon: MessageSquareText,
  },
];

const steps = [
  "Join a small practice room",
  "Present your idea, demo, or pitch",
  "Receive structured feedback",
  "Refine and repeat next week",
];

const audience = [
  "Technical founders",
  "Builders preparing for demo days",
  "Developers explaining products",
  "Students presenting projects",
  "Creators sharing ideas publicly",
  "Professionals improving communication",
];

const feedback = [
  "Was the opening clear?",
  "Could people explain your idea back to you?",
  "Did the demo flow naturally?",
  "Where did the story lose energy?",
  "What should be simplified next time?",
];

function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/7 px-3 py-1 text-sm text-white/80 shadow-sm backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      {children}
    </span>
  );
}

function Button({ children, variant = "primary" }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200";
  const styles =
    variant === "primary"
      ? "bg-white text-slate-950 hover:bg-slate-200 shadow-[0_20px_60px_-20px_rgba(255,255,255,0.5)]"
      : "border border-white/12 bg-white/6 text-white hover:bg-white/10";
  return <button className={`${base} ${styles}`}>{children}</button>;
}

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="text-2xl font-bold tracking-tight text-white">{value}</div>
      <div className="mt-1 text-sm text-white/55">{label}</div>
    </div>
  );
}

export default function DemoLoop() {
  const [email, setEmail] = useState("");
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#070A12] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-18rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-16rem] right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-950 shadow-lg shadow-white/10">
            <Repeat2 size={21} />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight">DemoLoop</div>
            <div className="text-xs text-white/45">Practice. Present. Improve.</div>
          </div>
        </div>
        <nav className="hidden items-center gap-7 text-sm text-white/60 md:flex">
          <a href="#how" className="hover:text-white">How it works</a>
          <a href="#format" className="hover:text-white">Format</a>
          <a href="#join" className="hover:text-white">Join</a>
        </nav>
        <a href="#join" className="hidden sm:block"><Button>Join the waitlist</Button></a>
      </header>

      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-20">
        <div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge>Live presentation practice for builders</Badge>
            <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Get better at showing what you build.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65 sm:text-xl">
              DemoLoop helps founders, developers, creators, and professionals improve presentation, storytelling, and live communication through consistent practice and structured feedback.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#join"><Button>Start practicing <ArrowRight size={17} /></Button></a>
              <a href="#format"><Button variant="secondary"><PlayCircle size={17} /> See the format</Button></a>
            </div>
          </motion.div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            <Stat value="3–5m" label="Practice talks" />
            <Stat value="Live" label="Peer feedback" />
            <Stat value="Weekly" label="Improvement loop" />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65, delay: 0.1 }} className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-white/15 to-transparent blur-2xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#0B1020] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/45">Tonight's room</div>
                  <div className="mt-1 text-xl font-bold">Builder Demo Practice</div>
                </div>
                <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-300">Live soon</div>
              </div>
              <div className="mt-6 space-y-3">
                {sessions.map((item) => (
                  <div key={item.title} className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-slate-950">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="mt-1 text-sm text-white/50">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-gradient-to-r from-cyan-400/15 to-emerald-400/15 p-4 text-sm text-white/70">
                The goal is not perfection. The goal is visible improvement every time you speak.
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="how" className="relative border-y border-white/8 bg-white/[0.03] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <Badge>The feedback loop</Badge>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Communication improves through reps.</h2>
            <p className="mt-5 text-lg leading-8 text-white/60">DemoLoop turns presentation practice into a simple weekly system: speak, get feedback, refine, repeat.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-3xl border border-white/10 bg-[#0B1020]/80 p-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-sm font-black text-slate-950">{index + 1}</div>
                <div className="mt-6 text-lg font-bold">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="format" className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 sm:p-9">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200"><Clock3 /></div>
          <h3 className="mt-6 text-3xl font-black tracking-tight">Simple session format</h3>
          <p className="mt-4 leading-7 text-white/60">Each speaker gets a focused slot, then feedback from the room. No interruptions. No pressure. Just useful practice.</p>
          <div className="mt-7 space-y-3">
            {feedback.map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/75"><CheckCircle2 className="text-emerald-300" size={18} /> {item}</div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 sm:p-9">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200"><Users2 /></div>
          <h3 className="mt-6 text-3xl font-black tracking-tight">Built for people who build</h3>
          <p className="mt-4 leading-7 text-white/60">Whether you are preparing for a demo day, explaining a technical product, or learning to speak with more confidence, DemoLoop gives you a room to practice intentionally.</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {audience.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-sm text-white/70">{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <Badge>Why it matters</Badge>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.04em]">Great ideas still need clear stories.</h2>
              <p className="mt-5 leading-8 text-white/60">Many talented builders can create impressive products, but struggle when it is time to explain them live. DemoLoop exists to close that gap.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-[#0B1020] p-5"><Sparkles className="text-cyan-200" /><div className="mt-5 font-bold">Sharper storytelling</div><p className="mt-2 text-sm text-white/50">Turn complex ideas into simple, memorable explanations.</p></div>
              <div className="rounded-3xl bg-[#0B1020] p-5"><ShieldCheck className="text-emerald-200" /><div className="mt-5 font-bold">More confidence</div><p className="mt-2 text-sm text-white/50">Reduce fear by practicing regularly in a supportive room.</p></div>
              <div className="rounded-3xl bg-[#0B1020] p-5"><Wand2 className="text-violet-200" /><div className="mt-5 font-bold">Better demos</div><p className="mt-2 text-sm text-white/50">Learn what to show, what to skip, and where people get confused.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="join" className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950"><Star /></div>
        <h2 className="mt-6 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Join the first DemoLoop room.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/60">Starting on Discord first. Bring a project, idea, pitch, demo, or anything you want to explain better.</p>
        <form className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-full border border-white/10 bg-white/[0.05] p-2 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" className="min-h-12 flex-1 rounded-full bg-transparent px-5 text-white outline-none placeholder:text-white/35" />
          <button className="rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-200">Request invite</button>
        </form>
        <p className="mt-4 text-sm text-white/40">No spam. Just session updates and early community access.</p>
      </section>

      <footer className="relative border-t border-white/8 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-white/45 sm:flex-row">
          <div>© {year} DemoLoop. Practice. Present. Improve.</div>
          <div className="flex gap-5"><a href="#" className="hover:text-white">Discord</a><a href="#" className="hover:text-white">X/Twitter</a><a href="#" className="hover:text-white">Contact</a></div>
        </div>
      </footer>
    </main>
  );
}
