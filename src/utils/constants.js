export const REWARD_MODES = ["Overall Reward", "Individual Task Reward"];
export const SENTIMENT_CHECK = ["Positive", "Neutral", "Negative"];

export const REWARD_TYPES = [
  { label: "Points", value: "Points" },
  { label: "Token", value: "Token" },
];

export const SOCIAL_MEDIA_PLATFORM = [
  { label: "X (Twitter)", value: "X (Twitter)" },
  { label: "Discord", value: "Discord" },
  { label: "Telegram", value: "Telegram" },
  { label: "Facebook", value: "Facebook" },
];

export const POST_START_TIME = [
  { label: "Post started within 2hrs", value: "Post started within 2hrs" },
  { label: "Post started within 4hrs", value: "Post started within 4hrs" },
  { label: "Post started within 8hrs", value: "Post started within 8hrs" },
  { label: "Post started within 12hrs", value: "Post started within 12hrs" },
  { label: "Post started within 24hrs", value: "Post started within 24hrs" },
];

export const BURST_SELECTION_METHOD = [
  {
    label: "Automated",
    value: "Automated: AI selects and publishes the best entry",
  },
  {
    label: "Assisted",
    value: "Assisted: AI shortlists; manual review required",
  },
];

export const NETWORK_TYPES = [
  { label: "TESTNET", value: "TESTNET" },
  { label: "PUBLIC", value: "PUBLIC" },
];

export const TASK_TYPES = [
  { label: "Post on Twitter", value: "Post on Twitter" },
  { label: "Follow on Twitter", value: "Follow on Twitter" },
  { label: "Comment on Twitter", value: "Comment on Twitter" },
  { label: "Like Tweet", value: "Like Tweet" },
  { label: "Post on Discord", value: "Post on Discord" },
  { label: "Join Telegram Channel", value: "Join Telegram Channel" },
  { label: "Post on Telegram Group", value: "Post on Telegram Group" },
];

export const WINNER_SELECTION_METHOD = [
  { label: "Random", value: "Random" },
  { label: "FCFS", value: "fcfs" },
];

export const SELECTION_METHOD = [
  { label: "Manual Assignment Required", value: "Manual Assignment Required" },
  { label: "First to Complete", value: "First to Complete" },
];

export const TASK_PREVIEW_CONFIG = {
  "Follow on Twitter": {
    label: "Twitter Profile",
    field: "twitterUrl",
  },
  "Comment on Twitter": {
    label: "Tweet URL",
    field: "tweetUrl",
  },
  "Like Tweet": {
    label: "Tweet URL",
    field: "tweetUrl",
  },
  "Post on Discord": {
    label: "Discord Link",
    field: "discordLink",
  },
  "Join Telegram Channel": {
    label: "Telegram Link",
    field: "telegramLink",
  },
  "Post on Telegram Group": {
    label: "Telegram Group Link",
    field: "telegramGroupLink",
  },
};

export const VERIFICATION_MODES = [
  "Contract Invocation",
  "Observe Account Calls",
];
