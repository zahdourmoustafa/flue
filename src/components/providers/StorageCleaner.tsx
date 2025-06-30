"use client";

import { useEffect } from "react";

// SECURITY FIX: Component to clear any stale auth storage on app initialization
export const StorageCleaner = () => {
  useEffect(() => {
    // Only run once on app initialization
    const hasRun = sessionStorage.getItem("storage_cleaned");

    if (!hasRun && typeof window !== "undefined") {
      console.log("Clearing stale auth storage on app initialization");

      try {
        // Clear any stale auth data that might cause session mixing
        localStorage.removeItem("fluentzy_user_session");
        localStorage.removeItem("fluentzy_user_stats");

        // Mark as cleaned for this session
        sessionStorage.setItem("storage_cleaned", "true");

        console.log("Stale storage cleared successfully");
      } catch (error) {
        console.warn("Failed to clear stale storage:", error);
      }
    }
  }, []);

  return null; // This component doesn't render anything
};
