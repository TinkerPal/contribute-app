import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { LuSlidersVertical } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function Filter({
  tag,
  value,
  onChange,
  options = [],
  placeholder = "Filter",
}) {
  const [open, setOpen] = React.useState(false);

  const activeOption = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className={cn(
            "group h-11 min-w-[170px] justify-between rounded-xl border shadow-sm",
            tag === "landing"
              ? "border-[#2F0FD1] bg-[#2F0FD1] hover:bg-[#1F0AA6]"
              : "border-[#EAECF5] bg-white hover:bg-[#F9FAFB]",
          )}
        >
          <span className="flex items-center gap-2">
            <LuSlidersVertical
              className={cn(
                "text-[18px]",
                tag === "landing" ? "text-white" : "text-[#2F0FD1]",
              )}
            />
            <span
              className={cn(
                "text-sm font-medium",
                tag === "landing" ? "text-white" : "text-[#344054]",
              )}
            >
              {activeOption?.label || placeholder}
            </span>
          </span>

          <ChevronDown
            className={cn(
              "h-4 w-4",
              tag === "landing" ? "text-white" : "text-[#667085]",
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[240px] rounded-xl border border-[#EAECF5] p-2 shadow-lg">
        <Command>
          <CommandList>
            <CommandEmpty>No filter found.</CommandEmpty>

            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer rounded-lg"
                  onSelect={(selectedValue) => {
                    const nextValue =
                      selectedValue === value ? "all" : selectedValue;
                    onChange?.(nextValue);
                    setOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default Filter;
