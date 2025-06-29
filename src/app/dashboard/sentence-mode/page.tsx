"use client";

import { SentenceModeOverview } from "@/components/sentence-mode";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SubscriptionGuard } from "@/components/subscription/subscription-guard";

const SentenceModeLoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card key={i} className="p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-10 w-24" />
        </Card>
      ))}
    </div>
  </div>
);

const SentenceModePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <SentenceModeLoadingSkeleton />;
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Please sign in to access Sentence Mode
          </h1>
        </div>
      </div>
    );
  }

  return (
    <SubscriptionGuard featureId="sentence-mode">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Sentence Mode
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Practice pronunciation through guided sentence repetition.
              Progress through 10 units with increasing difficulty.
            </p>
          </div>

          <SentenceModeOverview userId={user.id} />
        </div>
      </div>
    </SubscriptionGuard>
  );
};

export default SentenceModePage;
