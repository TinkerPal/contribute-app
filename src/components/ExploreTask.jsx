import { useNavigate } from "react-router";
import TasksCard from "./TasksCard";
import { Button } from "./ui/button";
import Loader from "./Loader";
import Error from "./Error";
import Empty from "./Empty";
import { useGetQuest } from "@/hooks/useGetQuest";

function ExploreTask() {
  const navigate = useNavigate();

  const LIMIT = 6;

  const { quests, loadingQuests, errorLoadingQuests } = useGetQuest(LIMIT);

  return (
    <div className="bg-[#F7F9FD]">
      <div className="mx-auto w-full max-w-[1200px] space-y-8 px-5 py-10 md:py-[104px]">
        <div className="mx-auto max-w-[1200px] space-y-8 text-center text-[#050215]">
          <h2 className="text-[32px] font-extrabold md:text-[44px]">
            Explore Available Tasks
          </h2>

          <p className="mx-auto max-w-[800px] text-[18px] font-light md:text-[20px]">
            Discover the most active opportunities from communities making real
            impact
          </p>
        </div>

        {loadingQuests ? (
          <Loader />
        ) : errorLoadingQuests ? (
          <Error title="Failed to load quests..." />
        ) : quests.length === 0 ? (
          <Empty title="No quest found..." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
            {quests.map((quest, i) => (
              <TasksCard task={quest} key={i} tag="home-page" />
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={() => {
              navigate("/tasks");
            }}
            size="lg"
            variant="secondary"
          >
            See all Tasks
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ExploreTask;
