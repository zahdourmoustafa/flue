"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";

interface DailyFeedbackCardProps {
  message: string;
  completed: boolean;
}

export const DailyFeedbackCard = ({
  message,
  completed,
}: DailyFeedbackCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 border-none text-black shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Daily Feedback</h3>
            <p className="text-black/80 font-medium">{message}</p>
          </div>
          <div className="flex items-center space-x-3">
            {completed && (
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Check className="w-5 h-5 text-yellow-500" />
              </div>
            )}
            <div className="p-2 bg-white/20 rounded-full">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
