export const layoutStorageKey = "contribute_quest_layout";

export const categories = [
  "All",
  "Development",
  "Design",
  "Content",
  "Growth",
  "Social Media",
  "On-chain",
];

export const questTypes = categories.filter((item) => item !== "All");

export const demoUser = {
  id: "user-001",
  name: "Shola",
  email: "shola@contribute.fi",
  initials: "SH",
  reputation: 92,
  completedQuests: 14,
  activeApplications: 3,
  earned: 2840,
  responseRate: "96%",
  role: "Frontend Contributor",
};

export const demoQuests = [
  {
    id: "quest-001",
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
    level: "Intermediate",
    estimatedTime: "2–3 days",
    description:
      "Build a clean, responsive landing page section that explains the wallet value proposition, key features, and main call to action.",
    requirements:
      "Share previous frontend work, your estimated delivery time, and how you would structure the section.",
    deliverables: [
      "Responsive hero or feature section",
      "Clean CTA area",
      "Mobile-optimized layout",
      "Reusable React component",
    ],
  },
  {
    id: "quest-002",
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
    level: "Beginner",
    estimatedTime: "1 day",
    description:
      "Create short, clear social posts that explain how contributors can discover quests and earn from projects.",
    requirements:
      "Include samples of previous writing and a short explanation of your content style.",
    deliverables: [
      "10 short-form posts",
      "3 hook variations",
      "Suggested posting sequence",
    ],
  },
  {
    id: "quest-003",
    title: "Design three clean quest card variations",
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
    level: "Advanced",
    estimatedTime: "3–4 days",
    description:
      "Design premium quest card variations for a contributor marketplace interface.",
    requirements:
      "Submit portfolio links and explain your approach to hierarchy, spacing, and mobile design.",
    deliverables: [
      "3 card design variations",
      "Grid and list states",
      "Mobile responsive treatment",
      "Design notes",
    ],
  },
  {
    id: "quest-004",
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
    level: "Beginner",
    estimatedTime: "2 hours",
    description:
      "Go through a new quest flow, identify friction points, and provide clear feedback with screenshots.",
    requirements:
      "Explain your testing process and include examples of past product feedback if available.",
    deliverables: [
      "Flow feedback report",
      "Screenshots of friction points",
      "Suggested UX improvements",
    ],
  },
];

export const demoApplications = [
  {
    id: "app-001",
    questId: "quest-002",
    submittedAt: "Today",
    status: "Under review",
    decision: "Pending",
    viewedByPoster: true,
    posterNote: "The poster viewed your application.",
  },
  {
    id: "app-002",
    questId: "quest-003",
    submittedAt: "Yesterday",
    status: "Shortlisted",
    decision: "Pending",
    viewedByPoster: true,
    posterNote: "You are shortlisted for this quest.",
  },
  {
    id: "app-003",
    questId: "quest-004",
    submittedAt: "3 days ago",
    status: "Decision made",
    decision: "Accepted",
    viewedByPoster: true,
    posterNote: "The poster selected you for this quest.",
  },
];
