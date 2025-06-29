"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getStripe } from "@/lib/stripe";

export interface SubscriptionStatus {
  hasSubscription: boolean;
  isActive: boolean;
  inTrial: boolean;
  trialDaysLeft: number;
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
}

export const useSubscription = () => {
  // Get subscription status
  const {
    data: subscriptionStatus,
    isLoading,
    error,
    refetch,
  } = useQuery<SubscriptionStatus>({
    queryKey: ["subscription-status"],
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
      const stripe = await getStripe();
      if (stripe && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
  });

  // Helper functions
  const isPremium = subscriptionStatus?.isActive || false;
  const isTrialing = subscriptionStatus?.inTrial || false;
  const hasAccess = isPremium || isTrialing;
  const trialDaysLeft = subscriptionStatus?.trialDaysLeft || 0;

  // Check if a feature requires premium
  const requiresPremium = (featureId: string): boolean => {
    const premiumFeatures = [
      "dialogue",
      "sentence-mode",
      "videocall",
      "call-mode",
    ];
    return premiumFeatures.includes(featureId);
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
    startSubscription,
    isCreatingCheckout: createCheckoutMutation.isPending,
    checkoutError: createCheckoutMutation.error,
  };
};
