"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Clock, Zap, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const SubscriptionStatus: React.FC = () => {
  const {
    subscriptionStatus,
    isLoading,
    isPremium,
    isTrialing,
    trialDaysLeft,
    startSubscription,
    isCreatingCheckout,
    refetch
  } = useSubscription();

  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch("/api/subscription/sync", {
        method: "POST",
      });
      
      if (response.ok) {
        // Refresh subscription data
        await refetch();
        queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
      } else {
        console.error("Sync failed");
      }
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  // Premium user
  if (isPremium) {
    return (
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-amber-600" />
              <div>
                <div className="font-semibold text-amber-900">
                  Premium Active
                </div>
                <div className="text-sm text-amber-700">
                  All features unlocked
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              Premium
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Trial user
  if (isTrialing) {
    return (
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-blue-900">
                  {trialDaysLeft} days left in trial
                </div>
                <div className="text-sm text-blue-700">
                  Enjoying premium features?
                </div>
              </div>
            </div>
            <Button
              onClick={startSubscription}
              disabled={isCreatingCheckout}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCreatingCheckout ? "Loading..." : "Upgrade"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Free user - but might need sync
  return (
    <Card className="border-gray-200 hover:border-amber-300 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-semibold text-gray-900">Free Plan</div>
              <div className="text-sm text-gray-600">Limited features</div>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-1">
              Free
            </Badge>
            <div className="text-xs text-amber-600 font-medium">
              Try Premium Free
            </div>
          </div>
        </div>
        
        {/* Sync button for users who just paid */}
        <div className="flex gap-2">
          <Button
            onClick={startSubscription}
            disabled={isCreatingCheckout}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-sm"
          >
            {isCreatingCheckout ? "Loading..." : "Start Free Trial"}
          </Button>
          
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            variant="outline"
            size="sm"
            className="px-3"
            title="Sync subscription status"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 mt-2 text-center">
          Just paid? Click sync to update status
        </div>
      </CardContent>
    </Card>
  );
};
