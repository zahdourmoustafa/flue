"use client";

import React from "react";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
  const { user, stats } = useAuth();

  // RouteGuard ensures user is authenticated, so we can safely use user data
  if (!user) return null; // This should never happen due to RouteGuard

  // Use default stats if stats are not available (graceful degradation)
  const defaultStats = {
    currentLevel: 1,
    nextLevel: 2,
    minutesLeft: 30,
    progressPercentage: 0,
    totalMinutes: 0,
    achievements: 0,
    streakDays: 0,
    lessonsCompleted: 0,
  };

  const userStats = stats || defaultStats;

  return <DashboardContent userName={user.name} userStats={userStats} />;
}
