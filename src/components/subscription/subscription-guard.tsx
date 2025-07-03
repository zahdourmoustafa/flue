"use client";

import { useQuery } from "@tanstack/react-query";
import { Lock, Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

async function fetchSubscriptionStatus() {
  const res = await fetch("/api/subscription/status");
  if (!res.ok) {
    throw new Error("Failed to fetch subscription status");
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

interface SubscriptionGuardProps {
  children: React.ReactNode;
  featureName: string;
}

export const SubscriptionGuard = ({
  children,
  featureName,
}: SubscriptionGuardProps) => {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["subscriptionStatus"],
    queryFn: fetchSubscriptionStatus,
  });

  if (isLoading) {
    return (
      <div className="relative w-full h-full">
        <div className="blur-sm">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-48 h-24 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!data?.isActive || isError) {
    return (
      <div className="relative w-full h-full group">
        <div className="blur-sm transition-all duration-300 group-hover:blur-md">
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm bg-opacity-50 transition-all duration-300 opacity-0 group-hover:opacity-100">
          <div className="bg-background/80 p-6 rounded-xl shadow-lg text-center">
            <div className="flex items-center justify-center mb-2">
              <Crown className="h-6 w-6 text-yellow-500 mr-2" />
              <h3 className="text-lg font-bold">Premium Feature</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Unlock {featureName} and all other features by upgrading.
            </p>
            <Button onClick={handleUpgrade}>Upgrade to Pro</Button>
          </div>
        </div>
        {/* Default lock icon when not hovered */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-all duration-300 group-hover:opacity-0">
          <Lock className="h-12 w-12 text-white/50" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
