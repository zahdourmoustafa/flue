import { headers } from "next/headers";
import { auth } from "./auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  learningLanguage: string | null;
  languageLevel: string | null;
  preferredLanguage: string;
}

/**
 * Gets the current authenticated user from the session
 * Throws an error if user is not authenticated
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser> {
  try {
    const session = await auth.api.getSession({
      headers: headers(),
    });

    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    // Get full user data from database
    const userData = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        learningLanguage: user.learningLanguage,
        languageLevel: user.languageLevel,
        preferredLanguage: user.preferredLanguage,
      })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!userData.length) {
      throw new Error("User not found in database");
    }

    const userInfo = userData[0];

    return {
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      learningLanguage: userInfo.learningLanguage,
      languageLevel: userInfo.languageLevel,
      preferredLanguage: userInfo.preferredLanguage || "en",
    };
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    throw new Error("Failed to authenticate user");
  }
}

/**
 * Validates that user has a learning language set
 */
export function validateUserLearningLanguage(user: AuthenticatedUser): string {
  if (!user.learningLanguage) {
    throw new Error("User must set a learning language before using chat");
  }
  return user.learningLanguage;
}
