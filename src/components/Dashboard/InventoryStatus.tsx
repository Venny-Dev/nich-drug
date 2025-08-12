import { useStockStatus } from "../../customHooks/useDashboards";
import LoaderSpinner from "../../ui/LoaderSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function InventoryStatus() {
  const { stockStatus, isGettingStockStatus } = useStockStatus();
  // console.log(stockStatus);

  // Calculate percentages and totals
  const totalStock = stockStatus
    ? stockStatus.in_stock + stockStatus.out + stockStatus.low
    : 0;
  const inStockPercent =
    totalStock > 0 ? Math.round((stockStatus.in_stock / totalStock) * 100) : 0;
  const outOfStockPercent =
    totalStock > 0 ? Math.round((stockStatus.out / totalStock) * 100) : 0;
  const lowStockPercent =
    totalStock > 0 ? Math.round((stockStatus.low / totalStock) * 100) : 0;

  // Calculate circumference for the circle (r=50)
  const circumference = 2 * Math.PI * 50;

  // Calculate stroke dash arrays for each segment
  const inStockDash = (inStockPercent / 100) * circumference;
  const lowStockDash = (lowStockPercent / 100) * circumference;
  const outOfStockDash = (outOfStockPercent / 100) * circumference;

  return (
    <Card className="bg-white rounded-[24px] border-[#88918B4D] shadow-none lg:max-w-[441px]  lg:min-w-[241px]">
      <CardHeader>
        <CardTitle className="text-[12px] font-semibold text-[#88918B]">
          Inventory Status
        </CardTitle>
      </CardHeader>
      <CardContent className="px-[52px] lg:flex items-center lg:px-[30px]">
        {isGettingStockStatus && (
          <div className="flex items-center justify-center mt-5">
            <LoaderSpinner className="w-[50px]" />
          </div>
        )}

        {!isGettingStockStatus && stockStatus && (
          <>
            <div className="flex items-center justify-center h-48">
              <div className="relative">
                <svg className="size-40 transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="64"
                    cy="64"
                    r="50"
                    stroke="#f3f4f6"
                    strokeWidth="38"
                    fill="transparent"
                  />

                  {/* Out of Stock segment */}
                  <circle
                    cx="64"
                    cy="64"
                    r="50"
                    stroke="#EF4444"
                    strokeWidth="38"
                    fill="transparent"
                    strokeDasharray={`${outOfStockDash} ${circumference}`}
                    strokeDashoffset="0"
                    className="transition-all duration-300"
                  />

                  {/* Low Stock segment */}
                  <circle
                    cx="64"
                    cy="64"
                    r="50"
                    stroke="#FF8C00"
                    strokeWidth="38"
                    fill="transparent"
                    strokeDasharray={`${lowStockDash} ${circumference}`}
                    strokeDashoffset={`-${outOfStockDash}`}
                    className="transition-all duration-300"
                  />

                  {/* In Stock segment */}
                  <circle
                    cx="64"
                    cy="64"
                    r="50"
                    stroke="#22C55E"
                    strokeWidth="38"
                    fill="transparent"
                    strokeDasharray={`${inStockDash} ${circumference}`}
                    strokeDashoffset={`-${outOfStockDash + lowStockDash}`}
                    className="transition-all duration-300"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#22C55E] rounded-full mr-2"></div>
                  <span className="text-[12px] font-normal">In Stock</span>
                </div>
                <span className="text-[12px] font-normal">
                  {inStockPercent}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#FF8C00] rounded-full mr-2"></div>
                  <span className="text-[12px] font-normal">Low Stock</span>
                </div>
                <span className="text-[12px] font-normal">
                  {lowStockPercent}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#EF4444] rounded-full mr-2"></div>
                  <span className="text-[12px] font-normal">Out of Stock</span>
                </div>
                <span className="text-[12px] font-normal lg:ml-2">
                  {outOfStockPercent}%
                </span>
              </div>
            </div>
          </>
        )}

        {!isGettingStockStatus && !stockStatus && (
          <div className="flex items-center justify-center mt-5">
            <p className="text-[12px] text-[#88918B]">
              No stock data available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default InventoryStatus;
