"use client";

import React from "react";
import { useProgress } from "@/hooks/useProgress";
import { useTimeTracker } from "@/hooks/useTimeTracker";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressHeader } from "@/components/progress/progress-header";
import { DailyFeedbackCard } from "@/components/progress/daily-feedback-card";
import { PracticeScoreChart } from "@/components/progress/practice-score-chart";
import { PracticeTimeChart } from "@/components/progress/practice-time-chart";
import { CurrentStreakCard } from "@/components/progress/current-streak-card";
import { StatsSection } from "@/components/progress/stats-section";
import { PopularModesSection } from "@/components/progress/popular-modes-section";
import { StreakCalendar } from "@/components/progress/streak-calendar";

export default function ProgressPage() {
  const { data, loading, error } = useProgress();

  // Track time spent on progress page
  useTimeTracker("progress");

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3 space-y-6">
              <Skeleton className="h-32" />
              <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-80" />
                <Skeleton className="h-80" />
              </div>
              <Skeleton className="h-48" />
              <Skeleton className="h-64" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Failed to load progress data
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {error || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-8">
          <ProgressHeader />

          <div className="grid gap-8 lg:grid-cols-4">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Daily Feedback */}
              <DailyFeedbackCard
                message={data.dailyFeedback.message}
                completed={data.dailyFeedback.completed}
              />

              {/* Charts Row */}
              <div className="grid gap-6 md:grid-cols-2">
                <PracticeScoreChart
                  data={data.practiceScores}
                  currentLevel={data.stats.currentLevel}
                  minutesLeft={data.stats.minutesLeft}
                  progressPercentage={data.stats.progressPercentage}
                />
                <PracticeTimeChart data={data.practiceTime} />
              </div>

              {/* Current Streak */}
              <CurrentStreakCard
                streakDays={data.stats.streakDays}
                longestStreak={data.stats.longestStreak}
              />

              {/* Stats Section */}
              <StatsSection
                totalMinutes={data.stats.totalMinutes}
                avgPracticeTime={data.stats.avgPracticeTime}
                daysStudied={data.stats.daysStudied}
                avgPronunciationScore={data.stats.avgPronunciationScore}
              />

              {/* Streak Calendar */}
              <StreakCalendar calendar={data.calendar} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <PopularModesSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
