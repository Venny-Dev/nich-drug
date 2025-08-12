import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser as createUserApi,
  deleteUser as deleteUserApi,
  updateUser as updateUserApi,
  getUser,
  getUsers,
} from "../api/apiService";
import { toast } from "react-toastify";
import { authStorage } from "../utils/authStorage";
import { useNavigate } from "react-router";
// import type { UserTypes } from "../utils/types";
// import { useShopContext } from "../contexts/ShopContext";

export const useUser = () => {
  const navigate = useNavigate();
  const {
    data,
    isPending: isGettingUser,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
    retry: (failureCount) => {
      return failureCount < 3;
    },
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // gcTime: 10 * 60 * 1000,
  });

  if (error) {
    console.log(error);
    toast.error("Failed to fetch user data");
    navigate("/auth");
  }

  // console.log(data?.data);
  const isOffline = authStorage.isOfflineMode();
  return { user: data?.data, isGettingUser, isOffline };
};

// Admin User
export const useUsers = () => {
  const { user } = useUser();
  const {
    data,
    isPending: isGettingUsers,
    error,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await getUsers();
      return result;
    },
    enabled: user?.role !== "cashier",
    retry: (failureCount, error) => {
      console.log(
        `🔴 Users fetch failed (attempt ${failureCount + 1}):`,
        error
      );
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });

  // console.log(data);
  return { users: data?.data, isGettingUsers, error, isError };
};

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { mutate: createUser, isPending: isCreatingUser } = useMutation({
    mutationFn: (formData: FormData) => createUserApi(formData),
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  return { createUser, isCreatingUser };
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { mutate: deleteUser, isPending: isDeletingUser } = useMutation({
    mutationFn: (id: string) => deleteUserApi(id),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong");
    },
  });

  return { deleteUser, isDeletingUser };
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isPending: isUpdatingUser } = useMutation({
    mutationFn: (data: any) => updateUserApi(data),
    onSuccess: (data) => {
      // console.log(data);
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong");
    },
  });

  return { updateUser, isUpdatingUser };
}
