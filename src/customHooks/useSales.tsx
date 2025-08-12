import { useQuery } from "@tanstack/react-query";
import { getProfit, getSalesReport, getTotalSales } from "../api/apiService";
import { useShopContext } from "../contexts/ShopContext";
import indexedDBManager from "../utils/indexedDB";
import { useUser } from "./useUser";

export function useTotalSales() {
  const { activeShop } = useShopContext();
  const shopId = activeShop?.id || "";

  const { data, isLoading: gettingTotalSales } = useQuery({
    queryKey: ["total-sales", shopId],
    queryFn: async () => {
      try {
        const response = await getTotalSales(shopId);
        // console.log("API Response:", response);

        if (response && response.data) {
          // Save to IndexedDB for offline access
          await indexedDBManager.saveOrdersDb(
            activeShop?.id || "",
            response.data
          );
        }

        return response.data; // Return the actual data
      } catch (err) {
        console.warn("API failed, loading sales from IndexedDB:", err);

        try {
          // Always try to load from IndexedDB when API fails

          const cachedSales = await indexedDBManager.getOrdersDb(
            activeShop?.id || ""
          );
          if (cachedSales && cachedSales.length > 0) {
            return cachedSales; // Return cached data directly
          }
        } catch (err) {
          // 1. Return empty array
          return [];
        }

        // If no cached data, you can either:
      }
    },
    enabled: !!shopId,
  });

  // console.log("Hook data:", data);
  return {
    totalSales: !shopId ? [] : data,
    gettingTotalSales,
  };
}

export function useSalesReport() {
  const { activeShop } = useShopContext();
  const id = activeShop?.id || "";

  const { data: salesReport, isLoading: isGettingSalesReport } = useQuery({
    queryKey: ["sales-report"],
    queryFn: () => getSalesReport(id),
  });

  return { salesReport, isGettingSalesReport };
}

export function useGetProfit(from: string, to: string) {
  const { user } = useUser();
  const { activeShop } = useShopContext();
  const id = activeShop?.id || "";
  const { data, isLoading: isGettingProfit } = useQuery({
    queryKey: ["profit", from, to],
    queryFn: () => getProfit({ id, from, to }),
    enabled: user.role !== "cashier" && !!id,
  });
  return { profit: data?.data, isGettingProfit };
}
