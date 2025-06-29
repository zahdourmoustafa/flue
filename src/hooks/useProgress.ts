"use client";

import { useState, useEffect } from "react";

export interface ProgressStats {
  currentLevel: number;
  nextLevel: number;
  minutesLeft: number;
  progressPercentage: number;
  totalMinutes: number;
  streakDays: number;
  longestStreak: number;
  daysStudied: number;
  avgPronunciationScore: number;
  avgPracticeTime: number;
}

export interface PracticeScore {
  date: string;
  score: number;
}

export interface PracticeTime {
  date: string;
  minutes: number;
}

export interface CalendarDay {
  date: number;
  hasActivity: boolean;
  isToday: boolean;
}

export interface DailyFeedback {
  message: string;
  completed: boolean;
}

export interface ProgressData {
  stats: ProgressStats;
  practiceScores: PracticeScore[];
  practiceTime: PracticeTime[];
  calendar: CalendarDay[];
  dailyFeedback: DailyFeedback;
}

export const useProgress = () => {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/progress");
      
      if (!response.ok) {
        throw new Error("Failed to fetch progress data");
      }
      
      const progressData = await response.json();
      setData(progressData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchProgress,
  };
}; 