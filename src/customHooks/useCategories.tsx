import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory as createCategoryApi,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
} from "../api/apiService";
import { toast } from "react-toastify";
import { useShopContext } from "../contexts/ShopContext";
import indexedDBManager from "../utils/indexedDB";

export function useCategories() {
  const { activeShop } = useShopContext();
  const shopId = activeShop?.id || "";

  const { data, isPending, error } = useQuery({
    queryKey: ["category", shopId],
    queryFn: async () => {
      try {
        // Try to fetch from API first
        const response = await getCategories(shopId);
        // console.log(response);

        // If successful, backup to IndexedDB
        if (response?.data) {
          await indexedDBManager.saveShopCategories(shopId, response.data);
        }

        return response;
      } catch (error) {
        // If API fails, try to load from IndexedDB
        console.warn("API failed, loading categories from IndexedDB:", error);
        const cachedCategories = await indexedDBManager.loadShopCategories(
          shopId
        );

        if (cachedCategories && cachedCategories.length > 0) {
          return { data: cachedCategories };
        }

        throw error; // Re-throw if no cached data
      }
    },
    enabled: !!shopId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // console.log(data);

  return {
    categories: !shopId ? [] : data?.data,
    isGettingCategories: !shopId ? false : isPending,
    isOffline: indexedDBManager.isOffline(),
    error,
  };
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { mutate: createCategory, isPending: isCreatingCategory } = useMutation(
    {
      mutationFn: (data: any) => createCategoryApi(data),
      onSuccess: () => {
        toast.success("Category created successfully");
        queryClient.invalidateQueries({ queryKey: ["category"] });
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.message);
      },
    }
  );

  return { createCategory, isCreatingCategory };
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { mutate: updateCategory, isPending: isUpdatingCategory } = useMutation(
    {
      mutationFn: (data: any) => updateCategoryApi(data),
      onSuccess: (data) => {
        // console.log(data);
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["category"] });
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.message);
      },
    }
  );

  return { updateCategory, isUpdatingCategory };
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { mutate: deleteCategory, isPending: isDeletingCategory } = useMutation(
    {
      mutationFn: (id: string) => deleteCategoryApi(id),
      onSuccess: () => {
        toast.success("Category deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["category"] });
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.message);
      },
    }
  );

  return { deleteCategory, isDeletingCategory };
}
