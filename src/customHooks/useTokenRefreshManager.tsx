import { useEffect, useRef, useState } from "react";
import { useRefreshToken } from "./useAuth";

export function useTokenRefreshManager() {
  const { refreshToken } = useRefreshToken();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // console.log("User is online - resuming token refresh");

      // If we were supposed to be refreshing and now we're online, start again
      if (shouldRefresh) {
        startTokenRefreshInterval();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      // console.log("User is offline - pausing token refresh");

      // Stop the interval when offline but remember we should be refreshing
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [shouldRefresh]);

  const startTokenRefreshInterval = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    // Only start if online
    if (isOnline) {
      // console.log("Setting token refresh interval");

      refreshIntervalRef.current = setInterval(() => {
        // Double check we're still online before refreshing
        // console.log("Token refresh interval fired");
        // console.log();
        if (navigator.onLine) {
          refreshToken();
        }
      }, 3600000); // 1 hour
    }
  };

  const startTokenRefresh = () => {
    setShouldRefresh(true);

    if (isOnline) {
      startTokenRefreshInterval();
    } else {
      //   console.log(
      //     "User is offline - token refresh will start when back online"
      //   );
    }
  };

  const stopTokenRefresh = () => {
    setShouldRefresh(false);

    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTokenRefresh();
    };
  }, []);

  return {
    startTokenRefresh,
    stopTokenRefresh,
    isOnline,
    shouldRefresh,
  };
}

export default useTokenRefreshManager;
