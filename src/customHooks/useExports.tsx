import { useMutation } from "@tanstack/react-query";
import { handleExportDownload } from "../utils/helpers";
import { useShopContext } from "../contexts/ShopContext";

export function useExportShops() {
  const { mutate: exportShops, isPending: isExportingShops } = useMutation({
    mutationFn: () => handleExportDownload("shops"),
  });

  return { exportShops, isExportingShops };
}

export function useExportProducts() {
  const { activeShop } = useShopContext();
  const { mutate: exportProducts, isPending: isExportingProducts } =
    useMutation({
      mutationFn: () => handleExportDownload(`${activeShop?.id}/products`),
    });

  return { exportProducts, isExportingProducts };
}

export function useExportCategories() {
  const { activeShop } = useShopContext();

  const { mutate: exportCategories, isPending: isExportingCategories } =
    useMutation({
      mutationFn: () => handleExportDownload(`${activeShop?.id}/categories`),
    });

  return { exportCategories, isExportingCategories };
}

export function useExportUsers() {
  const { activeShop } = useShopContext();

  const { mutate: exportUsers, isPending: isExportingUsers } = useMutation({
    mutationFn: () => handleExportDownload(`${activeShop?.id}/users`),
  });

  return { exportUsers, isExportingUsers };
}

export function useExportTotalSales() {
  const { activeShop } = useShopContext();

  const { mutate: exportTotalSales, isPending: isExportingTotalSales } =
    useMutation({
      mutationFn: () => handleExportDownload(`${activeShop?.id}/sales`),
    });

  return { exportTotalSales, isExportingTotalSales };
}
