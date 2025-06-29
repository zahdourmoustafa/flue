"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Timer, Calendar, Mic } from "lucide-react";

interface StatsSectionProps {
  totalMinutes: number;
  avgPracticeTime: number;
  daysStudied: number;
  avgPronunciationScore: number;
}

export const StatsSection = ({
  totalMinutes,
  avgPracticeTime,
  daysStudied,
  avgPronunciationScore,
}: StatsSectionProps) => {
  const stats = [
    {
      title: `${totalMinutes}`,
      subtitle: "Total learning time",
      icon: Clock,
      value: totalMinutes,
      unit: "minutes",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      darkBgColor: "dark:bg-blue-950/20",
    },
    {
      title: `${avgPracticeTime}`,
      subtitle: "Average practice time",
      icon: Timer,
      value: avgPracticeTime,
      unit: "minutes",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      darkBgColor: "dark:bg-purple-950/20",
    },
    {
      title: `${daysStudied}`,
      subtitle: "Number of practice sessions completed",
      icon: Calendar,
      value: daysStudied,
      unit: "days studied",
      color: "text-green-600",
      bgColor: "bg-green-50",
      darkBgColor: "dark:bg-green-950/20",
    },
    {
      title: `${avgPronunciationScore}`,
      subtitle: "Average pronunciation score",
      icon: Mic,
      value: avgPronunciationScore,
      unit: "",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      darkBgColor: "dark:bg-orange-950/20",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Stats</CardTitle>
        <p className="text-sm text-muted-foreground">
          Your personal learning data.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-xl ${stat.bgColor} ${stat.darkBgColor}`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.title}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {stat.unit}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.subtitle}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
