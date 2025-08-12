import { useSalesStats } from "../../customHooks/useDashboards";
import LoaderSpinner from "../../ui/LoaderSpinner";
import { formatCurrency } from "../../utils/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function SalesMetrics() {
  const { salesStats, isGettingSalesStats } = useSalesStats();

  // console.log(salesStats);

  return (
    <div className="md:grid md:grid-cols-3 lg:grid-cols-1  gap-3 mb-8 hidden lg:flex-1 lg:max-w-[272px] lg:mb-0">
      <Card className=" bg-white rounded-[24px] border-none lg:gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Daily Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isGettingSalesStats && (
            <div>
              <LoaderSpinner className="w-[10px]" />
            </div>
          )}
          {!isGettingSalesStats && (
            <div className="text-2xl font-bold lg:text-[16px]">
              {formatCurrency(salesStats.today)}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className=" bg-white rounded-[24px] border-none lg:gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Weekly Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isGettingSalesStats && (
            <div>
              <LoaderSpinner className="w-[10px]" />
            </div>
          )}
          {!isGettingSalesStats && (
            <div className="text-2xl font-bold lg:text-[16px]">
              {formatCurrency(Number(salesStats.week))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className=" bg-white rounded-[24px] border-none lg:gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Monthly Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isGettingSalesStats && (
            <div>
              <LoaderSpinner className="w-[10px]" />
            </div>
          )}
          {!isGettingSalesStats && (
            <div className="text-2xl font-bold lg:text-[16px]">
              {formatCurrency(Number(salesStats.month))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className=" bg-white rounded-[24px] border-none lg:gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Yearly Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isGettingSalesStats && (
            <div>
              <LoaderSpinner className="w-[10px]" />
            </div>
          )}
          {!isGettingSalesStats && (
            <div className="text-2xl font-bold lg:text-[16px]">
              {formatCurrency(Number(salesStats.year))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SalesMetrics;
