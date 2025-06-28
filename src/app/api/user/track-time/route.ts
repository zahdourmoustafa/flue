import { NextResponse } from "next/server";
import { db } from "@/db";
import { userStats } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/server-auth";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    const { duration } = await request.json();

    if (typeof duration !== "number" || duration < 0) {
      return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
    }

    const durationInMinutes = Math.ceil(duration / 60);

    await db
      .update(userStats)
      .set({
        totalMinutes: sql`${userStats.totalMinutes} + ${durationInMinutes}`,
        updatedAt: new Date(),
      })
      .where(eq(userStats.userId, user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as Error).message.includes("User not authenticated")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error tracking time:", error);
    return NextResponse.json(
      { error: "Failed to track time" },
      { status: 500 }
    );
  }
}
