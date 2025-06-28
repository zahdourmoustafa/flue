"use client";

import React from "react";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user, stats, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/2" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-12 lg:col-span-4">
              <Skeleton className="h-80" />
            </div>
            <div className="col-span-12 lg:col-span-3">
              <Skeleton className="h-80" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !stats) {
    // Handle case where user is not logged in or stats are not available
    return <div>Please log in to see your dashboard.</div>;
  }

  const userStats = {
    currentLevel: stats.currentLevel,
    nextLevel: stats.nextLevel,
    minutesLeft: stats.minutesLeft,
    progressPercentage: stats.progressPercentage,
    totalMinutes: stats.totalMinutes,
    achievements: stats.achievements,
    streakDays: stats.streakDays,
    lessonsCompleted: stats.lessonsCompleted,
  };

  return <DashboardContent userName={user.name} userStats={userStats} />;
}
