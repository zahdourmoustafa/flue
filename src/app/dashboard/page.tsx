"use client";

import React from "react";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function DashboardPage() {
  // Mock user data - in a real app, this would come from your auth/user context
  const userData = {
    userName: "MOUSTAFA",
    userStats: {
      currentLevel: 1,
      nextLevel: 2,
      minutesLeft: 5,
      progressPercentage: 75,
      totalMinutes: 25,
      achievements: 3,
      streakDays: 7,
      lessonsCompleted: 12,
    },
  };

  return (
    <DashboardContent
      userName={userData.userName}
      userStats={userData.userStats}
    />
  );
}
