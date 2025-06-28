import { NextResponse } from "next/server";
import { db } from "@/db";
import { userStats } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/server-auth";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    const statsData = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, user.id))
      .limit(1);

    if (!statsData.length) {
      // If no stats found, return default/initial stats.
      // This can happen for newly created users before their stats are populated.
      const defaultStats = {
        currentLevel: 1,
        nextLevel: 2,
        minutesLeft: 0,
        progressPercentage: 0,
        totalMinutes: 0,
        achievements: 0,
        streakDays: 0,
        lessonsCompleted: 0,
      };
      return NextResponse.json(defaultStats);
    }

    return NextResponse.json(statsData[0]);
  } catch (error) {
    if ((error as Error).message === "User not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}
