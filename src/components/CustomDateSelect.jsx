import { Label } from "./ui/label";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";

export default function CustomDateSelect({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  runContinuously,
  startDateError,
  endDateError,
}) {
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  return (
    <Label className="flex flex-col items-start gap-2 font-light text-[#09032A]">
      <div className="relative flex min-h-[48px] w-full flex-col gap-5 rounded-[12px] sm:flex-row">
        <div
          className={`flex h-full w-full flex-col gap-1 ${runContinuously ? "sm:w-full" : "sm:w-[48%]"}`}
        >
          <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className={`h-[48px] w-full justify-between bg-[#F7F9FD] font-normal text-[#8791A7] shadow-none hover:bg-[#F7F9FD] hover:text-[#8791A7]`}
              >
                {startDate ? startDate.toLocaleDateString() : "Start Date"}
                <IoMdArrowDropdown className="size-6 text-[#B2B9C7]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={startDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  onStartDateChange(date);
                  setOpenStartDate(false);
                }}
              />
            </PopoverContent>
          </Popover>

          {startDateError && (
            <span className="text-xs text-red-500">{startDateError}</span>
          )}
        </div>

        {!runContinuously && (
          <div className="flex h-full w-full flex-col gap-1 sm:w-[48%]">
            <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="h-[48px] w-full justify-between bg-[#F7F9FD] font-normal text-[#8791A7] shadow-none hover:bg-[#F7F9FD] hover:text-[#8791A7]"
                >
                  {endDate ? endDate.toLocaleDateString() : "End Date"}
                  <IoMdArrowDropdown className="size-6 text-[#B2B9C7]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={endDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    onEndDateChange(date);
                    setOpenEndDate(false);
                  }}
                />
              </PopoverContent>
            </Popover>

            {endDateError && (
              <span className="text-xs text-red-500">{endDateError}</span>
            )}
          </div>
        )}
      </div>
    </Label>
  );
}
