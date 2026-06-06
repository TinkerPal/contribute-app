import { Filter, Grid2X2, List, Search } from "lucide-react";

const questFilterOptions = [
  { label: "All", value: "all" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Ended", value: "ended" },
  { label: "My drafts", value: "draft" },
  { label: "Submitted", value: "submitted" },
];

export default function QuestFilters({
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
  layout,
  onLayoutChange,
  isLoggedIn,
}) {
  const visibleFilters = questFilterOptions.filter((option) => {
    if (option.value === "draft" || option.value === "submitted") {
      return Boolean(isLoggedIn);
    }

    return true;
  });

  return (
    <div className="sticky top-16 z-30 rounded-2xl border border-[#EAECF0] bg-white/95 p-3 shadow-sm backdrop-blur sm:p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full lg:w-[360px]">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search quests..."
            className="h-11 w-full rounded-xl border border-[#EAECF0] bg-white pr-3 pl-9 text-sm text-[#101828] transition outline-none focus:border-[#2F0FD1] focus:ring-4 focus:ring-[#EEF2FF]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:overflow-visible lg:pb-0">
          <div className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] px-2">
            <Filter className="h-4 w-4 text-[#667085]" />
            <select
              value={activeFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="h-10 rounded-lg bg-transparent px-1 text-sm font-medium text-[#344054] outline-none"
            >
              {visibleFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>

          <div className="inline-flex shrink-0 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] p-1">
            <button
              type="button"
              onClick={() => onLayoutChange("grid")}
              className={`inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-sm font-medium transition ${
                layout === "grid"
                  ? "bg-white text-[#2F0FD1] shadow-sm"
                  : "text-[#667085] hover:bg-white"
              }`}
            >
              <Grid2X2 className="h-4 w-4" />
              Grid
            </button>

            <button
              type="button"
              onClick={() => onLayoutChange("list")}
              className={`inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-sm font-medium transition ${
                layout === "list"
                  ? "bg-white text-[#2F0FD1] shadow-sm"
                  : "text-[#667085] hover:bg-white"
              }`}
            >
              <List className="h-4 w-4" />
              List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
