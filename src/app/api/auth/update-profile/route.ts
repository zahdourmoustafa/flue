import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      learningLanguage,
      languageLevel,
      preferredLanguage,
      translationLanguage,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (learningLanguage !== undefined)
      updateData.learningLanguage = learningLanguage;
    if (languageLevel !== undefined) updateData.languageLevel = languageLevel;
    if (preferredLanguage !== undefined)
      updateData.preferredLanguage = preferredLanguage;
    if (translationLanguage !== undefined)
      updateData.translationLanguage = translationLanguage;

    // Update user with provided fields
    await db.update(user).set(updateData).where(eq(user.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
