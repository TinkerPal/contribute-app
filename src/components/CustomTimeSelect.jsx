import { Label } from "./ui/label";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const generateTimeOptions = () => {
  const times = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0");
    times.push(`${hour}:00`);
    times.push(`${hour}:30`);
  }
  return times;
};

const TIMES = generateTimeOptions();

export default function CustomTimeSelect({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  startTimeError,
  endTimeError,
}) {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const isValidEndTime = (start, end) => {
    if (!start || !end) return true;

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    return endMinutes > startMinutes && endMinutes - startMinutes <= 1440; // max 24h
  };

  return (
    <Label className="flex min-w-0 flex-col gap-2 font-light text-[#09032A]">
      <div className="flex w-full flex-col gap-4 sm:flex-row">
        {/* START TIME */}
        <div className="flex flex-1 flex-col gap-1">
          <Popover open={openStart} onOpenChange={setOpenStart}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-[48px] w-full justify-between bg-[#F7F9FD] text-[#8791A7] hover:bg-[#F7F9FD] hover:text-[#8791A7]"
              >
                {startTime || "Start Time"}
                <IoMdArrowDropdown className="size-6 text-[#B2B9C7]" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="max-h-60 overflow-y-auto p-0">
              <div className="flex flex-col">
                {TIMES.map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      onStartTimeChange(time);
                      setOpenStart(false);
                    }}
                    className="px-4 py-2 text-left hover:bg-gray-100"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {startTimeError && (
            <span className="text-xs text-red-500">{startTimeError}</span>
          )}
        </div>

        {/* END TIME */}
        <div className="flex flex-1 flex-col gap-1">
          <Popover open={openEnd} onOpenChange={setOpenEnd}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-[48px] w-full justify-between bg-[#F7F9FD] text-[#8791A7] hover:bg-[#F7F9FD] hover:text-[#8791A7]"
              >
                {endTime || "End Time"}
                <IoMdArrowDropdown className="size-6 text-[#B2B9C7]" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="max-h-60 overflow-y-auto p-0">
              <div className="flex flex-col">
                {TIMES.map((time) => {
                  const disabled =
                    startTime && !isValidEndTime(startTime, time);

                  return (
                    <button
                      key={time}
                      disabled={disabled}
                      onClick={() => {
                        onEndTimeChange(time);
                        setOpenEnd(false);
                      }}
                      className={`px-4 py-2 text-left ${
                        disabled
                          ? "cursor-not-allowed text-gray-400"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {endTimeError && (
            <span className="text-xs text-red-500">{endTimeError}</span>
          )}
        </div>
      </div>
    </Label>
  );
}
