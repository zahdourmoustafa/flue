"use client";

import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function RouteGuard({
  children,
  requireAuth = true,
  redirectTo = "/sign-in",
  fallback,
}: RouteGuardProps) {
  const { user, loading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect if authentication is required but user is not authenticated
    if (requireAuth && !loading && !user && !error) {
      router.push(redirectTo);
    }
  }, [user, loading, error, requireAuth, redirectTo, router]);

  // Show loading state
  if (loading) {
    return (
      fallback || (
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>
        </div>
      )
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => router.push(redirectTo)}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show authentication required if user is not authenticated
  if (requireAuth && !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Please sign in to access this page and continue your learning
              journey.
            </p>
            <div className="flex gap-2 justify-center">
              <Button asChild>
                <a href="/sign-in">Sign In</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/sign-up">Create Account</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
}
