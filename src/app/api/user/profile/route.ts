import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";

export async function GET() {
  try {
    const authenticatedUser = await getAuthenticatedUser();

    return NextResponse.json({
      learningLanguage: authenticatedUser.learningLanguage,
      languageLevel: authenticatedUser.languageLevel,
      preferredLanguage: authenticatedUser.preferredLanguage,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("User not authenticated")) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
      
      if (error.message.includes("User not found")) {
        return NextResponse.json({ error: "User profile not found" }, { status: 404 });
      }
    }
    
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
} 