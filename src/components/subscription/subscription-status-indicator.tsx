"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useRouter } from "next/navigation";

async function fetchSubscriptionStatus() {
  const res = await fetch("/api/subscription/status");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

async function handleUpgrade() {
  const res = await fetch("/api/subscription/checkout", {
    method: "POST",
  });
  const { url } = await res.json();
  window.location.href = url;
}

export const SubscriptionStatusIndicator = () => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["subscriptionStatus"],
    queryFn: fetchSubscriptionStatus,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });

  const onUpgradeClick = async () => {
    setIsRedirecting(true);
    try {
      await handleUpgrade();
    } catch (error) {
      console.error("Failed to redirect to checkout:", error);
      setIsRedirecting(false);
      // Optionally, show a toast notification to the user
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-2">
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-500 text-xs p-2">
        <AlertTriangle className="h-4 w-4" />
        <span>Could not load status.</span>
      </div>
    );
  }

  if (data?.isTrial) {
    return (
      <div className="border text-center text-sm p-3 rounded-lg bg-secondary/50">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <p>
            <span className="font-bold">{data.daysLeftInTrial}</span> days left
            in trial
          </p>
        </div>
        <Button
          onClick={onUpgradeClick}
          size="sm"
          className="w-full"
          disabled={isRedirecting}
        >
          {isRedirecting ? "Redirecting..." : "Upgrade Now"}
        </Button>
      </div>
    );
  }

  if (data?.isActive) {
    return (
      <Badge variant="secondary" className="p-2 w-full justify-center">
        <Crown className="h-4 w-4 mr-2 text-yellow-500" />
        Pro Plan
      </Badge>
    );
  }

  return (
    <div className="border text-center text-sm p-3 rounded-lg bg-card">
      <p className="font-semibold mb-2">Unlock All Features</p>
      <Button
        onClick={onUpgradeClick}
        size="sm"
        className="w-full"
        disabled={isRedirecting}
      >
        {isRedirecting ? "Redirecting..." : "Upgrade"}
      </Button>
    </div>
  );
};
