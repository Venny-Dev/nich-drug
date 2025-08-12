import LoaderSpinner from "../../ui/LoaderSpinner";
import { formatCurrency } from "../../utils/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// import Spinner from "../ui/Spinner";
interface SalesSummaryProps {
  summaryData: any;
  isGettingProfit: boolean;
}

function SalesSummary({ summaryData, isGettingProfit }: SalesSummaryProps) {
  return (
    <div className="mt-6">
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <Card className=" bg-white rounded-[24px] border-none gap-0 w-full">
          <CardHeader className="">
            <CardTitle className="text-sm font-medium text-gray-600 lg:text-[16px] lg:font-normal">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold lg:text-[32px]">
              {formatCurrency(summaryData.totalSalesAmount)}
            </div>
          </CardContent>
        </Card>

        <Card className=" bg-white rounded-[24px] border-none gap-0 w-full">
          <CardHeader className="">
            <CardTitle className="text-sm font-medium text-gray-600 lg:text-[16px] lg:font-normal">
              Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isGettingProfit && (
              <div className="mt-4">
                <LoaderSpinner className="w-[10px]" />
              </div>
            )}
            {!isGettingProfit && (
              <div className="text-2xl font-bold lg:text-[32px]">
                {formatCurrency(summaryData.profit)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className=" bg-white rounded-[24px] border-none gap-0 w-full">
          <CardHeader className="">
            <CardTitle className="text-sm font-medium text-gray-600 lg:text-[16px] lg:font-normal">
              Number of Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold lg:text-[32px]">
              {summaryData.numOfTransactions}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-[19px] space-y-[9px] md:space-y-0 md:grid md:grid-cols-3 md:items-center md:gap-[10px]">
        <Card className=" bg-white rounded-[24px] border-none gap-0">
          <CardHeader className="">
            <CardTitle className="text-sm font-medium text-gray-600 lg:text-[16px] lg:font-normal">
              Cash Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold lg:text-[32px]">
              {formatCurrency(summaryData.cashPayment)}
            </div>
          </CardContent>
        </Card>

        <Card className=" bg-white rounded-[24px] border-none gap-0">
          <CardHeader className="">
            <CardTitle className="text-sm font-medium text-gray-600 lg:text-[16px] lg:font-normal">
              Card Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold lg:text-[32px]">
              {formatCurrency(summaryData.cardPayment)}
            </div>
          </CardContent>
        </Card>

        <Card className=" bg-white rounded-[24px] border-none gap-0">
          <CardHeader className="">
            <CardTitle className="text-sm font-medium text-gray-600 lg:text-[16px] lg:font-normal">
              Transfers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold lg:text-[32px]">
              {formatCurrency(summaryData.transferPayment)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SalesSummary;
