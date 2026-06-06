import { Fragment, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { BsInfoCircleFill, BsClockHistory, BsTrophyFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { PiMegaphoneFill } from "react-icons/pi";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Sparkles, Link as LinkIcon } from "lucide-react";

import BackButton from "@/components/BackButton";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { getBurst } from "@/services";
import { endTime } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";

function StatCard({ icon, label, value, accent = "blue", helperText }) {
  const accentStyles = {
    blue: {
      card: "border-[#E0E7FF] bg-gradient-to-br from-white to-[#F8FAFF]",
      iconWrap: "bg-[#EEF2FF] text-[#2F0FD1]",
      value: "text-[#09032A]",
      line: "bg-[#2F0FD1]",
    },
    green: {
      card: "border-[#D9F3DC] bg-gradient-to-br from-white to-[#F6FFF7]",
      iconWrap: "bg-[#EAFBF0] text-[#2E9B4F]",
      value: "text-[#09032A]",
      line: "bg-[#2E9B4F]",
    },
    orange: {
      card: "border-[#FDE7C7] bg-gradient-to-br from-white to-[#FFF9F2]",
      iconWrap: "bg-[#FFF1DE] text-[#D9822F]",
      value: "text-[#09032A]",
      line: "bg-[#D9822F]",
    },
    purple: {
      card: "border-[#E9DDFF] bg-gradient-to-br from-white to-[#FAF7FF]",
      iconWrap: "bg-[#F3ECFF] text-[#7C3AED]",
      value: "text-[#09032A]",
      line: "bg-[#7C3AED]",
    },
  };

  const theme = accentStyles[accent] || accentStyles.blue;

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        theme.card,
      ].join(" ")}
    >
      <div className={`absolute top-0 left-0 h-full w-1 ${theme.line}`} />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium tracking-wide text-[#667085]">
            {label}
          </p>

          <p
            className={`mt-2 text-2xl leading-none font-semibold tracking-tight ${theme.value}`}
          >
            {value}
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
          <div className="text-[18px]">{icon}</div>
        </div>
      </div>
    </div>
  );
}

function BurstDetailsPage() {
  const { burstId } = useParams();
  const { requireAuth } = useRequireAuth();
  const { user } = useAuth();

  const [collapsedTasks, setCollapsedTasks] = useState({
    "suggest-post": false,
  });

  const toggleTask = (key) => {
    setCollapsedTasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const {
    data: burst,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["burst", burstId],
    queryFn: () => getBurst(burstId),
    enabled: !!burstId,
  });

  const isCreator =
    user?.id && burst?.creatorId ? user.id === burst.creatorId : false;

  const sentimentColor = useMemo(() => {
    if (burst?.sentimentCheck === "Positive") return "text-[#67AD19]";
    if (burst?.sentimentCheck === "Negative") return "text-[#FF3B30]";
    return "text-[#525866]";
  }, [burst?.sentimentCheck]);

  const stats = [
    {
      key: "participants",
      show: true,
      label: "Participants",
      value: burst?.participants?.length ?? 0,
      icon: <FaUsers className="text-[18px]" />,
      accent: "blue",
      helperText: "People who have joined this burst",
    },
    {
      key: "endDate",
      show: !!burst?.endDate,
      label: "Burst Time",
      value: burst?.endDate ? endTime(burst.endDate) : "—",
      icon: <BsClockHistory className="text-[18px]" />,
      accent: "orange",
      helperText: "Time remaining before submissions close",
    },
    {
      key: "trendAge",
      show: !!burst?.trendAge,
      label: "Trend Age",
      value: burst?.trendAge || "—",
      icon: <Sparkles className="h-[18px] w-[18px]" />,
      accent: "purple",
      helperText: "How recent the trend is",
    },
    {
      key: "numberOfSelections",
      show:
        burst?.numberOfSelections !== undefined &&
        burst?.numberOfSelections !== null,
      label: "Number of Winners",
      value: burst?.numberOfSelections ?? 0,
      icon: <BsTrophyFill className="text-[18px]" />,
      accent: "green",
      helperText: "Entries that can be selected",
    },
  ].filter((item) => item.show);

  return (
    <div className="space-y-6">
      <div className="md:hidden">
        <BackButton />
      </div>

      <div className="rounded-2xl bg-white px-4 py-6 shadow-sm lg:px-10 lg:py-8">
        <div className="mb-6 hidden md:block">
          <BackButton />
        </div>

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Error title="Failed to load burst details." />
        ) : !burst ? (
          <Error title="Burst not found." />
        ) : (
          <div className="space-y-8">
            <section className="space-y-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {burst?.platform && (
                      <span className="inline-flex items-center rounded-full bg-[#EEF2FF] px-3 py-1 text-sm font-medium text-[#2F0FD1]">
                        {burst.platform}
                      </span>
                    )}

                    {burst?.sentimentCheck && (
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#F8FAFC] px-4 py-2 text-sm text-[#525866]">
                        <BsInfoCircleFill className="text-[#2F0FD1]" />
                        <span>
                          Expected sentiment:{" "}
                          <span className={`font-semibold ${sentimentColor}`}>
                            {burst.sentimentCheck}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-2xl font-bold tracking-tight text-[#050215] lg:text-3xl">
                      {burst?.burstTitle || "Untitled Burst"}
                    </h1>

                    <p className="text-base leading-7 text-[#667085]">
                      {burst?.conversation ||
                        "No conversation details provided."}
                    </p>
                  </div>
                </div>

                <div className="w-full rounded-2xl border border-[#E5E7EB] bg-gradient-to-br from-[#F8FAFF] to-white p-5 shadow-sm xl:max-w-[320px]">
                  <p className="mb-2 text-sm text-[#667085]">Winning reward</p>
                  <div className="flex items-center gap-2">
                    <img src="/Gift.svg" alt="" className="h-5 w-5" />
                    <p className="text-2xl font-semibold text-[#2F0FD1]">
                      {burst?.tokensForWinner ?? 0} {burst?.symbol || ""}
                    </p>
                  </div>

                  {!isCreator && (
                    <p className="mt-3 text-sm leading-6 text-[#667085]">
                      Submit a relevant trend link and a strong post suggestion
                      to participate in this burst.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                  <StatCard
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    value={item.value}
                    accent={item.accent}
                    helperText={item.helperText}
                  />
                ))}
              </div>
            </section>

            {!isCreator && (
              <section className="rounded-2xl border border-[#D9E2FF] bg-[#FBFCFF] p-3 md:p-4">
                <Accordion type="single" collapsible defaultValue="post-entry">
                  <AccordionItem
                    value="post-entry"
                    className="overflow-hidden rounded-xl border-0"
                  >
                    <AccordionTrigger className="rounded-xl bg-[#2F0FD1] px-5 py-4 text-left text-white hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                          <PiMegaphoneFill className="text-[24px]" />
                        </div>

                        <div>
                          <p className="text-base font-semibold">
                            Submit your entry
                          </p>
                          <p className="text-sm text-white/80">
                            Post a trend link and suggest a matching post
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-2 pt-4 md:px-3">
                      <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[#09032A]">
                            1. Trend / Post URL
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#8791A7]">
                              <LinkIcon className="h-4 w-4" />
                            </div>
                            <CustomInput
                              placeholder="Paste post URL here"
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-[#E4E7EC]">
                          <div className="flex items-center justify-between px-4 py-3">
                            <div>
                              <p className="font-semibold text-[#09032A]">
                                2. Suggested Post
                              </p>
                              <p className="text-sm text-[#667085]">
                                Write a short, relevant, and engaging post
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleTask("suggest-post")}
                              className="rounded-lg p-1 text-[#344054] transition hover:bg-[#F2F4F7]"
                            >
                              {collapsedTasks["suggest-post"] ? (
                                <IoChevronDown className="text-[22px]" />
                              ) : (
                                <IoChevronUp className="text-[22px]" />
                              )}
                            </button>
                          </div>

                          {!collapsedTasks["suggest-post"] && (
                            <div className="space-y-4 border-t border-[#F2F4F7] bg-white p-4">
                              <Textarea
                                className="min-h-[140px] rounded-2xl border-[#E4E7EC] bg-[#F8FAFC] px-4 py-3 text-base placeholder:text-[#98A2B3] focus-visible:ring-0"
                                placeholder="Type your suggested post here..."
                              />

                              <div className="flex justify-end">
                                <Button
                                  onClick={() => {
                                    if (!requireAuth()) return;
                                  }}
                                  className="h-11 rounded-xl bg-[#2F0FD1] px-6 text-sm font-medium hover:bg-[#2409B8]"
                                >
                                  Submit Entry
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>
            )}

            {isCreator && (
              <section className="space-y-4 border-t border-[#EAECF0] pt-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#050215]">
                      Top Entries (5)
                    </h2>
                    <p className="text-base text-[#667085]">
                      Review the best submissions and select the winner.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-[#D0D5DD] bg-[#FCFCFD] p-8 text-center">
                  <p className="text-sm text-[#667085]">
                    Top entries UI can be upgraded next into cards with:
                    participant info, suggested post preview, source link,
                    score, and a “Select Winner” action.
                  </p>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BurstDetailsPage;
