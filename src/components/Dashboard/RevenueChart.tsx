import { useGrowthRevenue } from "../../customHooks/useDashboards";
import LoaderSpinner from "../../ui/LoaderSpinner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "../../utils/helpers";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function RevenueChart() {
  const { growthRevenue, isGettingGrowthRevenue } = useGrowthRevenue();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "weekly" | "monthly" | "yearly"
  >("yearly");
  const [isOpen, setIsOpen] = useState(false);

  // console.log(growthRevenue);

  const periodOptions = [
    { value: "weekly", label: "Week" },
    { value: "monthly", label: "Month" },
    { value: "yearly", label: "Year" },
  ];

  // Transform the data for recharts
  const transformDataForChart = (data: any, period: string) => {
    if (!data || !data[period]) return [];

    const { data: values, labels } = data[period];
    return labels.map((label: string, index: number) => ({
      name: label,
      value: Number(values[index]) || 0,
    }));
  };

  const chartData = transformDataForChart(growthRevenue, selectedPeriod);
  const currentPeriod = periodOptions.find((p) => p.value === selectedPeriod);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="text-[12px] font-medium text-gray-600">{label}</p>
          <p className="text-[14px] font-bold text-[#37589F]">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white rounded-[24px] border-[#88918B4D] shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#88918B] font-semibold text-[12px]">
          Revenue
        </CardTitle>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              className="bg-[#E5E5E5] text-[12px] font-semibold text-[#88918B] flex items-center gap-1"
              size="sm"
            >
              {currentPeriod?.label}
              <ChevronDownIcon className="w-3 h-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-24 p-1">
            <div className="flex flex-col">
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedPeriod(
                      option.value as "weekly" | "monthly" | "yearly"
                    );
                    setIsOpen(false);
                  }}
                  className={`text-left px-2 py-1 text-[12px] rounded  ${
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
      <CardContent className="overflow-x-auto">
        {isGettingGrowthRevenue && (
          <div className="flex items-center justify-center">
            <LoaderSpinner className="w-[50px]" />
          </div>
        )}
        {!isGettingGrowthRevenue && (
          <div className="min-w-[500px] lg:min-w-0 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#88918B" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#88918B" }}
                  tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#37589F"
                  strokeWidth={2}
                  dot={{ fill: "#37589F", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#37589F" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RevenueChart;
