// src/lib/questUtils.js
import { layoutStorageKey } from "@/data/demoQuests";

export function getSavedLayout() {
  if (typeof window === "undefined") return "grid";

  const saved = window.localStorage.getItem(layoutStorageKey);
  return saved === "list" || saved === "grid" ? saved : "grid";
}

export function saveLayout(layout) {
  if (typeof window === "undefined") return;

  const safeLayout = layout === "list" || layout === "grid" ? layout : "grid";
  window.localStorage.setItem(layoutStorageKey, safeLayout);
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
  const asset = quest?.reward?.asset || quest?.rewardAsset || "USDC";

  const prizeTotal = (quest?.reward?.prizes || []).reduce(
    (sum, prize) => sum + (Number(prize.amount) || 0),
    0,
  );

  const tokenTotal =
    prizeTotal ||
    Number(quest?.rewardAmount) ||
    Number(quest?.totalRewardAmount) ||
    Number(quest?.budget) ||
    0;

  if (tokenTotal > 0) {
    return `${tokenTotal.toLocaleString()} ${asset}`;
  }

  return `${Number(quest?.reward?.defaultPoints || 500).toLocaleString()} pts`;
}

export function findQuestById(quests = [], questId) {
  return (
    quests.find((quest) => String(quest.id || quest._id) === String(questId)) ||
    null
  );
}
