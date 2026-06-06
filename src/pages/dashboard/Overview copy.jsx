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
      <div className="space-y-3">
        <div className="md:hidden">
          <Heading />
        </div>

        <MetricsContainer>
          {OVERVIEW.map((item, index) => (
            <MetricCard key={index}>
              <div className="rounded-full bg-[#F0F4FD] p-3">
                {item.icon && (
                  <item.icon
                    className={`inline-block text-[30px] text-[#2F0FD1] ${item.title === "reputation score" && "rotate-270"}`}
                  />
                )}
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[28px] font-bold text-[#050215]">
                  {item.title === "amount earned" && "$"}
                  {item.value}
                  {item.title === "reputation score" && <small> / 10</small>}
                </span>
                <span className="font-medium text-[#7A899B]">{item.title}</span>
              </div>
            </MetricCard>
          ))}
        </MetricsContainer>
      </div>

      <div className="space-y-5">
        <OverviewHeading
          title="Open Tasks"
          description="Explore available tasks"
        >
          <Button
            onClick={() => navigate("/tasks")}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            View All
          </Button>
        </OverviewHeading>

        {loadingQuests ? (
          <Loader />
        ) : errorLoadingQuests ? (
          <Error title="Failed to load quests..." />
        ) : quests.length === 0 ? (
          <Empty title="No quests found..." />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {quests.map((quest, i) => (
                <TasksCard task={quest} key={i} tag="task-page" />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="space-y-5">
        <OverviewHeading
          title="Communities"
          description="Discover and Join communities building impactful projects"
          large={true}
        >
          <div className="flex w-full gap-4">
            <Button
              onClick={() => navigate("/communities")}
              variant="outline"
              size="lg"
              className="flex-1 bg-white"
            >
              View All
            </Button>

            <div className="w-1/2 sm:flex-1">
              <CreateCommunityForm />
            </div>
          </div>
        </OverviewHeading>

        {loadingCommunities ? (
          <Loader />
        ) : // <div className="flex h-32 items-center justify-center">
        //   <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        // </div>
        errorLoadingCommunities ? (
          <Error title="Failed to load communities..." />
        ) : // <div className="flex h-32 items-center justify-center">
        //   <p className="text-2xl font-bold">Failed to load communities...</p>
        // </div>
        communities.length === 0 ? (
          <Empty title="No communities found..." />
        ) : (
          // <div className="flex h-32 items-center justify-center">
          //   <p className="text-2xl font-bold">No communities found...</p>
          // </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {communities.map((community, i) => (
              <CommunitiesCard community={community} key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Overview;
