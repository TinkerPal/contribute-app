import CommunitiesCard from "@/components/CommunitiesCard";
import TasksCard from "@/components/TasksCard";
import { Button } from "@/components/ui/button";
import { OVERVIEW } from "@/lib/constants";
import OverviewHeading from "./OverviewHeading";
import MetricsContainer from "@/components/dashboard/MetricsContainer";
import MetricCard from "@/components/dashboard/MetricCard";
import Heading from "@/components/dashboard/Heading";
import { useNavigate } from "react-router";
import CreateCommunityForm from "@/components/CreateCommunityForm";
import { getCommunities, getQuests } from "@/services";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Empty from "@/components/Empty";
import { HiOutlineSparkles } from "react-icons/hi";
import { PiMegaphoneFill } from "react-icons/pi";

function Overview() {
  const navigate = useNavigate();

  const LIMIT = 6;
  const OFFSET = 1;

  const {
    data: communitiesData,
    isLoading: loadingCommunities,
    isError: errorLoadingCommunities,
  } = useQuery({
    queryKey: ["communities", LIMIT, OFFSET],
    queryFn: () => getCommunities({ limit: LIMIT, offset: OFFSET }),
    keepPreviousData: true,
  });

  const communities = communitiesData?.data || [];

  const {
    data: questsData,
    isLoading: loadingQuests,
    isError: errorLoadingQuests,
  } = useQuery({
    queryKey: ["quests", LIMIT, true],
    queryFn: () => getQuests({ limit: LIMIT, isActive: true }),
    keepPreviousData: true,
  });

  const quests = questsData?.data ?? [];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[28px] border border-[#EEF2FF] bg-white shadow-sm">
        <div className="border-b border-[#F2F4F7] bg-gradient-to-r from-[#FCFCFD] to-[#F7F9FF] px-5 py-6 lg:px-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="md:hidden">
                <Heading />
              </div>

              <div className="hidden space-y-2 md:block">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1.5 text-sm font-medium text-[#2F0FD1]">
                  <HiOutlineSparkles className="text-[16px]" />
                  Dashboard Overview
                </div>

                <h2 className="text-[28px] font-semibold tracking-tight text-[#101828]">
                  Track activity, discover opportunities, and grow your presence
                </h2>

                <p className="max-w-2xl text-[15px] leading-7 text-[#667085]">
                  View open tasks, discover active communities, and monitor key
                  performance metrics from one place.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
              <Button
                onClick={() => navigate("/tasks")}
                className="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
              >
                Explore Tasks
              </Button>

              {/* <CreateCommunityForm
                triggerLabel="Create Community"
                triggerClassName="h-11 rounded-xl border border-[#D0D5DD] bg-white px-5 text-sm font-medium text-[#344054] hover:bg-[#F9FAFB]"
                triggerVariant="outline"
              /> */}
              <CreateCommunityForm
                triggerLabel="Create Community"
                triggerClassName="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
                triggerVariant="default"
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-5 lg:px-6">
          <MetricsContainer>
            {OVERVIEW.map((item, index) => (
              <MetricCard key={index} item={item} />
            ))}
          </MetricsContainer>
        </div>
      </section>

      <section className="space-y-5">
        <OverviewHeading
          title="Open Tasks"
          description="Explore active opportunities and contribute to ongoing work across communities."
        >
          <Button
            onClick={() => navigate("/tasks")}
            variant="outline"
            className="h-11 rounded-xl border-[#D0D5DD] bg-white px-5 text-sm font-medium text-[#344054] hover:bg-[#F9FAFB]"
          >
            View All Tasks
          </Button>
        </OverviewHeading>

        {loadingQuests ? (
          <Loader label="Loading open tasks..." />
        ) : errorLoadingQuests ? (
          <Error
            title="Failed to load tasks"
            description="Please refresh the page or try again."
          />
        ) : quests.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#D9E1F2] bg-[#FCFCFD] px-6 py-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F7FF] text-[#2F0FD1]">
              <HiOutlineSparkles className="h-8 w-8" />
            </div>

            <div className="max-w-lg space-y-2">
              <h3 className="text-[22px] font-semibold tracking-tight text-[#101828]">
                No open tasks right now
              </h3>
              <p className="text-sm leading-6 text-[#667085]">
                New contribution opportunities will appear here as communities
                publish them. Explore all tasks to check for updates.
              </p>
            </div>

            <div className="mt-5">
              <Button
                onClick={() => navigate("/tasks")}
                className="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
              >
                Explore Tasks
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {quests.map((quest) => (
              <TasksCard task={quest} key={quest?.id} tag="task-page" />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <OverviewHeading
          title="Communities"
          description="Discover communities building impactful projects and join the ones that match your interests."
          large
        >
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              onClick={() => navigate("/communities")}
              variant="outline"
              className="h-11 rounded-xl border-[#D0D5DD] bg-white px-5 text-sm font-medium text-[#344054] hover:bg-[#F9FAFB]"
            >
              View All Communities
            </Button>

            <div className="sm:min-w-[200px]">
              <CreateCommunityForm />
            </div>
          </div>
        </OverviewHeading>

        {loadingCommunities ? (
          <Loader label="Loading communities..." />
        ) : errorLoadingCommunities ? (
          <Error
            title="Failed to load communities"
            description="Please refresh the page or try again."
          />
        ) : communities.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#D9E1F2] bg-[#FCFCFD] px-6 py-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F7FF] text-[#2F0FD1]">
              <HiOutlineSparkles className="h-8 w-8" />
            </div>

            <div className="max-w-lg space-y-2">
              <h3 className="text-[22px] font-semibold tracking-tight text-[#101828]">
                No communities yet
              </h3>
              <p className="text-sm leading-6 text-[#667085]">
                Create a community to bring contributors together, publish
                tasks, and start growing activity around your project.
              </p>
            </div>

            <div className="mt-5 sm:min-w-[200px]">
              <CreateCommunityForm
                triggerLabel="Create Community"
                triggerClassName="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
                triggerVariant="default"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {communities.map((community) => (
              <CommunitiesCard community={community} key={community?.id} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[24px] border border-[#EEF2FF] bg-white px-5 py-5 shadow-sm lg:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F4F7FF] px-3 py-1 text-sm font-medium text-[#2F0FD1]">
              <PiMegaphoneFill className="text-[16px]" />
              Burst Campaigns
            </div>

            <h3 className="text-[20px] font-semibold tracking-tight text-[#101828]">
              Want more visibility for your product or community?
            </h3>

            <p className="text-sm leading-6 text-[#667085]">
              Launch a Burst campaign to engage in active social conversations
              with community-powered ideas and visibility-focused submissions.
            </p>
          </div>

          <Button
            onClick={() => navigate("/burst")}
            className="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
          >
            Explore Bursts
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Overview;
