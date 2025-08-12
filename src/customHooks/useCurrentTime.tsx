import { useState, useEffect, useRef } from "react";

function useCurrentTime() {
  const [time, setTime] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (): string => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${dateStr}   ${timeStr}`;
  };

  useEffect(() => {
    // Set initial time
    setTime(formatTime());

    // Calculate time until next minute
    const now = new Date();
    const msUntilNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    // Set timeout for next minute boundary
    const timeoutId = setTimeout(() => {
      setTime(formatTime());

      // Start regular interval
      intervalRef.current = setInterval(() => {
        setTime(formatTime());
      }, 60000);
    }, msUntilNextMinute);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return time;
}

export default useCurrentTime;
