import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, userStats } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const POST = async (req: Request) => {
  try {
    const {
      userId,
      learningLanguage,
      languageLevel,
      translationLanguage,
      preferredLanguage,
    } = await req.json();

    console.log("Profile update request:", {
      userId,
      learningLanguage,
      languageLevel,
      translationLanguage,
      preferredLanguage,
    });

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Build update object dynamically based on provided fields
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (learningLanguage !== undefined) {
      updateData.learningLanguage = learningLanguage;
    }
    if (languageLevel !== undefined) {
      updateData.languageLevel = languageLevel;
    }
    if (translationLanguage !== undefined) {
      updateData.translationLanguage = translationLanguage;
    }
    if (preferredLanguage !== undefined) {
      updateData.preferredLanguage = preferredLanguage;
    }

    console.log("Updating user profile with data:", updateData);

    const result = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, userId));

    console.log("Profile update result:", result);

    const stats = await db.query.userStats.findFirst({
      where: eq(userStats.userId, userId),
    });

    if (!stats) {
      await db.insert(userStats).values({
        id: uuidv4(),
        userId: userId,
      });
    }

    // Return the updated data for verification
    const updatedUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
      columns: {
        id: true,
        learningLanguage: true,
        languageLevel: true,
        preferredLanguage: true,
        translationLanguage: true,
      },
    });

    console.log("✅ Profile updated successfully:", updatedUser);

    return NextResponse.json(
      {
        message: "User profile updated successfully",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error updating user profile:", err);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
};
