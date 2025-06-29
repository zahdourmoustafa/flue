"use client";

import { useEffect, useRef, useCallback } from "react";

export const useTimeTracker = (feature: string) => {
  const startTimeRef = useRef<number | null>(null);
  const lastSentTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0);

  const sendTimeUpdate = useCallback(
    async (durationInSeconds: number, isBeforeUnload = false) => {
      if (durationInSeconds < 1) return; // Don't send updates for less than 1 second

      const data = {
        duration: durationInSeconds,
        feature,
        timestamp: Date.now(),
      };

      try {
        if (isBeforeUnload) {
          // Use sendBeacon for reliability when page is closing
          navigator.sendBeacon("/api/user/track-time", JSON.stringify(data));
        } else {
          await fetch("/api/user/track-time", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            keepalive: true,
          });
        }
      } catch (error) {
        console.error("Failed to track time:", error);
      }
    },
    [feature]
  );

  useEffect(() => {
    startTimeRef.current = Date.now();
    lastSentTimeRef.current = Date.now();
    accumulatedTimeRef.current = 0;

    // Send periodic updates every 30 seconds
    const intervalId = setInterval(() => {
      if (startTimeRef.current && lastSentTimeRef.current) {
        const now = Date.now();
        const timeSinceLastSent = (now - lastSentTimeRef.current) / 1000;

        if (timeSinceLastSent >= 30) {
          sendTimeUpdate(timeSinceLastSent);
          lastSentTimeRef.current = now;
        }
      }
    }, 30000); // Every 30 seconds

    // Handle page visibility changes (when user switches tabs)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, send current time
        if (startTimeRef.current && lastSentTimeRef.current) {
          const now = Date.now();
          const timeSinceLastSent = (now - lastSentTimeRef.current) / 1000;
          if (timeSinceLastSent > 1) {
            sendTimeUpdate(timeSinceLastSent);
            lastSentTimeRef.current = now;
          }
        }
      } else {
        // Page is visible again, reset timer
        const now = Date.now();
        lastSentTimeRef.current = now;
      }
    };

    const handleBeforeUnload = () => {
      if (startTimeRef.current && lastSentTimeRef.current) {
        const now = Date.now();
        const timeSinceLastSent = (now - lastSentTimeRef.current) / 1000;
        if (timeSinceLastSent > 1) {
          sendTimeUpdate(timeSinceLastSent, true);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Send final time update
      if (startTimeRef.current && lastSentTimeRef.current) {
        const now = Date.now();
        const timeSinceLastSent = (now - lastSentTimeRef.current) / 1000;
        if (timeSinceLastSent > 1) {
          sendTimeUpdate(timeSinceLastSent);
        }
      }
    };
  }, [feature, sendTimeUpdate]);
};
