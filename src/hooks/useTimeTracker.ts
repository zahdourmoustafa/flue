"use client";

import { useEffect, useRef } from "react";

export const useTimeTracker = (feature: string) => {
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const handleBeforeUnload = () => {
      if (startTimeRef.current) {
        const endTime = Date.now();
        const durationInSeconds = (endTime - startTimeRef.current) / 1000;

        // Use sendBeacon to ensure the request is sent even when the page is closing
        navigator.sendBeacon(
          "/api/user/track-time",
          JSON.stringify({ duration: durationInSeconds, feature })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (startTimeRef.current) {
        const endTime = Date.now();
        const durationInSeconds = (endTime - startTimeRef.current) / 1000;
        fetch("/api/user/track-time", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ duration: durationInSeconds, feature }),
          keepalive: true, // keepalive ensures the request is sent even when the component unmounts
        });
      }
    };
  }, [feature]);
};
