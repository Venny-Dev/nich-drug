import { useMutation } from "@tanstack/react-query";
import {
  signIn as signinApi,
  changePassword as changePasswordApi,
  signOut,
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
  refreshToken as refreshTokenApi,
} from "../api/apiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import indexedDBManager from "../utils/indexedDB";

// admin@nichdrugs.com
// nichDrugsAdmin
export function useSignIn() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { mutate: signIn, isPending: isSigningIn } = useMutation({
    mutationFn: signinApi,
    onSuccess: (data) => {
      toast.success(data.message);
      // navigate("/");

      // console.log(data.data.shops);

      indexedDBManager.saveUserShops(data.data.id, data.data.shops);

      // console.log("still running");
      // console.log(data.data.role);
      if (data.data.role === "cashier") {
        navigate("/pos-terminal");
      } else {
        // console.log("running admin or manager");
        navigate("/");
      }
      queryClient.invalidateQueries({ queryKey: ["user", "total-sales"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  return { signIn, isSigningIn };
}

export function useChangePassword() {
  const { mutate: changePassword, isPending: isChangingPassword } = useMutation(
    {
      mutationFn: changePasswordApi,
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.message);
      },
    }
  );
  return { changePassword, isChangingPassword };
}

export function useLogout() {
  const navigate = useNavigate();

  const { mutate: logOut, isPending: isLoggingOut } = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      navigate("/auth");
      toast.success("Logged out successfully");
      // queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return { logOut, isLoggingOut };
}

export function useForgotPassword() {
  const { mutate: forgotPassword, isPending: isForgettingPassword } =
    useMutation({
      mutationFn: forgotPasswordApi,
    });

  return { forgotPassword, isForgettingPassword };
}

export function useResetPassword() {
  const { mutate: resetPassword, isPending: isResettingPassword } = useMutation(
    {
      mutationFn: resetPasswordApi,
    }
  );
  return { resetPassword, isResettingPassword };
}

export function useRefreshToken() {
  const { mutate: refreshToken, isPending: isRefreshingToken } = useMutation({
    mutationFn: refreshTokenApi,
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message);
    },
    retry: (failureCount, error) => {
      // Don't retry if offline
      if (!navigator.onLine) {
        // console.log("Not retrying token refresh - user is offline");
        return false;
      }

      // Don't retry if it's an authentication error (401, 403)
      const status = (error as any)?.status;
      if (status === 401 || status === 403) {
        console.log("Not retrying token refresh - authentication error");
        return false;
      }

      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 2s, 4s, 8s
      return Math.min(2000 * Math.pow(2, attemptIndex), 10000);
    },
  });
  return { refreshToken, isRefreshingToken };
}
