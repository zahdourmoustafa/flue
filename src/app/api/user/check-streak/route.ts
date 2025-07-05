import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { checkAndUpdateStreak } from "@/lib/streak-utils";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { totalMinutes } = await request.json();

    const result = await checkAndUpdateStreak(user.id, totalMinutes);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error checking streak:", error);
    return NextResponse.json(
      { error: "Failed to check streak" },
      { status: 500 }
    );
  }
}
