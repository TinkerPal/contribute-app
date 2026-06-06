import { useEffect, useMemo, useState } from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import { PiCompassFill } from "react-icons/pi";
import {
  BriefcaseBusiness,
  CheckCircle2,
  LayoutGrid,
  List,
} from "lucide-react";

import CustomPagination from "@/components/CustomPagination";
import Heading from "@/components/dashboard/Heading";
import MetricCard from "@/components/dashboard/MetricCard";
import MetricsContainer from "@/components/dashboard/MetricsContainer";
import Error from "@/components/Error";
import Filter from "@/components/Filter";
import Loader from "@/components/Loader";
import CustomSearch from "@/components/Search";
import Sort from "@/components/Sort";
import TasksCard from "@/components/TasksCard";
import { Button } from "@/components/ui/button";
import { TASKS_OVERVIEW } from "@/lib/constants";
import { getQuests } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

const VIEW_OPTIONS = [
  { label: "Active", value: "active-tasks" },
  { label: "My Tasks", value: "my-tasks" },
  { label: "Completed", value: "completed" },
];

const TASK_LAYOUT_STORAGE_KEY = "contribute_tasks_layout";
const TASK_LAYOUT_OPTIONS = {
  GRID: "grid",
  LIST: "list",
};

function InfoPill({ icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#E8EDF7] bg-[#F8FAFC] px-3 py-2 text-sm text-[#667085]">
      <span className="text-[#2F0FD1]">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function hasUserParticipation(task, userId) {
  if (!task || !userId) return false;

  if (task?.userProgress) return true;

  if (Array.isArray(task?.participants)) {
    return task.participants.some((participant) => {
      if (!participant) return false;
      if (typeof participant === "string") return participant === userId;
      return (
        participant?.id === userId ||
        participant?.userId === userId ||
        participant?._id === userId
      );
    });
  }

  return false;
}

function isTaskCompleted(task) {
  if (!task) return false;

  if (task?.userProgress?.completed === true) return true;
  if (task?.completed === true) return true;
  if (task?.status === "COMPLETED" || task?.status === "completed") return true;

  return false;
}

function isTaskActive(task) {
  if (!task) return false;

  if (typeof task?.isActive === "boolean") return task.isActive;
  if (task?.status === "EXPIRED" || task?.status === "expired") return false;

  return true;
}

function getInitialTaskLayout() {
  if (typeof window === "undefined") return TASK_LAYOUT_OPTIONS.GRID;

  const savedLayout = window.localStorage.getItem(TASK_LAYOUT_STORAGE_KEY);

  if (
    savedLayout === TASK_LAYOUT_OPTIONS.GRID ||
    savedLayout === TASK_LAYOUT_OPTIONS.LIST
  ) {
    return savedLayout;
  }

  return TASK_LAYOUT_OPTIONS.GRID;
}

function Tasks() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sortOrder, setSortOrder] = useState("DESC");
  const [taskView, setTaskView] = useState("active-tasks");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [taskLayout, setTaskLayout] = useState(getInitialTaskLayout);

  const LIMIT = 10;
  const OFFSET = currentPage;

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TASK_LAYOUT_STORAGE_KEY, taskLayout);
    }
  }, [taskLayout]);

  const {
    data: questData,
    isLoading: loadingQuests,
    isError: errorLoadingQuests,
  } = useQuery({
    queryKey: ["quests", LIMIT, OFFSET, sortOrder],
    queryFn: () =>
      getQuests({
        limit: LIMIT,
        offset: OFFSET,
        sortOrder,
      }),
    keepPreviousData: true,
  });

  const quests = questData?.data ?? [];
  const totalPages = questData?.totalPages ?? 1;

  const filteredTasks = useMemo(() => {
    const term = searchValue.trim().toLowerCase();

    let list = [...quests];

    if (taskView === "active-tasks") {
      list = list.filter((task) => isTaskActive(task));
    }

    if (taskView === "my-tasks") {
      list = list.filter((task) => hasUserParticipation(task, user?.id));
    }

    if (taskView === "completed") {
      list = list.filter((task) => isTaskCompleted(task));
    }

    if (term) {
      list = list.filter((task) => {
        const title = String(
          task?.title || task?.questTitle || "",
        ).toLowerCase();
        const communityName = String(task?.communityName || "").toLowerCase();
        const category = String(task?.category || "").toLowerCase();
        const rewardType = String(task?.rewardType || "").toLowerCase();

        return (
          title.includes(term) ||
          communityName.includes(term) ||
          category.includes(term) ||
          rewardType.includes(term)
        );
      });
    }

    return list;
  }, [quests, taskView, searchValue, user?.id]);

  const handleChangeTaskView = (view) => {
    setTaskView(view);
    setCurrentPage(1);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const activeViewLabel =
    VIEW_OPTIONS.find((item) => item.value === taskView)?.label || "Active";

  const isGridLayout = taskLayout === TASK_LAYOUT_OPTIONS.GRID;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-[#EEF2FF] bg-white shadow-sm">
        <div className="border-b border-[#F2F4F7] bg-gradient-to-r from-[#FCFCFD] to-[#F8FAFF] px-5 py-6 lg:px-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="md:hidden">
                <Heading />
              </div>

              <div className="hidden space-y-3 md:block">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1.5 text-sm font-medium text-[#2F0FD1]">
                  <BriefcaseBusiness className="h-4 w-4" />
                  Tasks
                </div>

                <div className="space-y-2">
                  <h2 className="text-[28px] font-semibold tracking-tight text-[#101828]">
                    Explore, track, and complete contribution tasks
                  </h2>
                  <p className="max-w-2xl text-[15px] leading-7 text-[#667085]">
                    Discover active opportunities, keep up with your assigned
                    work, and review completed tasks across communities.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <InfoPill
                    icon={<PiCompassFill className="h-4 w-4" />}
                    label="Explore open opportunities"
                  />
                  <InfoPill
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    label="Track completed work"
                  />
                  <InfoPill
                    icon={<HiOutlineSparkles className="h-4 w-4" />}
                    label="Contribute across communities"
                  />
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:flex-col">
              <Button
                onClick={() => navigate("/tasks")}
                className="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
              >
                Explore Tasks
              </Button>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 lg:px-6">
          <MetricsContainer>
            {TASKS_OVERVIEW.map((item, index) => (
              <MetricCard key={index} item={item} />
            ))}
          </MetricsContainer>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#EEF2FF] bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="w-full lg:max-w-[320px]">
                    <CustomSearch
                      placeholder="Search tasks"
                      onSearchChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>

                  <div className="inline-flex w-full flex-wrap rounded-xl border border-[#EAECF5] bg-[#F8FAFC] p-1.5 lg:w-auto">
                    {VIEW_OPTIONS.map((option) => {
                      const isActive = taskView === option.value;

                      return (
                        <Button
                          key={option.value}
                          type="button"
                          variant="ghost"
                          onClick={() => handleChangeTaskView(option.value)}
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

                <div className="inline-flex w-full rounded-xl border border-[#EAECF5] bg-[#F8FAFC] p-1.5 sm:w-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setTaskLayout(TASK_LAYOUT_OPTIONS.GRID)}
                    className={[
                      "h-10 flex-1 rounded-lg px-4 text-sm font-medium transition-all sm:flex-none",
                      "inline-flex items-center justify-center gap-2",
                      "hover:bg-white hover:text-[#2F0FD1]",
                      isGridLayout
                        ? "bg-white text-[#2F0FD1] shadow-sm"
                        : "text-[#667085]",
                    ].join(" ")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    Grid
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setTaskLayout(TASK_LAYOUT_OPTIONS.LIST)}
                    className={[
                      "h-10 flex-1 rounded-lg px-4 text-sm font-medium transition-all sm:flex-none",
                      "inline-flex items-center justify-center gap-2",
                      "hover:bg-white hover:text-[#2F0FD1]",
                      !isGridLayout
                        ? "bg-white text-[#2F0FD1] shadow-sm"
                        : "text-[#667085]",
                    ].join(" ")}
                  >
                    <List className="h-4 w-4" />
                    List
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#F4F7FF] px-3 py-1.5 text-xs font-medium text-[#2F0FD1]">
                  View: {activeViewLabel}
                </span>

                <span className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#667085]">
                  Sort: {sortOrder === "DESC" ? "Newest first" : "Oldest first"}
                </span>

                <span className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#667085]">
                  Layout: {isGridLayout ? "Grid" : "List"}
                </span>

                <span className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#667085]">
                  {filteredTasks.length} task
                  {filteredTasks.length === 1 ? "" : "s"} shown
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start">
              <Filter />
              <Sort order={sortOrder} onToggle={handleSort} />
            </div>
          </div>

          {loadingQuests ? (
            <Loader label="Loading tasks..." />
          ) : errorLoadingQuests ? (
            <Error
              title="Failed to load tasks"
              description="Please refresh the page or try again."
            />
          ) : filteredTasks.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E1F2] bg-[#FCFCFD] px-6 py-10 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F7FF] text-[#2F0FD1]">
                <BriefcaseBusiness className="h-8 w-8" />
              </div>

              <div className="max-w-lg space-y-2">
                <h3 className="text-[22px] font-semibold tracking-tight text-[#101828]">
                  No tasks found
                </h3>
                <p className="text-sm leading-6 text-[#667085]">
                  Try changing your search, switching views, or check back later
                  for new opportunities.
                </p>
              </div>

              <div className="mt-5">
                <Button
                  onClick={() => {
                    setTaskView("active-tasks");
                    setSearchValue("");
                    setTaskLayout(TASK_LAYOUT_OPTIONS.GRID);
                  }}
                  className="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium text-white hover:bg-[#2409B8]"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#F8FAFC] p-3 ring-1 ring-[#EEF2FF] md:p-4">
              <div
                className={
                  isGridLayout
                    ? "grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3"
                    : "flex flex-col gap-3"
                }
              >
                {filteredTasks.map((quest) => (
                  <TasksCard
                    task={quest}
                    key={quest?.id}
                    tag="task-page"
                    layout={taskLayout}
                  />
                ))}
              </div>
            </div>
          )}

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </section>
    </div>
  );
}

export default Tasks;
