import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
} from "../api/apiService";
import { toast } from "react-toastify";
import { useShopContext } from "../contexts/ShopContext";
import indexedDBManager from "../utils/indexedDB";

export function useProducts() {
  const { activeShop } = useShopContext();
  const shopId = activeShop?.id || "";
  // console.log(shopId);

  const { data, isPending, error } = useQuery({
    queryKey: ["products", shopId],
    queryFn: async () => {
      try {
        // Try to fetch from API first

        const response = await getProducts(shopId);
        // console.log(response);

        // If successful, backup to IndexedDB
        if (response?.data) {
          await indexedDBManager.saveShopProducts(shopId, response.data);
        }

        return response;
      } catch (error) {
        // If API fails, try to load from IndexedDB
        console.warn("API failed, loading products from IndexedDB:", error);
        const cachedProducts = await indexedDBManager.loadShopProducts(shopId);

        if (cachedProducts && cachedProducts.length > 0) {
          return { data: cachedProducts };
        }

        // throw error; // Re-throw if no cached data
        return { data: [] };
      }
    },
    enabled: !!shopId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    products: !shopId ? [] : data?.data,
    isGettingProducts: !shopId ? false : isPending,
    isOffline: indexedDBManager.isOffline(),
    error,
  };
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { mutate: createProduct, isPending: isCreatingProduct } = useMutation({
    mutationFn: (data: any) => createProductApi(data),
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  return { createProduct, isCreatingProduct };
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { mutate: updateProduct, isPending: isUpdatingProduct } = useMutation({
    mutationFn: (data: any) => updateProductApi(data),
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return { updateProduct, isUpdatingProduct };
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { mutate: deleteProduct, isPending: isDeletingProduct } = useMutation({
    mutationFn: (id: string) => deleteProductApi(id),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return { deleteProduct, isDeletingProduct };
}
