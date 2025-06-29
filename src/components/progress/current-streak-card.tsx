"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CurrentStreakCardProps {
  streakDays: number;
  longestStreak: number;
}

export const CurrentStreakCard = ({
  streakDays,
  longestStreak,
}: CurrentStreakCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">Current streak</CardTitle>
        <p className="text-muted-foreground">
          Practice at least 3 minutes a day to complete a session.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Ongoing streak
            </span>
            <p className="text-sm text-muted-foreground">Keep it up!</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{streakDays}</div>
            <div className="text-sm text-muted-foreground">days</div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Longest streak
            </span>
            <p className="text-sm text-muted-foreground">Personal best</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {longestStreak}
            </div>
            <div className="text-sm text-muted-foreground">days</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
