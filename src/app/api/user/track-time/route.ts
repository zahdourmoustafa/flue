import { NextResponse } from "next/server";
import { db } from "@/db";
import { userStats } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { duration, feature } = await request.json();

    if (typeof duration !== "number" || duration < 0) {
      return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
    }

    if (duration < 1) {
      return NextResponse.json({
        success: true,
        message: "Time too short to track",
      });
    }

    const durationInMinutes = Math.ceil(duration / 60);

    const existingStats = await db.query.userStats.findFirst({
      where: eq(userStats.userId, user.id),
    });

    if (existingStats) {
      await db
        .update(userStats)
        .set({
          totalMinutes: sql`${userStats.totalMinutes} + ${durationInMinutes}`,
          updatedAt: new Date(),
        })
        .where(eq(userStats.userId, user.id));
    } else {
      await db.insert(userStats).values({
        id: uuidv4(),
        userId: user.id,
        totalMinutes: durationInMinutes,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log(
      `Time tracked for user ${user.id}: ${durationInMinutes} minutes in ${
        feature || "unknown"
      } mode`
    );

    return NextResponse.json({
      success: true,
      tracked: {
        minutes: durationInMinutes,
        feature: feature || "unknown",
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("User not authenticated")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error tracking time:", error);
    return NextResponse.json(
      { error: "Failed to track time" },
      { status: 500 }
    );
  }
}
