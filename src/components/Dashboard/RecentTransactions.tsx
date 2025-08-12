import { useRecentTransactions } from "../../customHooks/useDashboards";
import EmptyData from "../../ui/EmptyData";
import LoaderSpinner from "../../ui/LoaderSpinner";
import { formatCurrency } from "../../utils/helpers";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Transaction {
  id: string;
  cashier_name: string;
  date: string;
  amount: string;
}

function RecentTransactions() {
  const { recentTransactions, isGettingRecentTransactions } =
    useRecentTransactions();

  return (
    <Card className="bg-white rounded-[24px] border-[#88918B4D] shadow-none lg:flex-1">
      <CardHeader className="flex flex-row items-center justify-between ">
        <CardTitle className="font-semibold text-[12px] text-[#88918B]">
          Recent Transactions
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#37589F99] text-[12px] font-semibold"
        >
          view all
        </Button>
      </CardHeader>
      <CardContent className="px-4">
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 bord pb-2">
            <div>ID</div>
            <div>Cashier</div>
            <div>Date</div>
            <div>Amount</div>
          </div>
          {isGettingRecentTransactions && (
            <div className="flex items-center justify-center py-4 mt-5">
              <LoaderSpinner className="w-[50px]" />
            </div>
          )}

          {!isGettingRecentTransactions && recentTransactions.length === 0 && (
            <EmptyData text="No recent transactions found" />
          )}

          {!isGettingRecentTransactions &&
            recentTransactions.length > 0 &&
            recentTransactions
              .slice(0, 5)
              .map((transaction: Transaction, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4  font-normal text-[12px]/[20px] bg-[#E5E5E51A] items-center rounded-[8px] px-[5px] lg:text-[16px] lg:py-3"
                >
                  <div className="">{`TRX${transaction.id}`}</div>
                  <div>{transaction.cashier_name}</div>
                  <div className="text-gray-600">{transaction.date}</div>
                  <div className="">
                    {formatCurrency(Number(transaction.amount))}
                  </div>
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentTransactions;
