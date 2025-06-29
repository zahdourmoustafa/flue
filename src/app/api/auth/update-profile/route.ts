import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, userStats } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const POST = async (req: Request) => {
  try {
    const { userId, learningLanguage, languageLevel } = await req.json();

    if (!userId || !learningLanguage || !languageLevel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await db
      .update(user)
      .set({
        learningLanguage,
        languageLevel,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    const stats = await db.query.userStats.findFirst({
      where: eq(userStats.userId, userId),
    });

    if (!stats) {
      await db.insert(userStats).values({
        id: uuidv4(),
        userId: userId,
      });
    }

    return NextResponse.json(
      { message: "User profile updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating user profile:", err);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
};
