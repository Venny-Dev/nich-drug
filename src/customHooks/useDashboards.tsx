import { useQuery } from "@tanstack/react-query";
import {
  getRecentTransactions,
  getRevenueChart,
  getSalesStat,
  getStockStatus,
  getTopSellingProducts,
} from "../api/apiService";
import { useShopContext } from "../contexts/ShopContext";

export function useRecentTransactions() {
  const { activeShop } = useShopContext();
  const { data, isLoading: isGettingRecentTransactions } = useQuery({
    queryKey: ["recentTransactions", activeShop?.id],
    queryFn: () => getRecentTransactions(activeShop?.id || ""),
    enabled: !!activeShop,
  });

  return {
    recentTransactions: data?.data || [],
    isGettingRecentTransactions,
  };
}

export function useTopSellingProducts() {
  const { activeShop } = useShopContext();
  const { data, isLoading: isGettingTopSellingProducts } = useQuery({
    queryKey: ["topSellingProducts", activeShop?.id],
    queryFn: () => getTopSellingProducts(activeShop?.id || ""),
    enabled: !!activeShop,
  });

  return {
    topSellingProducts: data?.data || [],
    isGettingTopSellingProducts,
  };
}

export function useStockStatus() {
  const { activeShop } = useShopContext();
  const { data, isLoading: isGettingStockStatus } = useQuery({
    queryKey: ["stockStatus", activeShop?.id],
    queryFn: () => getStockStatus(activeShop?.id || ""),
    enabled: !!activeShop,
  });
  return {
    stockStatus: data?.data || [],
    isGettingStockStatus,
  };
}

export function useSalesStats() {
  const { activeShop } = useShopContext();
  const { data, isLoading: isGettingSalesStats } = useQuery({
    queryKey: ["salesStats", activeShop?.id],
    queryFn: () => getSalesStat(activeShop?.id || ""),
    enabled: !!activeShop,
  });
  return {
    salesStats: data?.data || [],
    isGettingSalesStats,
  };
}

export function useGrowthRevenue() {
  const { activeShop } = useShopContext();
  const { data, isLoading: isGettingGrowthRevenue } = useQuery({
    queryKey: ["growthRevenue", activeShop?.id],
    queryFn: () => getRevenueChart(activeShop?.id || ""),
    enabled: !!activeShop,
  });
  return {
    growthRevenue: data?.data || [],
    isGettingGrowthRevenue,
  };
}
