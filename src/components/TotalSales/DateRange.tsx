import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { formatDateDayFirst } from "../../utils/helpers";
import { useState, useEffect } from "react";

interface DateRangeProps {
  setIsDialogOpen: (value: boolean) => void;
  customDateRange: {
    from: Date | null;
    to: Date | null;
  };
  setCustomDateRange: (range: {
    from: Date | null;
    to: Date | null;
  }) => void;
}

function DateRange({ setIsDialogOpen, customDateRange, setCustomDateRange }: DateRangeProps) {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(customDateRange.from || undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(customDateRange.to || undefined);

  // Update local state when customDateRange changes
  useEffect(() => {
    setStartDate(customDateRange.from || undefined);
    setEndDate(customDateRange.to || undefined);
  }, [customDateRange]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <Label htmlFor="date" className="px-1 w-fit">
          Start Date
        </Label>
        <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className=" justify-between font-normal"
            >
              {startDate ? formatDateDayFirst(startDate) : "Start date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              className="w-[250px]"
              selected={startDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                setStartDate(date);
                setIsStartOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="date" className="px-1 w-fit">
          End Date
        </Label>
        <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className=" justify-between font-normal"
            >
              {endDate ? formatDateDayFirst(endDate) : "End date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              className="w-[250px]"
              selected={endDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                setEndDate(date);
                setIsEndOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex w-full justify-between gap-4">
        <button
          className="bg-[#E5E5E54D] py-[11px] flex-1 rounded-[8px]"
          onClick={() => setIsDialogOpen(false)}
        >
          Cancel
        </button>
        <button 
          className="flex-1 bg-[#37589F99] rounded-[8px] text-white"
          onClick={() => {
            setCustomDateRange({
              from: startDate || null,
              to: endDate || null,
            });
            setIsDialogOpen(false);
          }}
        >
          Apply
        </button>
      </div>
    </>
  );
}

export default DateRange;
