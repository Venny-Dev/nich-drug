import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncOrders as syncOrdersApi } from "../api/apiService";
import { toast } from "react-toastify";

export function useSyncOrders() {
  const queryClient = useQueryClient();
  const { mutate: syncOrders, isPending: isSyncing } = useMutation({
    mutationFn: (data: any) => syncOrdersApi(data),
    onSuccess: () => {
      // console.log(data);
      queryClient.invalidateQueries({ queryKey: ["total-sales"] });
      toast.success("Orders sync sucessfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  return { syncOrders, isSyncing };
}
