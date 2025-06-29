"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Crown, Zap } from "lucide-react";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  featureId: string;
  fallback?: React.ReactNode;
}

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  children,
  featureId,
  fallback,
}) => {
  const { requiresPremium, hasAccess, startSubscription, isCreatingCheckout } =
    useSubscription();

  const needsPremium = requiresPremium(featureId);

  // If feature doesn't require premium, show content
  if (!needsPremium) {
    return <>{children}</>;
  }

  // If user has access (premium or trial), show content
  if (hasAccess) {
    return <>{children}</>;
  }

  // Show fallback or default premium prompt
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Premium Feature</CardTitle>
          <CardDescription className="text-lg">
            Upgrade to Premium to unlock all learning modes and advanced
            features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <Zap className="w-4 h-4 mr-2" />
              3-day free trial included
            </div>
            <div className="text-3xl font-bold text-gray-900">
              $10
              <span className="text-lg font-normal text-gray-600">/month</span>
            </div>
          </div>
          <Button
            onClick={startSubscription}
            disabled={isCreatingCheckout}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white"
            size="lg"
          >
            {isCreatingCheckout ? "Loading..." : "Start Free Trial"}
          </Button>
          <p className="text-xs text-gray-500">
            Cancel anytime. No commitment required.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
