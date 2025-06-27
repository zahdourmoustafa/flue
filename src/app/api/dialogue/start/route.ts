import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  validateUserLearningLanguage,
} from "@/lib/server-auth";
import { generateDialogueInitialMessage } from "@/lib/dialogue-openai";
import { getDialogueConfig } from "@/lib/dialogue-config";
import { z } from "zod";

const dialogueStartSchema = z.object({
  scenarioId: z.string().min(1, "Scenario ID is required"),
});

export async function POST(request: NextRequest) {
  console.log("🚀 Dialogue start API called");

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

    // Parse and validate request body
    const body = await request.json();
    const { scenarioId } = dialogueStartSchema.parse(body);

    // Get dialogue configuration
    const dialogueConfig = getDialogueConfig(scenarioId);
    if (!dialogueConfig) {
      return NextResponse.json(
        { success: false, error: "Invalid scenario ID" },
        { status: 400 }
      );
    }

    console.log("🎭 Starting dialogue for scenario:", dialogueConfig.title);

    // Generate initial greeting using scenario configuration
    console.log("🤖 Generating initial greeting with OpenAI...");
    const greeting = await generateDialogueInitialMessage(
      dialogueConfig,
      learningLanguage
    );
    console.log(
      "✅ Initial greeting generated:",
      greeting.substring(0, 50) + "..."
    );

    const responseData = {
      sessionId: `dialogue_${scenarioId}_${Date.now()}_${user.id}`,
      userId: user.id,
      scenarioId,
      learningLanguage,
      initialMessage: greeting,
      user: {
        name: user.name,
        learningLanguage: user.learningLanguage,
        languageLevel: user.languageLevel,
      },
      scenario: {
        id: dialogueConfig.id,
        title: dialogueConfig.title,
        aiPersona: dialogueConfig.aiPersona,
        context: dialogueConfig.context,
      },
    };

    console.log("✅ Dialogue start successful, returning data");

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("❌ Error in dialogue start API:", error);

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

      if (error.name === "ZodError") {
        return NextResponse.json(
          { success: false, error: "Invalid request data" },
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
      { success: false, error: "Failed to start dialogue session" },
      { status: 500 }
    );
  }
}
