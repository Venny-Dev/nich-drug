import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createShop as createShopApi,
  getShops,
  updateShop as updateShopApi,
  deleteShop as deleteShopApi,
} from "../api/apiService";
import { toast } from "react-toastify";
import indexedDBManager from "../utils/indexedDB";

export function useShops() {
  // const queryClient = useQueryClient();

  const {
    data,
    isPending: isGettingShops,
    error,
  } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      try {
        // Try to fetch from API first
        const response = await getShops();

        // If successful, backup to IndexedDB
        if (response?.data) {
          await indexedDBManager.saveShops(response.data);
        }

        return response;
      } catch (error) {
        // If API fails, try to load from IndexedDB
        console.warn("API failed, loading shops from IndexedDB:", error);
        const cachedShops = await indexedDBManager.loadAllShops();

        if (cachedShops.length > 0) {
          return { data: cachedShops };
        }

        throw error; // Re-throw if no cached data
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    // cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    shops: data?.data,
    isGettingShops,
    isOffline: indexedDBManager.isOffline(),
    error,
  };
}
// export function useShops() {
//   const { data, isPending: isGettingShops } = useQuery({
//     queryKey: ["shops"],
//     queryFn: getShops,
//   });

//   return { shops: data?.data, isGettingShops };
// }

export function useCreateShop() {
  const queryClient = useQueryClient();
  const { mutate: createShop, isPending: isCreatingShop } = useMutation({
    mutationFn: (data: any) => createShopApi(data),
    onSuccess: () => {
      // console.log(data);
      toast.success("Shop created successfully");
      queryClient.invalidateQueries({ queryKey: ["shops"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  return { createShop, isCreatingShop };
}

export function useUpdateShop() {
  const queryClient = useQueryClient();
  const { mutate: updateShop, isPending: isUpdatingShop } = useMutation({
    mutationFn: (data: any) => updateShopApi(data),
    onSuccess: (data) => {
      // console.log(data);
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["shops"] });
    },
  });

  return { updateShop, isUpdatingShop };
}

export function useDeleteShop() {
  const queryClient = useQueryClient();
  const { mutate: deleteShop, isPending: isDeletingShop } = useMutation({
    mutationFn: (id: string) => deleteShopApi(id),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["shops"] });
    },
  });

  return { deleteShop, isDeletingShop };
}
