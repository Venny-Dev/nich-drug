import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addExcessCash as addExcessCashApi,
  getExcessCash,
} from "../api/apiService";
import { useShopContext } from "../contexts/ShopContext";
import { toast } from "react-toastify";

export function useGetExcessCash() {
  const { activeShop } = useShopContext();
  const { data, isPending: isGettingExcessCash } = useQuery({
    queryKey: ["excessCash", activeShop?.id],
    queryFn: () => getExcessCash(activeShop?.id || ""),
  });
  return { excessCash: data?.data, isGettingExcessCash };
}

interface AddExcessCashProps {
  amount: number;
  cashier_id?: string | number;
  date?: string;
}

export function useAddExcessCash() {
  const { activeShop } = useShopContext();
  const queryClient = useQueryClient();
  const { mutate: addExcessCash, isPending: isAddingExcessCash } = useMutation({
    mutationFn: (data: AddExcessCashProps) =>
      addExcessCashApi({ shop_id: activeShop?.id, ...data }),
    onSuccess: () => {
      toast.success("Excess cash added successfully");
      queryClient.invalidateQueries({
        queryKey: ["excessCash"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { addExcessCash, isAddingExcessCash };
}
