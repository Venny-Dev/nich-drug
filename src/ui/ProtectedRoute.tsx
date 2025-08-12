import { Navigate, useLocation } from "react-router";
import { useUser } from "../customHooks/useUser";
import LoaderFull from "./LoaderFull";
import { useEffect } from "react";
import { authStorage } from "../utils/authStorage";
import { adminRoutes, cashierRoutes, managerRoutes } from "../utils/data";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isGettingUser } = useUser();
  const location = useLocation();

  // Define role-based route access
  const getRoleAllowedRoutes = (role: string) => {
    switch (role) {
      case "cashier":
        return cashierRoutes;
      case "manager":
        // All routes except shops and users
        return managerRoutes;
      case "admin":
        // All routes
        return adminRoutes;
      default:
        return ["/pos-terminal"]; // Default fallback
    }
  };

  const getDefaultRouteForRole = (role: string) => {
    switch (role) {
      case "cashier":
        return "/pos-terminal";
      case "manager":
        return "/";
      case "admin":
        return "/";
      default:
        return "/pos-terminal";
    }
  };

  useEffect(() => {
    const handleOnline = async () => {
      if (authStorage.isOfflineMode()) {
        authStorage.setOfflineMode(false);
        // window.location.reload();
      }
    };

    const handleOffline = () => {
      // console.log("🔴 handleOffline triggered!");
      // console.log("navigator.onLine:", navigator.onLine);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isGettingUser) {
    return <LoaderFull />;
  }

  if (!user && !isGettingUser) {
    return <Navigate to="/auth" replace />;
  }

  // Check route authorization for authenticated users
  if (user && !isGettingUser) {
    const allowedRoutes = getRoleAllowedRoutes(user.role);
    // console.log(allowedRoutes);
    const currentPath = location.pathname;

    // Check if the current route is allowed for the user's role
    const isRouteAllowed = allowedRoutes.includes(currentPath);

    if (!isRouteAllowed) {
      const defaultRoute = getDefaultRouteForRole(user.role);
      return <Navigate to={defaultRoute} replace />;
    }
  }

  return children;
}

export default ProtectedRoute;

// export const logout = () => {
//   authStorage.clearAuthState();
//   // Navigate to login page
//   window.location.href = '/auth';
// };
