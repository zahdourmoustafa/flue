import { NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  validateUserLearningLanguage,
} from "@/lib/server-auth";
import { generateInitialGreeting } from "@/lib/openai";

export async function POST() {
  console.log("🚀 Chat start API called");

  try {
    console.log("🔍 Getting authenticated user...");

    // Get authenticated user
    const user = await getAuthenticatedUser();
    console.log("✅ User authenticated:", {
      id: user.id,
      email: user.email,
      learningLanguage: user.learningLanguage,
    });

    // Validate user has learning language set
    console.log("🔍 Validating learning language...");
    const learningLanguage = validateUserLearningLanguage(user);
    console.log("✅ Learning language validated:", learningLanguage);

    // Generate Emma's initial greeting
    console.log("🤖 Generating initial greeting with OpenAI...");
    const greeting = await generateInitialGreeting(learningLanguage);
    console.log(
      "✅ Initial greeting generated:",
      greeting.substring(0, 50) + "..."
    );

    const responseData = {
      sessionId: `session_${Date.now()}_${user.id}`,
      userId: user.id,
      learningLanguage,
      initialMessage: greeting,
      user: {
        name: user.name,
        learningLanguage: user.learningLanguage,
        languageLevel: user.languageLevel,
      },
    };

    console.log("✅ Chat start successful, returning data");

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("❌ Error in chat start API:", error);

    if (error instanceof Error) {
      console.error("❌ Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      if (error.message === "User not authenticated") {
        console.log("🔒 Authentication failure");
        return NextResponse.json(
          { success: false, error: "Authentication required" },
          { status: 401 }
        );
      }

      if (
        error.message === "User must set a learning language before using chat"
      ) {
        console.log("🌐 Learning language not set");
        return NextResponse.json(
          {
            success: false,
            error: "Please set your learning language in your profile first",
          },
          { status: 400 }
        );
      }

      if (error.message.includes("NEXT_PUBLIC_OPENAI_API_KEY")) {
        console.log("🔑 OpenAI API key missing");
        return NextResponse.json(
          { success: false, error: "AI service temporarily unavailable" },
          { status: 503 }
        );
      }
    }

    console.log("💥 Unknown error occurred");
    return NextResponse.json(
      { success: false, error: "Failed to start chat session" },
      { status: 500 }
    );
  }
}
