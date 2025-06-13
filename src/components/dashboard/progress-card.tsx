"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Trophy, Flame } from "lucide-react";

interface ProgressCardProps {
  currentLevel: number;
  nextLevel: number;
  minutesLeft: number;
  progressPercentage: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  currentLevel,
  nextLevel,
  minutesLeft,
  progressPercentage,
}) => {
  return (
    <div>
      <Card className="border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Level {currentLevel}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-medium">Active</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Keep learning to reach Level {nextLevel}!
          </p>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-600">Progress to next level</span>
                <span className="font-semibold text-blue-600">
                  {minutesLeft} min left
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3 bg-blue-50" />
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                Keep the momentum going!
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {currentLevel}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    Current
                  </span>
                </div>

                <div className="flex-1 h-2 bg-gradient-to-r from-blue-200 via-blue-300 to-gray-200 rounded-full mx-3 relative">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">
                    {nextLevel}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    Next
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
