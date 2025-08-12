import { useSalesStats } from "../../customHooks/useDashboards";
import LoaderSpinner from "../../ui/LoaderSpinner";
import { formatCurrency } from "../../utils/helpers";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

function SalesMetricsMobile() {
  const { salesStats, isGettingSalesStats } = useSalesStats();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "today" | "week" | "month" | "year"
  >("today");
  const [isOpen, setIsOpen] = useState(false);

  const periodOptions = [
    { value: "today", label: "Daily", dataKey: "today" },
    { value: "week", label: "Weekly", dataKey: "week" },
    { value: "month", label: "Monthly", dataKey: "month" },
    { value: "year", label: "Yearly", dataKey: "year" },
  ];

  const currentPeriod = periodOptions.find((p) => p.value === selectedPeriod);
  const currentValue =
    salesStats && currentPeriod
      ? salesStats[currentPeriod.dataKey as keyof typeof salesStats]
      : 0;

  return (
    <div className="mb-8 bg-white rounded-[24px] md:hidden">
      <Card className="border-none shadow-none gap-2 py-4">
        <CardHeader className="flex  items-center justify-between   ">
          <CardTitle className="text-sm  text-gray-600 font-normal">
            Sales
          </CardTitle>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button className="bg-[#E5E5E5] shadow-none text-[#88918B] font-semibold text-[12px] flex items-center gap-1">
                {currentPeriod?.label}
                <ChevronDownIcon className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-32 p-1">
              <div className="flex flex-col">
                {periodOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedPeriod(
                        option.value as "today" | "week" | "month" | "year"
                      );
                      setIsOpen(false);
                    }}
                    className={`text-left px-2 py-1 text-[12px] rounded hover:bg-gray-100 ${
                      selectedPeriod === option.value
                        ? "bg-[#E5E5E5] text-[#88918B]"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent>
          {isGettingSalesStats && (
            <div>
              <LoaderSpinner className="w-[10px]" />
            </div>
          )}
          {!isGettingSalesStats && (
            <div className="text-2xl font-bold lg:text-[16px]">
              {formatCurrency(Number(currentValue))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SalesMetricsMobile;
