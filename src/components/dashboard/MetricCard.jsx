function MetricCard({ item, children }) {
  if (!item) {
    return (
      <div className="group min-w-[260px] flex-1 rounded-[24px] border border-[#EEF2FF] bg-white p-4 shadow-sm">
        {children || null}
      </div>
    );
  }

  const accentMap = {
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

  const accentByTitle = {
    "communities joined": "blue",
    "tasks completed": "green",
    "amount earned": "orange",
    "reputation score": "purple",
  };

  const helperTextByTitle = {
    "communities joined": "Communities you are actively part of",
    "tasks completed": "Completed contribution opportunities",
    "amount earned": "Rewards earned across your activity",
    "reputation score": "Your current contributor standing",
  };

  const accent = item.accent || accentByTitle[item.title] || "blue";
  const helperText = item.helperText || helperTextByTitle[item.title] || "";
  const theme = accentMap[accent] || accentMap.blue;

  return (
    <div
      className={[
        "group relative min-w-[260px] flex-1 overflow-hidden rounded-[24px] border p-4 shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        theme.card,
      ].join(" ")}
    >
      <div className={`absolute top-0 left-0 h-full w-1 ${theme.line}`} />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium tracking-wide text-[#667085]">
            {item.title}
          </p>

          <p className="mt-2 text-[28px] leading-none font-semibold tracking-tight text-[#101828]">
            {item.title === "amount earned" ? "$" : ""}
            {item.value}
            {item.title === "reputation score" ? (
              <span className="ml-1 text-sm font-medium text-[#98A2B3]">
                / 10
              </span>
            ) : null}
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
          {item.icon ? (
            <item.icon
              className={`text-[20px] ${item.title === "reputation score" ? "rotate-270" : ""}`}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default MetricCard;
