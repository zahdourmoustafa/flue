"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp } from "lucide-react";

interface SentenceProgressProps {
  completed: number;
  total: number;
  title?: string;
  showDetails?: boolean;
  averageScore?: number | null;
}

export const SentenceProgress = ({
  completed,
  total,
  title = "Progress",
  showDetails = true,
  averageScore,
}: SentenceProgressProps) => {
  const progressPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {progressPercentage}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {showDetails && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {completed}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {total}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Total Sentences
              </div>
            </div>
          </div>
        )}

        {averageScore !== null && averageScore !== undefined && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Average Score:
            </span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {Math.round(averageScore)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
