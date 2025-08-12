import SalesSummary from "../components/TotalSales/SalesSummary";
import SalesFilter from "../components/TotalSales/SalesFilter";
import SalesContainer from "../components/TotalSales/SalesContainer";
import { useGetProfit, useTotalSales } from "../customHooks/useSales";
import LoaderPage from "../ui/LoaderPage";
import { useEffect, useMemo, useState } from "react";
import indexedDBManager from "../utils/indexedDB";
import { useShopContext } from "../contexts/ShopContext";
import {
  capitalizeFirst,
  getDateRangeForProfit,
  // getFormattedDateRange,
  transformOfflineOrdersToSalesFormat,
} from "../utils/helpers";
import type { DateFilterOption, OnlineSale } from "../utils/types";
import { useSyncOrders } from "../customHooks/useOrders";
// import _ from "lodash";
import { chain } from "lodash-es";
import { useUser } from "../customHooks/useUser";
import { dateFilterOptions } from "../utils/data";

// type DateOption = string | number;

function TotalSales() {
  const { totalSales, gettingTotalSales } = useTotalSales();
  const { activeShop } = useShopContext();
  const { syncOrders, isSyncing } = useSyncOrders();
  const { user } = useUser();

  const [allSales, setAllSales] = useState<OnlineSale[]>();

  const [option, setOption] = useState<DateFilterOption>(1);
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });
  const [paymentMethod, setPaymentMethod] = useState<string>("all");
  const [selectedCashier, setSelectedCashier] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { from, to } = useMemo(() => {
    return getDateRangeForProfit(option, customDateRange);
  }, [option, customDateRange, isDialogOpen]);
  // console.log(from, to);

  const { profit, isGettingProfit } = useGetProfit(from, to);
  // console.log(profit);

  useEffect(() => {
    console.log("🔍 TotalSales Debug Info:", {
      totalSales: totalSales?.length || "undefined",
      gettingTotalSales,
      activeShopId: activeShop?.id,
      userName: user?.name,
      userRole: user?.role,
      isSyncing,
    });
  }, [totalSales, gettingTotalSales, activeShop, user, isSyncing]);

  // useEffect(() => {
  //   async function getData() {
  //     const cachedSales = await indexedDBManager.getShopOrders(
  //       activeShop?.id || ""
  //     );

  //     // console.log(cachedSales);
  //     // If we're online, and there is cached sales, sync the sales
  //     if (navigator.onLine && cachedSales && cachedSales.length > 0) {
  //       console.log("🟢 Online mode detected, syncing sales...");
  //       const data = { shop_id: activeShop?.id, orders: cachedSales };

  //       syncOrders(data, {
  //         onSuccess: async () => {
  //           await indexedDBManager.deleteShopOrders(activeShop?.id || "");
  //         },
  //       });
  //     }

  //     // If we're offline, and there is cached sales, set the sales
  //     if (!gettingTotalSales && cachedSales && cachedSales.length > 0) {
  //       const transformedData = transformOfflineOrdersToSalesFormat(
  //         cachedSales,
  //         user.name
  //       );

  //       if (totalSales?.length) {
  //         setAllSales([...totalSales, ...transformedData]);
  //         return;
  //       }
  //       if (!totalSales) {
  //         setAllSales(transformedData);
  //       }
  //       // console.log(transformedData);
  //       return;
  //     }

  //     // If we're offline, and there is no cached sales, set the sales
  //     if (!gettingTotalSales && !cachedSales.length && totalSales) {
  //       // console.log("running");
  //       setAllSales([...totalSales]);
  //       return;
  //     }
  //   }

  //   getData();
  // }, [gettingTotalSales, totalSales]);

  useEffect(() => {
    async function getData() {
      try {
        console.log("📊 Starting getData with:", {
          activeShopId: activeShop?.id,
          isOnline: navigator.onLine,
          gettingTotalSales,
        });

        const cachedSales = await indexedDBManager.getShopOrders(
          activeShop?.id || ""
        );

        console.log("💾 Cached sales:", {
          count: cachedSales?.length || 0,
          sample: cachedSales?.[0],
        });

        // Online sync logic
        if (navigator.onLine && cachedSales && cachedSales.length > 0) {
          console.log("🟢 Online mode detected, syncing sales...");
          const data = { shop_id: activeShop?.id, orders: cachedSales };

          syncOrders(data, {
            onSuccess: async () => {
              console.log("✅ Sync successful, deleting cached orders");
              await indexedDBManager.deleteShopOrders(activeShop?.id || "");
            },
            onError: (error: any) => {
              console.error("❌ Sync failed:", error);
            },
          });
        }

        // Offline data handling
        if (!gettingTotalSales && cachedSales && cachedSales.length > 0) {
          console.log("🔄 Processing offline data");
          const transformedData = transformOfflineOrdersToSalesFormat(
            cachedSales,
            user.name
          );

          console.log("🔀 Transformed data:", {
            count: transformedData?.length || 0,
            sample: transformedData?.[0],
          });

          if (totalSales?.length) {
            console.log("📈 Merging with existing total sales");
            setAllSales([...totalSales, ...transformedData]);
            return;
          }
          if (!totalSales) {
            console.log("📋 Setting transformed data only");
            setAllSales(transformedData);
          }
          return;
        }

        // Regular online data
        if (
          !gettingTotalSales &&
          (!cachedSales || cachedSales.length === 0) &&
          totalSales
        ) {
          console.log("🌐 Setting online total sales data");
          setAllSales([...totalSales]);
          return;
        }

        console.log("⏳ Waiting for data to load...");
      } catch (error) {
        console.error("🚨 Error in getData:", error);
        // Log the full error details
        console.error("Error details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : "No stack trace",
          name: error instanceof Error ? error.name : "Unknown",
        });
      }
    }

    getData();
  }, [gettingTotalSales, totalSales]);

  if (gettingTotalSales || isSyncing) {
    return <LoaderPage />;
  }

  console.log("📊 Processing sales data:", {
    allSalesCount: allSales?.length || 0,
    option,
    paymentMethod,
    selectedCashier,
    customDateRange,
  });
  // console.log(totalSales);

  let groupedOrders: any[] = [];
  try {
    groupedOrders = chain(allSales)
      .filter((sale) => {
        const saleDate = new Date(sale.date);
        if (isNaN(saleDate.getTime())) {
          console.warn("Invalid date:", sale.date);
          return false; // or handle appropriately
        }

        // Date filtering

        if (option === "custom") {
          if (!customDateRange.from || !customDateRange.to) return true;

          const fromDate = new Date(customDateRange.from);
          const toDate = new Date(customDateRange.to);

          // Normalize dates to compare just the date part (ignore time)
          const isSameDay = fromDate.toDateString() === toDate.toDateString();
          if (isSameDay) {
            // If same day, check if sale date matches that specific day
            const saleDateString = saleDate.toDateString();
            const targetDateString = fromDate.toDateString();

            if (saleDateString !== targetDateString) return false;
          } else {
            // If different dates, use range filtering
            // Set time boundaries for more accurate filtering
            const fromDateStart = new Date(fromDate);
            fromDateStart.setHours(0, 0, 0, 0); // Start of from date

            const toDateEnd = new Date(toDate);
            toDateEnd.setHours(23, 59, 59, 999); // End of to date

            if (saleDate < fromDateStart || saleDate > toDateEnd) return false;
          }
        } else if (typeof option === "number") {
          if (option === 2) {
            // For option 2 - filter for yesterday only
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            // Set time boundaries for yesterday
            const startOfYesterday = new Date(yesterday);
            startOfYesterday.setHours(0, 0, 0, 0);

            const endOfYesterday = new Date(yesterday);
            endOfYesterday.setHours(23, 59, 59, 999);

            // Check if sale date falls within yesterday only
            if (saleDate < startOfYesterday || saleDate > endOfYesterday) {
              return false;
            }
          } else if (option !== 60) {
            // For options 1, 7, 30 - filter by days ago
            const cutoffDate = new Date();
            // console.log("running");
            cutoffDate.setDate(cutoffDate.getDate() - option);
            if (saleDate < cutoffDate) return false;
          } else if (option === 60) {
            const today = new Date();
            // For option 60 - filter by previous calendar month
            const lastMonth = new Date(
              today.getFullYear(),
              today.getMonth() - 1,
              1
            );
            const lastDayOfLastMonth = new Date(
              today.getFullYear(),
              today.getMonth(),
              0
            );

            // Check if sale date falls within the previous month
            if (saleDate < lastMonth || saleDate > lastDayOfLastMonth) {
              return false;
            }
          }
        }

        // Payment method filtering
        if (paymentMethod !== "all") {
          const salePaymentType = sale.payment_type.toLowerCase();
          if (salePaymentType !== paymentMethod) return false;
        }

        // Cashier filtering
        if (user.role == "cashier" && sale.cashier_name !== user.name)
          return false;

        if (selectedCashier !== "all") {
          if (sale.cashier_name !== selectedCashier) return false;
        }

        return true;
      })
      .groupBy("order_id")
      .map((orderItems, orderId) => {
        // console.log(orderItems, orderId);
        const firstItem = orderItems[0];
        const totalAmount = orderItems.reduce((sum, item) => {
          const amount = parseFloat(item.amount);
          const quantity = parseFloat(item.quantity) || 1;
          return sum + amount * quantity;
        }, 0);

        const itemsSold = orderItems
          .map((item) => `${capitalizeFirst(item.item_name)} X${item.quantity}`)
          .join(", ");

        return {
          id: `TRX${orderId.padStart(3, "0")}`,
          date: firstItem.date,
          paymentType: capitalizeFirst(firstItem.payment_type),
          totalAmount: totalAmount,
          itemsSold: itemsSold,
          paymentStatus: firstItem.payment_status || "paid",
        };
      })
      .orderBy(["date"], ["desc"])
      .value();
  } catch (error) {
    console.error("Error processing sales data:", error);
  }

  // console.log(groupedOrders);
  const numOfTransactions = groupedOrders.length;
  const totalSalesAmount = groupedOrders.reduce(
    (total, order) => total + order.totalAmount,
    0
  );
  const cashPayment = groupedOrders
    .filter((order) => order.paymentType === "Cash")
    .reduce((total, order) => total + order.totalAmount, 0);
  const cardPayment = groupedOrders
    .filter((order) => order.paymentType === "Card")
    .reduce((total, order) => total + order.totalAmount, 0);
  const transferPayment = groupedOrders
    .filter((order) => order.paymentType === "Transfer")
    .reduce((total, order) => total + order.totalAmount, 0);

  // console.log(numOfTransactions, totalSalesAmount);

  const summaryData = {
    numOfTransactions,
    totalSalesAmount,
    cashPayment,
    cardPayment,
    transferPayment,
    profit: profit?.profit,
  };

  // console.log(allSales);

  return (
    <div className="p-6">
      <SalesFilter
        options={dateFilterOptions}
        setOption={setOption}
        option={option}
        customDateRange={customDateRange}
        setCustomDateRange={setCustomDateRange}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        selectedCashier={selectedCashier}
        setSelectedCashier={setSelectedCashier}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
      {user.role !== "cashier" && (
        <SalesSummary
          summaryData={summaryData}
          isGettingProfit={isGettingProfit}
        />
      )}
      <SalesContainer salesData={groupedOrders} allSalesData={allSales} />
    </div>
  );
}

export default TotalSales;
