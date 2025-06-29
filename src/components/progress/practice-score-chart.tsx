"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { PracticeScore } from "@/hooks/useProgress";

interface PracticeScoreChartProps {
  data: PracticeScore[];
  currentLevel: number;
  minutesLeft: number;
  progressPercentage: number;
}

const chartConfig = {
  score: {
    label: "Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export const PracticeScoreChart = ({
  data,
  currentLevel,
  minutesLeft,
  progressPercentage,
}: PracticeScoreChartProps) => {
  const [currentWeek, setCurrentWeek] = useState(0);

  const handlePrevious = () => {
    setCurrentWeek(Math.max(0, currentWeek - 1));
  };

  const handleNext = () => {
    setCurrentWeek(currentWeek + 1);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Practice score
            </CardTitle>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
              <span>Your daily practice score chart.</span>
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bar Chart */}
        <div className="h-48">
          <ChartContainer config={chartConfig}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6B7280" }}
              />
              <YAxis hide />
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
              />
              <Bar
                dataKey="score"
                fill="#3B82F6"
                radius={[6, 6, 0, 0]}
                maxBarSize={35}
              />
            </BarChart>
          </ChartContainer>
        </div>

                {/* Level Progress */}
        <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Level {currentLevel}</h3>
                  <p className="text-blue-100 text-sm">Your current level</p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-blue-100">
                    Minutes left till next level
                  </p>
                  <span className="text-lg font-bold">{minutesLeft}m</span>
                </div>
                <p className="text-xs text-blue-200">Keep on learning!</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{currentLevel}</span>
                    <span className="font-medium">{currentLevel + 1}</span>
                  </div>
                  <div className="w-full bg-blue-800/50 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
