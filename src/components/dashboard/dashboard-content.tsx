"use client";

import React from "react";
import { WelcomeCard } from "./welcome-card";
import { ProgressCard } from "./progress-card";
import { StatsCard } from "./stats-card";
import { LearningModesSection } from "./learning-modes-section";

interface DashboardContentProps {
  userName: string;
  userStats: {
    currentLevel: number;
    nextLevel: number;
    minutesLeft: number;
    progressPercentage: number;
    totalMinutes: number;
    achievements: number;
    streakDays: number;
    lessonsCompleted: number;
  };
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  userName,
  userStats,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome back!
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ready to learn?
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              Continue your language learning journey with personalized lessons
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-10">
            {/* Daily Learning Goal Section */}
            <div className="p-8 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-3xl border border-blue-100/50">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  🎯 Daily Learning Goal
                </h3>
                <p className="text-gray-600 mb-6">
                  You've completed{" "}
                  <span className="font-semibold text-blue-600">
                    {userStats.totalMinutes}
                  </span>{" "}
                  minutes today. Keep going to reach your 30-minute goal!
                </p>
                <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (userStats.totalMinutes / 30) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {Math.max(30 - userStats.totalMinutes, 0)} minutes remaining
                </p>
              </div>
            </div>
            <LearningModesSection />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <WelcomeCard userName={userName} />

            <ProgressCard
              currentLevel={userStats.currentLevel}
              nextLevel={userStats.nextLevel}
              minutesLeft={userStats.minutesLeft}
              progressPercentage={userStats.progressPercentage}
            />

            <StatsCard
              totalMinutes={userStats.totalMinutes}
              achievements={userStats.achievements}
              streakDays={userStats.streakDays}
              lessonsCompleted={userStats.lessonsCompleted}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
