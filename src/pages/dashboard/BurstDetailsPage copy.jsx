import BackButton from "@/components/BackButton";
import { getBurst } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { FaUsers } from "react-icons/fa";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Empty from "@/components/Empty";
import { Fragment, useState } from "react";
import { endTime, timeAgo } from "@/utils";
import { IoIosCheckmarkCircle, IoIosRefreshCircle } from "react-icons/io";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CustomInput from "@/components/CustomInput";
import { useCompleteTask } from "@/hooks/useCompleteTask";
import TaskSubmissionForm from "@/components/dashboard/TaskSubmissionForm";
import OnChainTaskInput from "@/components/dashboard/OnChainTaskInput";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { BsInfoCircleFill } from "react-icons/bs";
import { PiMegaphoneFill } from "react-icons/pi";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function BurstDetailsPage() {
  const { burstId } = useParams();
  const { requireAuth } = useRequireAuth();
  const [collapsedTasks, setCollapsedTasks] = useState({});

  const toggleTask = (index) => {
    setCollapsedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  console.log({ burstId });

  const { mutateAsync: completeTask } = useCompleteTask();

  const { user } = useAuth();

  const handleCompleteTask = async (e, task) => {
    e.stopPropagation();

    if (!requireAuth()) return;

    const taskId = task.id;

    // await createGrowthQuest(payload, communityId);
    await completeTask({ taskId });
  };

  const {
    data: burst,
    isLoading: loadingQuest,
    isError: errorLoadingQuest,
  } = useQuery({
    queryKey: ["burst", burstId],
    queryFn: () => getBurst(burstId),
    enabled: !!burstId,
  });

  console.log({ burst });

  return (
    <div>
      <div className="space-y-8">
        <div className="md:hidden">
          <BackButton />
        </div>

        <div className="space-y-[32px] rounded-[4px] bg-white px-4 py-6 lg:px-[56px] lg:pt-[32px] lg:pb-[80px]">
          <div className="hidden md:block">
            <BackButton />
          </div>

          {loadingQuest ? (
            <Loader />
          ) : errorLoadingQuest ? (
            <Error title="Failed to load community details." />
          ) : (
            <div className="space-y-6">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <div className="space-y-4">
                      <h2 className="font-bricolage text-[20px] font-bold text-[#050215]">
                        {burst?.burstTitle}
                      </h2>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex shrink-0 items-center justify-between gap-2 rounded-[144px] bg-[#F0F4FD] px-5 py-2">
                          <BsInfoCircleFill />
                          <p
                            className={`flex gap-1.5 font-normal text-[#525866]`}
                          >
                            Your entry should be:{" "}
                            <span
                              className={`font-semibold ${burst?.sentimentCheck === "Positive" ? "text-[#67AD19]" : burst?.sentimentCheck === "Negative" ? "text-[#FF3B30]" : "text-[#525866]"}`}
                            >
                              {burst?.sentimentCheck}
                            </span>
                          </p>
                        </div>

                        <p className="flex shrink-0 gap-1.5 font-semibold text-[#2F0FD1]">
                          <img src="/Gift.svg" alt="" />
                          {burst.tokensForWinner} {burst.symbol}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`grid grid-cols-2 divide-x-[3px] divide-y-[3px] divide-[#F0F4FD] overflow-hidden rounded-[8px] border-[3px] border-[#F0F4FD] lg:grid-cols-4 lg:divide-y-0 lg:py-5 [@media(max-width:379px)]:grid-cols-1 [@media(max-width:379px)]:divide-x-0 [@media(max-width:379px)]:divide-y-[3px]`}
                  >
                    {burst?.participants && (
                      <div className="space-y-[12px] px-4 py-5 text-center lg:py-0">
                        <p className="text-[#525866]">Number of Participants</p>
                        <p className="font-semibold text-[#09032A]">
                          {burst?.participants.length}
                        </p>
                      </div>
                    )}

                    {burst?.endDate && (
                      <div className="space-y-[12px] px-4 py-5 text-center lg:py-0">
                        <p className="text-[#525866]">Burst Time</p>
                        <p className="font-semibold text-[#09032A]">
                          {endTime(burst?.endDate)}
                        </p>
                      </div>
                    )}

                    {burst?.trendAge && (
                      <div className="space-y-[12px] px-4 py-5 text-center lg:py-0">
                        <p className="text-[#525866]">Trend Age</p>
                        <p className="font-semibold text-[#09032A]">
                          {burst?.trendAge}
                        </p>
                      </div>
                    )}

                    {burst?.numberOfSelections && (
                      <div className="space-y-[12px] px-4 py-5 text-center lg:py-0">
                        <p className="text-[#525866]"> Number of Winners</p>
                        <p className="font-semibold text-[#09032A]">
                          {burst?.numberOfSelections}
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="font-normal text-[#525866]">
                    {burst?.conversation}
                  </p>
                </div>

                {user.id !== burst?.creatorId && (
                  <>
                    <Accordion
                      type="single"
                      collapsible
                      className="rounded-[8px] border border-[#8791A7] p-1"
                    >
                      <AccordionItem
                        value="post-trend-link"
                        className={`relative w-full cursor-pointer rounded-[8px] bg-white`}
                      >
                        <AccordionTrigger
                          className={`cursor-pointer bg-[#2F0FD1] px-8 py-4 text-white hover:no-underline`}
                        >
                          <p className="flex w-full items-center justify-between gap-2">
                            <span className="flex items-center gap-2">
                              <PiMegaphoneFill className="text-[30px]" />
                              Post Trend Link and Suggest a Post
                            </span>
                          </p>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 rounded-xl bg-white px-[30px] py-4 text-[18px] font-normal">
                          <div className="space-y-3">
                            <div className="flex w-full items-center gap-2">
                              1.{" "}
                              <div className="w-full">
                                <CustomInput placeholder="Paste Post URL Here" />
                              </div>
                            </div>

                            <div className="flex w-full items-center gap-2">
                              2.{" "}
                              <div className="w-full overflow-hidden rounded-[8px] border border-[#D4DCEA] text-[16px]">
                                <div className="flex items-center justify-between px-4 py-2 text-[#09032A]">
                                  <p className="font-semibold text-[#09032A]">
                                    Suggest Post for the Trend
                                  </p>

                                  <button
                                    type="button"
                                    onClick={() => toggleTask("suggest-post")}
                                    className="text-[#09032A]"
                                  >
                                    {collapsedTasks["suggest-post"] ? (
                                      <IoChevronDown className="text-[30px]" />
                                    ) : (
                                      <IoChevronUp className="text-[30px]" />
                                    )}
                                  </button>
                                </div>

                                {!collapsedTasks["suggest-post"] && (
                                  <div className="space-y-4 bg-white p-4">
                                    {/* <CustomInput placeholder="Write your suggested post here..." /> */}
                                    <Textarea
                                      className="h-[96px] rounded-[12px] border-none bg-[#F7F9FD] px-4 text-base placeholder:text-base placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0"
                                      placeholder="Type post here..."
                                      //   error={errors.conversation?.message}
                                      //   {...register("conversation")}
                                    />

                                    <div className="flex justify-end">
                                      <Button className="cursor-pointer rounded-md bg-[#2F0FD1] px-8 py-5 text-[16px] font-[300] hover:bg-[#2F0FD1]/70 hover:text-white">
                                        Submit Entry
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </>
                )}

                {user.id === burst?.creatorId && (
                  <>
                    <hr />
                    <div>
                      <h2 className="font-bricolage text-[20px] font-bold text-[#050215]">
                        Top Entries (5)
                      </h2>
                      <p className="text-[18px] text-[#525866]">
                        The selected entry gets selected as the winner
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BurstDetailsPage;
