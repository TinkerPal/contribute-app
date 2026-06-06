// =========================================================
// File: src/context/QuestContext.jsx
// =========================================================

import { createContext, useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { demoApplications, demoQuests, demoUser } from "@/data/demoQuests";
import { getInitials } from "@/lib/questUtils";

const QuestContext = createContext(null);

export function QuestProvider({ children }) {
  const [quests, setQuests] = useState(demoQuests);
  const [applications, setApplications] = useState(demoApplications);
  const [user, setUser] = useState(demoUser);

  const applicationQuestIds = useMemo(
    () => new Set(applications.map((item) => item.questId)),
    [applications],
  );

  const stats = useMemo(() => {
    const totalBudget = quests.reduce(
      (sum, quest) => sum + Number(quest.budget || 0),
      0,
    );

    const totalApplicants = quests.reduce(
      (sum, quest) => sum + Number(quest.applicants || 0),
      0,
    );

    const acceptedApplications = applications.filter(
      (item) => item.decision === "Accepted",
    ).length;

    return {
      openQuests: quests.length,
      totalBudget,
      totalApplicants,
      acceptedApplications,
    };
  }, [quests, applications]);

  function login(payload) {
    const name = payload.name?.trim() || demoUser.name;
    const email = payload.email?.trim() || demoUser.email;

    setUser({
      ...demoUser,
      name,
      email,
      initials: getInitials(name),
    });

    toast.success("You are signed in.");
  }

  function logout() {
    setUser(null);
    toast.success("You are signed out.");
  }

  function createQuest(payload) {
    if (!user) {
      toast.error("Sign in to create a quest.");
      return null;
    }

    const quest = {
      id: `quest-${Date.now()}`,
      ...payload,
      budget: Number(payload.budget),
      applicants: 0,
      status: "Open",
      postedBy: {
        name: user.name,
        role: "Quest publisher",
        email: user.email,
        initials: user.initials,
      },
      deliverables: payload.deliverables
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    setQuests((current) => [quest, ...current]);
    toast.success("Quest published successfully.");

    return quest;
  }

  function applyToQuest(questId, payload) {
    if (!user) {
      toast.error("Sign in to apply for this quest.");
      return false;
    }

    if (applicationQuestIds.has(questId)) {
      toast.error("You have already applied for this quest.");
      return false;
    }

    const newApplication = {
      id: `app-${Date.now()}`,
      questId,
      submittedAt: "Just now",
      status: "Submitted",
      decision: "Pending",
      viewedByPoster: false,
      posterNote: "Your application was submitted and is waiting for review.",
      applicant: {
        name: payload.name,
        email: payload.email,
        portfolio: payload.portfolio,
      },
      proposal: payload.proposal,
    };

    setApplications((current) => [newApplication, ...current]);
    setQuests((current) =>
      current.map((quest) =>
        quest.id === questId
          ? { ...quest, applicants: Number(quest.applicants || 0) + 1 }
          : quest,
      ),
    );

    toast.success("Application submitted successfully.");
    return true;
  }

  const value = {
    quests,
    applications,
    applicationQuestIds,
    user,
    stats,
    login,
    logout,
    createQuest,
    applyToQuest,
  };

  return (
    <QuestContext.Provider value={value}>{children}</QuestContext.Provider>
  );
}

export function useQuests() {
  const context = useContext(QuestContext);

  if (!context) {
    throw new Error("useQuests must be used inside QuestProvider");
  }

  return context;
}
