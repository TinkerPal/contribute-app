import { useNavigate } from "react-router";
import Badge2 from "../ui/Badge2";

export default function MarketplaceHero({ stats = {} }) {
  const navigate = useNavigate();

  const openQuests = Number(stats.openQuests || stats.activeQuests || 0);
  const totalBudget = Number(
    stats.totalBudgetUsd || stats.totalBudget || stats.rewardsAvailableUsd || 0,
  );
  const totalApplicants = Number(stats.totalApplicants || 0);
  const acceptedApplications = Number(stats.acceptedApplications || 0);

  const items = [
    ["Open quests", openQuests],
    [
      "Rewards",
      `$${totalBudget.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`,
    ],
    ["Applicants", totalApplicants],
    ["Accepted", acceptedApplications],
  ];

  return (
    <section className="rounded-2xl border border-[#EAECF0] bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge2 tone="purple">Marketplace</Badge2>
            <Badge2 tone="green">{openQuests} open quests</Badge2>
          </div>

          <h1 className="mt-2 text-xl font-semibold tracking-tight text-[#101828] sm:text-2xl">
            Discover paid quests from ecosystem projects
          </h1>
        </div>

        <button
          type="button"
          onClick={() => navigate("/quests/create")}
          className="h-10 shrink-0 rounded-xl bg-[#2F0FD1] px-4 text-sm font-medium text-white transition hover:bg-[#2409B8]"
        >
          Create Quest
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-[#F2F4F7] bg-[#FCFCFD] px-3 py-2"
          >
            <p className="text-[11px] text-[#667085]">{label}</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-[#101828]">
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
