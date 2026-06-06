import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { PiMegaphoneFill } from "react-icons/pi";
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
    <section className="space-y-5">
      <div className="rounded-2xl border border-[#EEF2FF] bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3">
            <div>
              <h1 className="text-[22px] font-semibold tracking-tight text-[#050215] md:text-[26px]">
                Bursts
              </h1>
              <p className="mt-1 text-sm text-[#667085] md:text-[15px]">
                Discover, create, and participate in social media visibility
                campaigns.
              </p>
            </div>

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
          </div>

          <div className="flex w-full xl:w-auto">
            <Button
              onClick={handleCreateBurst}
              className="h-11 w-full rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white shadow-sm hover:bg-[#2409B8] xl:w-auto"
            >
              Create New Burst
            </Button>
          </div>
        </div>
      </div>

      <div>
        {loadingBursts ? (
          <Loader label="Loading bursts..." />
        ) : errorLoadingBursts ? (
          <Error
            title="Failed to load bursts"
            description="Please refresh the page or try again in a moment."
          />
        ) : filteredBursts.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-white px-6 py-10 text-center shadow-sm">
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

            <div className="mt-6">
              <MoreAboutBurst
                sheetIsOpen={sheetIsOpen}
                setSheetIsOpen={setSheetIsOpen}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
              {filteredBursts.map((burst) => (
                <BurstCard burst={burst} key={burst?.id} />
              ))}
            </div>

            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default Burst;
