"use client";

import { useQuery, useMutation } from "@tanstack/react-query";

export interface SubscriptionStatus {
  isActive: boolean;
  isTrial: boolean;
  trialEndDate?: string;
  daysLeftInTrial: number;
}

// Define which features require premium access
const PREMIUM_FEATURES = [
  "dialogue",
  "sentence-mode",
  "call-mode",
  "videocall",
];

export const useSubscription = () => {
  // Get subscription status
  const {
    data: subscriptionStatus,
    isLoading,
    error,
    refetch,
  } = useQuery<SubscriptionStatus>({
    queryKey: ["subscriptionStatus"],
    queryFn: async () => {
      const response = await fetch("/api/subscription/status");
      if (!response.ok) {
        throw new Error("Failed to fetch subscription status");
      }
      return response.json();
    },
  });

  // Create checkout session mutation
  const createCheckoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create checkout session");
      }

      return response.json();
    },
    onSuccess: async (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  // Helper functions
  const isPremium = subscriptionStatus?.isActive || false;
  const isTrialing = subscriptionStatus?.isTrial || false;
  const hasAccess = isPremium || isTrialing;
  const trialDaysLeft = subscriptionStatus?.daysLeftInTrial || 0;

  // Check if a feature requires premium access
  const requiresPremium = (featureId: string): boolean => {
    return PREMIUM_FEATURES.includes(featureId);
  };

  // Check if user has access to a specific feature
  const hasFeatureAccess = (featureId: string): boolean => {
    if (!requiresPremium(featureId)) {
      return true; // Free features
    }
    return hasAccess; // Premium features require subscription
  };

  // Start subscription flow
  const startSubscription = () => {
    createCheckoutMutation.mutate();
  };

  return {
    subscriptionStatus,
    isLoading,
    error,
    refetch,
    isPremium,
    isTrialing,
    hasAccess,
    trialDaysLeft,
    requiresPremium,
    hasFeatureAccess,
    startSubscription,
    isCreatingCheckout: createCheckoutMutation.isPending,
    checkoutError: createCheckoutMutation.error,
  };
};
