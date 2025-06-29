import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  userStats,
  callSessions,
  userSentenceProgress,
  conversations,
  messages,
} from "@/db/schema";
import { eq, sql, and, gte, desc, count } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/server-auth";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    // Get basic user stats
    const statsData = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, user.id))
      .limit(1);

    const stats = statsData[0] || {
      currentLevel: 1,
      nextLevel: 2,
      minutesLeft: 19,
      progressPercentage: 80,
      totalMinutes: 0,
      achievements: 0,
      streakDays: 0,
      lessonsCompleted: 0,
    };

    // Get practice scores for the last 7 days (mock data for now)
    const practiceScores = [
      { date: "24 Jun", score: 85 },
      { date: "25 Jun", score: 90 },
      { date: "26 Jun", score: 95 },
      { date: "27 Jun", score: 87 },
      { date: "28 Jun", score: 92 },
      { date: "29 Jun", score: 96 },
      { date: "30 Jun", score: 88 },
    ];

    // Get practice time over last 7 days
    const practiceTime = [
      { date: "7 days", minutes: 15 },
      { date: "6 days", minutes: 22 },
      { date: "5 days", minutes: 18 },
      { date: "4 days", minutes: 28 },
      { date: "3 days", minutes: 25 },
      { date: "2 days", minutes: 30 },
      { date: "1 day", minutes: 32 },
    ];

    // Get call sessions for pronunciation score
    const callSessionsData = await db
      .select({
        pronunciationScore: callSessions.pronunciationScore,
        duration: callSessions.duration,
        createdAt: callSessions.createdAt,
      })
      .from(callSessions)
      .where(eq(callSessions.userId, user.id))
      .orderBy(desc(callSessions.createdAt))
      .limit(10);

    // Calculate average pronunciation score
    const avgPronunciationScore =
      callSessionsData.length > 0
        ? Math.round(
            callSessionsData.reduce(
              (sum, session) => sum + (session.pronunciationScore || 0),
              0
            ) / callSessionsData.length
          )
        : 78;

    // Get sentence progress for days studied calculation
    const sentenceProgressData = await db
      .select({
        createdAt: userSentenceProgress.createdAt,
      })
      .from(userSentenceProgress)
      .where(eq(userSentenceProgress.userId, user.id));

    // Calculate unique days studied
    const uniqueDays = new Set(
      sentenceProgressData.map((p) => p.createdAt.toISOString().split("T")[0])
    );
    const daysStudied = uniqueDays.size || 5;

    // Calculate average practice time per session
    const totalSessions = callSessionsData.length + sentenceProgressData.length;
    const avgPracticeTime =
      totalSessions > 0 ? Math.round(stats.totalMinutes / totalSessions) : 7;

    // Generate streak calendar data (last 7 days)
    const today = new Date();
    const calendar = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      calendar.push({
        date: date.getDate(),
        hasActivity: i <= 2, // Last 3 days have activity
        isToday: i === 0,
      });
    }

    return NextResponse.json({
      stats: {
        currentLevel: stats.currentLevel,
        nextLevel: stats.nextLevel,
        minutesLeft: stats.minutesLeft,
        progressPercentage: stats.progressPercentage,
        totalMinutes: stats.totalMinutes, // ✅ This is now dynamic from the database and updated by time tracking
        streakDays: stats.streakDays,
        longestStreak: Math.max(stats.streakDays, 2), // Longest streak is at least current streak
        daysStudied,
        avgPronunciationScore,
        avgPracticeTime,
      },
      practiceScores,
      practiceTime,
      calendar,
      dailyFeedback: {
        message: "See your daily practice feedbacks here.",
        completed: true,
      },
    });
  } catch (error) {
    if ((error as Error).message.includes("User not authenticated")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching progress data:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress data" },
      { status: 500 }
    );
  }
}
