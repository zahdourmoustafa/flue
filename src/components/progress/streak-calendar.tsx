"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { CalendarDay } from "@/hooks/useProgress";

interface StreakCalendarProps {
  calendar: CalendarDay[];
}

export const StreakCalendar = ({ calendar }: StreakCalendarProps) => {
  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Streak calendar</CardTitle>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-3">
            {weekdays.map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar dates */}
          <div className="grid grid-cols-7 gap-3">
            {calendar.map((day, index) => (
              <div
                key={index}
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all
                  ${
                    day.isToday
                      ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-200"
                      : day.hasActivity
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700"
                  }
                `}
              >
                {day.date}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 