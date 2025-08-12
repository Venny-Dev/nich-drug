import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInventories,
  updateInventory as updateInventoryApi,
} from "../api/apiService";
import { useShopContext } from "../contexts/ShopContext";
import { toast } from "react-toastify";

export function useInventories() {
  const { activeShop } = useShopContext();
  const { data, isPending } = useQuery({
    queryKey: ["inventories", activeShop?.id],
    queryFn: () => getInventories(activeShop?.id || ""),
    enabled: !!activeShop?.id,
  });

  return {
    inventories: !activeShop?.id ? [] : data?.data,
    isGettingInventories: !activeShop?.id ? false : isPending,
  };
}

export function useUpdateInventory() {
  const queryClient = useQueryClient();
  const { mutate: updateInventory, isPending: isUpdatingInventory } =
    useMutation({
      mutationFn: (data: any) => updateInventoryApi(data),
      onSuccess: (data) => {
        // console.log(data);
        toast.success(data.message || "Inventory updated successfully");
        queryClient.invalidateQueries({ queryKey: ["inventories"] });
      },
      onError: (error) => {
        toast.error(error.message || "Error updating inventory");
        console.log(error);
      },
    });

  return { updateInventory, isUpdatingInventory };
}
