import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function ProfitMargin() {
  return (
    <Card className="bg-white rounded-[24px] border-[#88918B4D] shadow-none lg:max-w-[441px] mt-[19px] lg:mt-0 lg:flex-1">
      <CardHeader>
        <CardTitle className="text-[12px] font-semibold text-[#88918B]">
          Profit Margin
        </CardTitle>
      </CardHeader>
      <CardContent className="px-[52px]  lg:px-[30px]">
        <div className="flex items-center justify-center h-48">
          <div className="relative">
            <svg className="size-40  transform  -rotate-x-180 ">
              <circle
                cx="64"
                cy="64"
                r="50"
                stroke="currentColor"
                strokeWidth="38"
                fill="transparent"
                className="text-[#14213D]"
              />
              <circle
                cx="64"
                cy="64"
                r="50"
                stroke="currentColor"
                strokeWidth="38"
                fill="transparent"
                strokeDasharray={`${66 * 3.51} ${100 * 3.51}`}
                className="text-[#37589F99] "
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 justify-around flex items-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#37589F99] rounded mr-2"></div>
              <span className="text-[12px] font-normal">Profit</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#14213D] rounded mr-2"></div>
              <span className="text-[12px] font-normal">Expenses</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfitMargin;
