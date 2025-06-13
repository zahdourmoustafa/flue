"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Award, TrendingUp, BookOpen, Zap } from "lucide-react";

interface StatsCardProps {
  totalMinutes: number;
  achievements: number;
  streakDays: number;
  lessonsCompleted: number;
}

interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({
  icon: Icon,
  value,
  label,
  color,
}) => (
  <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
    <div
      className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-sm`}
    >
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="flex-1">
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  </div>
);

export const StatsCard: React.FC<StatsCardProps> = ({
  totalMinutes,
  achievements,
  streakDays,
  lessonsCompleted,
}) => {
  const formatTime = (minutes: number) => {
    if (minutes === 0) return "0 min";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div>
      <Card className="border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Your Stats</h3>
            </div>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Updated now
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Track your amazing learning journey!
          </p>

          <div className="space-y-3">
            <StatItem
              icon={Clock}
              value={formatTime(totalMinutes)}
              label="Learning time"
              color="bg-gradient-to-br from-blue-400 to-blue-600"
            />

            <StatItem
              icon={BookOpen}
              value={lessonsCompleted.toString()}
              label="Lessons completed"
              color="bg-gradient-to-br from-purple-400 to-purple-600"
            />

            <StatItem
              icon={Zap}
              value={`${streakDays} days`}
              label="Current streak"
              color="bg-gradient-to-br from-orange-400 to-red-500"
            />

            <StatItem
              icon={Award}
              value={achievements.toString()}
              label="Achievements earned"
              color="bg-gradient-to-br from-green-400 to-emerald-600"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
