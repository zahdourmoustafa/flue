import { db } from "@/db";
import { userStats, dailyGoals } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export interface StreakCheckResult {
  goalCompleted: boolean;
  streakUpdated: boolean;
}

export async function checkAndUpdateStreak(
  userId: string,
  totalMinutes: number
): Promise<StreakCheckResult> {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Check if daily goal exists for today
  let dailyGoal = await db.query.dailyGoals.findFirst({
    where: and(eq(dailyGoals.userId, userId), eq(dailyGoals.goalDate, today)),
  });

  // Create daily goal record if it doesn't exist
  if (!dailyGoal) {
    await db.insert(dailyGoals).values({
      id: uuidv4(),
      userId: userId,
      goalDate: today,
      minutesCompleted: totalMinutes,
      goalCompleted: totalMinutes >= 30,
      completedAt: totalMinutes >= 30 ? new Date() : null,
    });
    dailyGoal = {
      goalCompleted: totalMinutes >= 30,
      minutesCompleted: totalMinutes,
    };
  } else {
    // Update existing daily goal
    await db
      .update(dailyGoals)
      .set({
        minutesCompleted: totalMinutes,
        goalCompleted: totalMinutes >= 30,
        completedAt:
          totalMinutes >= 30 && !dailyGoal.goalCompleted
            ? new Date()
            : dailyGoal.completedAt,
      })
      .where(
        and(eq(dailyGoals.userId, userId), eq(dailyGoals.goalDate, today))
      );
  }

  // Only update streak if goal was just completed (not already completed today)
  const streakUpdated = totalMinutes >= 30 && !dailyGoal.goalCompleted;

  if (streakUpdated) {
    await updateUserStreak(userId, today);
  }

  return {
    goalCompleted: totalMinutes >= 30,
    streakUpdated,
  };
}

async function updateUserStreak(userId: string, today: string) {
  // Get current user stats
  const stats = await db.query.userStats.findFirst({
    where: eq(userStats.userId, userId),
  });

  if (!stats) {
    // Create initial stats with streak = 1
    await db.insert(userStats).values({
      id: uuidv4(),
      userId: userId,
      streakDays: 1,
      lastStreakDate: today,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return;
  }

  const lastStreakDate = stats.lastStreakDate;
  let newStreakDays = 1;

  if (lastStreakDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // If last streak was yesterday, increment streak
    if (lastStreakDate === yesterdayStr) {
      newStreakDays = stats.streakDays + 1;
    }
    // If last streak was today, don't update (already counted)
    else if (lastStreakDate === today) {
      return;
    }
    // If gap is more than 1 day, reset streak to 1
  }

  // Update user stats with new streak
  await db
    .update(userStats)
    .set({
      streakDays: newStreakDays,
      lastStreakDate: today,
      updatedAt: new Date(),
    })
    .where(eq(userStats.userId, userId));
}
