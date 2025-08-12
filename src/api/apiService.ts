import { authStorage } from "../utils/authStorage";
import type { CategoryTypes, ShopTypes } from "../utils/types";
import api from "./apiClient";
import indexedDBManager from "../utils/indexedDB";
import { decodeJWTPayload } from "../utils/helpers";
import Cookies from "js-cookie";

type UpdateCategoryTypes = {
  id: string;
  data: CategoryTypes;
};
type UpdateShopTypes = {
  id: string;
  data: ShopTypes;
};

// Auth
export const signIn = (data: any) => api.post("/auth/login", data);
export const changePassword = (data: any) =>
  api.post("/users/change_password", data);
export const signOut = () => api.post("/users/logout");
export const forgotPassword = (data: { email: string }) =>
  api.post("/auth/send_reset_link", data);
export const resetPassword = (data: FormData) =>
  api.post("/auth/reset_password", data);
export const refreshToken = () => api.post("/users/refresh");

// User
// export const getUser = () => api.get("/users/me");
export const getUser = async () => {
  // Check if we're offline
  if (!navigator.onLine) {
    // const cachedUser = authStorage.getCachedUser();
    const token = authStorage.getCachedToken();
    // console.log(token);

    if (!token) {
      throw new Error("No valid cached authentication available offline");
    }

    try {
      const decoded = decodeJWTPayload(token);

      // Verify token hasn't expired
      if (decoded.exp * 1000 < Date.now()) {
        Cookies.remove("token");
        throw new Error("Token has expired");
      }

      const shops = await indexedDBManager.getUserShops(decoded.id);

      // console.log(decoded);

      const user = {
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        id: decoded.id,
        shops,
        status: "inactive",
      };
      return { data: user };
    } catch (error) {
      Cookies.remove("token");
      throw new Error("Invalid token");
    }

    // if (cachedUser && token && authStorage.isCacheValid()) {
    //   authStorage.setOfflineMode(true);
    //   // Return cached user in the same format as API response
    //   return { data: cachedUser };
    // } else {
    //   throw new Error("No valid cached authentication available offline");
    // }
  }

  try {
    // Online: fetch from server
    const response = await api.get("/users/me");

    // Cache the user data on successful fetch
    // if (response.data) {
    //   const token = authStorage.getCachedToken();
    //   // authStorage.setAuthState(token || "", response.data);
    // }

    return response;
  } catch (error) {
    // Network error but we might have cached data
    // const cachedUser = authStorage.getCachedUser();
    const token = authStorage.getCachedToken();

    if (!token) {
      throw new Error("No valid cached authentication available offline");
    }

    try {
      // Decode JWT (you'll need a JWT library)
      const decoded = decodeJWTPayload(token);

      // Verify token hasn't expired
      if (decoded.exp * 1000 < Date.now()) {
        Cookies.remove("token");
        throw new Error("Token has expired");
      }

      // console.log(decoded);
      const shops = await indexedDBManager.getUserShops(decoded.id);

      // console.log(decoded);

      const user = {
        name: decoded.me,
        email: decoded.email,
        role: decoded.role,
        id: decoded.id,
        shops,
        status: "inactive",
      };
      return { data: user };
    } catch (error) {
      Cookies.remove("token");
      throw new Error("Invalid token");
    }

    // if (cachedUser && token && authStorage.isCacheValid()) {
    //   console.log("Using cached user data due to network error, user");
    //   authStorage.setOfflineMode(true);
    //   return { data: cachedUser };
    // }

    // throw error;
  }
};

// Admin User
export const getUsers = async () => {
  // Check if we're offline
  if (!navigator.onLine) {
    const cachedUsers = await indexedDBManager.getCachedUsers();
    if (cachedUsers) {
      console.log("Using cached users data (offline)");
      // Return cached users in the same format as API response
      return { data: cachedUsers };
    } else {
      throw new Error("No cached users available offline");
    }
  }

  try {
    // Online: fetch from server
    const response = await api.get("/users/overview");

    // Cache the users data on successful fetch
    if (response.data) {
      await indexedDBManager.saveUsers(response.data);
    }
    return response;
  } catch (error) {
    // Network error but we might have cached data
    const cachedUsers = await indexedDBManager.getCachedUsers();
    if (cachedUsers) {
      console.log("Using cached users data due to network error");
      return { data: cachedUsers };
    }

    throw error;
  }
};
export const createUser = (data: FormData) => api.post("/create_user", data);
export const updateUser = ({ id, data }: { id: string; data: FormData }) =>
  api.post(`/users/${id}`, data);
export const deleteUser = (id: string) => api.delete(`/users/delete/${id}`);

// Shops
export const getShops = () => api.get("/shops");
export const createShop = (data: any) => api.post("/shops", data);
export const updateShop = ({ id, data }: UpdateShopTypes) =>
  api.put(`/shops/${id}`, data);
export const deleteShop = (id: string) => api.delete(`/shops/${id}`);

// Products
export const getProducts = (id: string) => api.get(`/products?shop_id=${id}`);
export const createProduct = (data: any) => api.post("/products", data);
export const updateProduct = ({ id, data }: UpdateShopTypes) =>
  api.put(`/products/${id}`, data);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);

// Categories
export const getCategories = (id: string) =>
  api.get(`/categories?shop_id=${id}`);
export const createCategory = (data: any) => api.post("/categories", data);
export const updateCategory = ({ id, data }: UpdateCategoryTypes) =>
  api.put(`/categories/${id}`, data);
export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);

// Inventory
export const getInventories = (id: string) =>
  api.get(`/inventory?shop_id=${id}`);
export const updateInventory = ({ id, data }: UpdateShopTypes) =>
  api.put(`/inventory/${id}`, data);

// Sales
export const getTotalSales = (id: string) => api.get(`/sales?shop_id=${id}`);
export const getSalesReport = (id: string) =>
  api.get(`/shop/sales-report?shop_id=${id}`);

// Orders
export const syncOrders = (data: any) => api.post(`/orders_sync`, data);

// Dashboards
export const getRecentTransactions = (id: string) =>
  api.get(`/shops/${id}/stats/recent-transactions`);
export const getTopSellingProducts = (id: string) =>
  api.get(`/shops/${id}/stats/top-products`);
export const getStockStatus = (id: string) =>
  api.get(`/shops/${id}/stats/stock-levels`);
export const getSalesStat = (id: string) =>
  api.get(`/shops/${id}/stats/sales-totals`);
export const getRevenueChart = (id: string) =>
  api.get(`/shops/${id}/stats/revenue-growth`);

// Excess Cash
export const getExcessCash = (id: string) =>
  api.get(`/fetch/excesses?shop_id=${id}`);
export const addExcessCash = (data: any) =>
  api.post(`/sales/excess-cash`, data);

// Profit
interface getProfitArgs {
  id: string;
  from: string;
  to: string;
}
export const getProfit = ({ id, from, to }: getProfitArgs) =>
  api.get(`/total-profit?shop_id=${id}&from=${from}&to=${to}`);
