import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  validateUserLearningLanguage,
} from "@/lib/server-auth";
import { generateDialogueSuggestedAnswer } from "@/lib/dialogue-openai";
import { getDialogueConfig } from "@/lib/dialogue-config";
import { z } from "zod";

const dialogueSuggestSchema = z.object({
  lastAiMessage: z.string().min(1, "AI message is required"),
  scenarioId: z.string().min(1, "Scenario ID is required"),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Validate user has learning language set
    const learningLanguage = validateUserLearningLanguage(user);

    // Parse and validate request body
    const body = await request.json();
    const { lastAiMessage, scenarioId, conversationHistory } =
      dialogueSuggestSchema.parse(body);

    // Get dialogue configuration
    const dialogueConfig = getDialogueConfig(scenarioId);
    if (!dialogueConfig) {
      return NextResponse.json(
        { success: false, error: "Invalid scenario ID" },
        { status: 400 }
      );
    }

    // Generate suggested answer using dialogue context
    const suggestedAnswer = await generateDialogueSuggestedAnswer(
      lastAiMessage,
      learningLanguage,
      dialogueConfig,
      conversationHistory
    );

    return NextResponse.json({
      success: true,
      data: { suggestedAnswer },
    });
  } catch (error) {
    console.error("Error generating dialogue suggestion:", error);

    if (error instanceof Error) {
      if (error.message === "User not authenticated") {
        return NextResponse.json(
          { success: false, error: "Authentication required" },
          { status: 401 }
        );
      }

      if (
        error.message === "User must set a learning language before using chat"
      ) {
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
    }

    return NextResponse.json(
      { success: false, error: "Failed to generate suggestion" },
      { status: 500 }
    );
  }
}
