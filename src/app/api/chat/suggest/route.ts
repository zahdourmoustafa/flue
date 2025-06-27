import { NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  validateUserLearningLanguage,
} from "@/lib/server-auth";
import { generateSuggestedAnswer } from "@/lib/openai";

export async function POST(request: Request) {
  console.log("🤖 Suggest answer API called");

  try {
    // Get request body
    const { lastAiMessage, conversationHistory } = await request.json();

    if (!lastAiMessage) {
      return NextResponse.json(
        { success: false, error: "No AI message provided for suggestion" },
        { status: 400 }
      );
    }

    console.log("🔍 Getting authenticated user...");

    // Get authenticated user
    const user = await getAuthenticatedUser();
    console.log("✅ User authenticated:", {
      id: user.id,
      learningLanguage: user.learningLanguage,
    });

    // Validate user has learning language set
    console.log("🔍 Validating learning language...");
    const learningLanguage = validateUserLearningLanguage(user);
    console.log("✅ Learning language validated:", learningLanguage);

    // Generate suggested answer using OpenAI
    console.log("🤖 Generating suggested answer with OpenAI...");
    console.log("📝 Last AI message:", lastAiMessage.substring(0, 100) + "...");

    const suggestedAnswer = await generateSuggestedAnswer(
      lastAiMessage,
      learningLanguage,
      conversationHistory || []
    );

    console.log(
      "✅ Suggested answer generated:",
      suggestedAnswer.substring(0, 50) + "..."
    );

    return NextResponse.json({
      success: true,
      data: {
        suggestedAnswer,
      },
    });
  } catch (error) {
    console.error("❌ Error in suggest answer API:", error);

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
      { success: false, error: "Failed to generate suggested answer" },
      { status: 500 }
    );
  }
}
