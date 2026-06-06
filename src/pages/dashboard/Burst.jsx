import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { PiMegaphoneFill } from "react-icons/pi";
import { HiOutlineSparkles, HiOutlineTrendingUp } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import BurstCard from "@/components/BurstCard";
import CustomPagination from "@/components/CustomPagination";
import MoreAboutBurst from "@/components/dashboard/MoreAboutBurst";
import Error from "@/components/Error";
import Filter from "@/components/Filter";
import Loader from "@/components/Loader";
import { useAuth } from "@/hooks/useAuth";
import { useGetBursts } from "@/hooks/useGetBursts";

const VIEW_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Created", value: "created" },
  { label: "Participated", value: "participated" },
];

const PLATFORM_OPTIONS = [
  { label: "All platforms", value: "all" },
  { label: "X / Twitter", value: "twitter" },
  { label: "Instagram", value: "instagram" },
  { label: "TikTok", value: "tiktok" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Facebook", value: "facebook" },
];

function BurstInfoPill({ icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#E9EEF9] bg-[#F8FAFC] px-3 py-2 text-sm text-[#667085]">
      <span className="text-[#2F0FD1]">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function Burst() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [burstView, setBurstView] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const LIMIT = 10;
  const OFFSET = currentPage;

  const { bursts, loadingBursts, errorLoadingBursts, totalPages } =
    useGetBursts(LIMIT, OFFSET, "DESC", burstView);

  const rawBursts = bursts?.data ?? [];

  const filteredBursts = useMemo(() => {
    if (platformFilter === "all") return rawBursts;

    return rawBursts.filter((burst) => {
      const platform = String(burst?.platform || "")
        .trim()
        .toLowerCase();

      return platform === platformFilter;
    });
  }, [rawBursts, platformFilter]);

  const activePlatformLabel = useMemo(() => {
    return (
      PLATFORM_OPTIONS.find((item) => item.value === platformFilter)?.label ||
      "All platforms"
    );
  }, [platformFilter]);

  const activeViewLabel = useMemo(() => {
    return (
      VIEW_OPTIONS.find((item) => item.value === burstView)?.label || "All"
    );
  }, [burstView]);

  const handleChangeBurstView = useCallback(
    (view) => {
      if (!isAuthenticated && (view === "created" || view === "participated")) {
        navigate("/get-started");
        return;
      }

      setBurstView(view);
      setCurrentPage(1);
    },
    [isAuthenticated, navigate],
  );

  const handleCreateBurst = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/get-started");
      return;
    }

    navigate("/burst/new-burst");
  }, [isAuthenticated, navigate]);

  const handlePlatformChange = useCallback((value) => {
    setPlatformFilter(value);
    setCurrentPage(1);
  }, []);

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-[#EEF2FF] bg-white shadow-sm">
        <div className="border-b border-[#F2F4F7] bg-gradient-to-r from-[#FCFCFD] to-[#F8FAFF] px-4 py-5 md:px-5 md:py-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1.5 text-sm font-medium text-[#2F0FD1]">
                <PiMegaphoneFill className="text-[18px]" />
                Burst Campaigns
              </div>

              <div className="space-y-2">
                <h1 className="text-[24px] font-semibold tracking-tight text-[#050215] md:text-[28px]">
                  Discover and launch visibility campaigns around active social
                  trends
                </h1>
                <p className="max-w-2xl text-[15px] leading-7 text-[#667085]">
                  Burst helps builders and brands join relevant conversations
                  with community-powered post suggestions and campaign
                  participation across social platforms.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <BurstInfoPill
                  icon={<HiOutlineTrendingUp className="h-4 w-4" />}
                  label="Trend-focused visibility"
                />
                <BurstInfoPill
                  icon={<HiOutlineSparkles className="h-4 w-4" />}
                  label="Community-powered ideas"
                />
                <BurstInfoPill
                  icon={<PiMegaphoneFill className="h-4 w-4" />}
                  label="Create or participate"
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:flex-col">
              <Button
                onClick={handleCreateBurst}
                className="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
              >
                Create New Burst
              </Button>

              <MoreAboutBurst
                sheetIsOpen={sheetIsOpen}
                setSheetIsOpen={setSheetIsOpen}
                triggerClassName="h-11 rounded-xl border border-[#E0E7FF] bg-white px-6 text-sm font-medium text-[#2F0FD1] hover:bg-[#F8FAFF]"
              />
            </div>
          </div>
        </div>

        <div className="px-4 py-4 md:px-5 md:py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <Filter
                  value={platformFilter}
                  onChange={handlePlatformChange}
                  options={PLATFORM_OPTIONS}
                  placeholder="Filter by platform"
                />

                <div className="inline-flex w-full flex-wrap rounded-xl border border-[#EAECF5] bg-[#F8FAFC] p-1.5 lg:w-auto">
                  {VIEW_OPTIONS.map((option) => {
                    const isActive = burstView === option.value;

                    return (
                      <Button
                        key={option.value}
                        type="button"
                        variant="ghost"
                        onClick={() => handleChangeBurstView(option.value)}
                        className={[
                          "h-10 rounded-lg px-4 text-sm font-medium transition-all",
                          "hover:bg-white hover:text-[#2F0FD1]",
                          isActive
                            ? "bg-white text-[#2F0FD1] shadow-sm"
                            : "text-[#667085]",
                        ].join(" ")}
                      >
                        {option.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#F4F7FF] px-3 py-1.5 text-xs font-medium text-[#2F0FD1]">
                  View: {activeViewLabel}
                </span>
                <span className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#667085]">
                  Platform: {activePlatformLabel}
                </span>
                <span className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#667085]">
                  {filteredBursts.length} burst
                  {filteredBursts.length === 1 ? "" : "s"} shown
                </span>
              </div>
            </div>

            <div className="hidden xl:block">
              <div className="rounded-xl bg-[#F8FAFC] px-4 py-3 text-right">
                <p className="text-xs font-medium tracking-wide text-[#98A2B3] uppercase">
                  Visibility campaigns
                </p>
                <p className="mt-1 text-sm text-[#667085]">
                  Create campaigns or discover relevant ongoing bursts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {loadingBursts ? (
          <Loader label="Loading bursts..." />
        ) : errorLoadingBursts ? (
          <Error
            title="Failed to load bursts"
            description="Please refresh the page or try again in a moment."
          />
        ) : filteredBursts.length === 0 ? (
          <div className="flex min-h-[440px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-white px-6 py-10 text-center shadow-sm">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F4F7FF] text-[#2F0FD1]">
              <PiMegaphoneFill className="h-10 w-10" />
            </div>

            <div className="max-w-xl space-y-3">
              <h2 className="text-[24px] font-semibold tracking-tight text-[#050215]">
                Increase your brand or product visibility
              </h2>
              <p className="text-[15px] leading-7 text-[#667085]">
                Burst helps you engage in relevant social trends through
                community-powered suggestions and campaign participation.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleCreateBurst}
                className="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
              >
                Create New Burst
              </Button>

              <MoreAboutBurst
                sheetIsOpen={sheetIsOpen}
                setSheetIsOpen={setSheetIsOpen}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-[20px] font-semibold tracking-tight text-[#050215]">
                  Explore Bursts
                </h2>
                <p className="mt-1 text-sm text-[#667085]">
                  Browse active campaigns and find the ones most relevant to
                  your platform and audience.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {filteredBursts.map((burst) => (
                <BurstCard burst={burst} key={burst?.id} />
              ))}
            </div>

            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </section>
  );
}

export default Burst;
