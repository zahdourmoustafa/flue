"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Crown, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-500 to-blue-600 p-6 text-white">
        <Skeleton className="h-6 w-32 rounded bg-white/20 mb-4" />
        <Skeleton className="h-12 w-full rounded-xl bg-white/20" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">Failed to load</span>
        </div>
      </div>
    );
  }

  if (data?.isTrial) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-white/20 rounded-xl flex items-center justify-center">
            <Crown className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Trial Active</h3>
            <p className="text-blue-100 text-sm">
              {data.daysLeftInTrial} days remaining
            </p>
          </div>
          <Button
            onClick={onUpgradeClick}
            disabled={isRedirecting}
            className="w-full bg-black hover:bg-black/90 text-white rounded-xl h-12 font-medium flex items-center justify-between px-6"
          >
            <span>{isRedirecting ? "Loading..." : "Upgrade plan"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (data?.isActive) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Pro Member</h3>
            <p className="text-emerald-100 text-sm">All features unlocked</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-500 to-blue-600 p-6 text-white">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 mx-auto bg-white/20 rounded-xl flex items-center justify-center">
          <Crown className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Get 3 day free trial</h3>
          <p className="text-purple-100 text-sm">
            for all the premium features
          </p>
        </div>
        <Button
          onClick={onUpgradeClick}
          disabled={isRedirecting}
          className="w-full bg-black hover:bg-black/90 text-white rounded-xl h-12 font-medium flex items-center justify-between px-6"
        >
          <span>{isRedirecting ? "Loading..." : "Upgrade plan"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
