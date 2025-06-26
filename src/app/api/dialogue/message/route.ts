import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  validateUserLearningLanguage,
} from "@/lib/server-auth";
import { processDialogueUserMessage } from "@/lib/dialogue-openai";
import { getDialogueConfig } from "@/lib/dialogue-config";
import { z } from "zod";

const dialogueMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message too long"),
  sessionId: z.string().min(1, "Session ID is required"),
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
    const { message, sessionId, scenarioId, conversationHistory } =
      dialogueMessageSchema.parse(body);

    // Validate session belongs to user (basic check)
    if (!sessionId.includes(user.id) || !sessionId.includes(scenarioId)) {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 400 }
      );
    }

    // Get dialogue configuration
    const dialogueConfig = getDialogueConfig(scenarioId);
    if (!dialogueConfig) {
      return NextResponse.json(
        { success: false, error: "Invalid scenario ID" },
        { status: 400 }
      );
    }

    // Process user message with OpenAI using dialogue context
    const chatResponse = await processDialogueUserMessage(
      message,
      learningLanguage,
      dialogueConfig,
      conversationHistory
    );

    return NextResponse.json({
      success: true,
      data: {
        aiResponse: chatResponse.message,
        hasErrors: chatResponse.hasErrors,
        correctedMessage: chatResponse.correctedMessage,
        explanation: chatResponse.explanation,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error processing dialogue message:", error);

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
      { success: false, error: "Failed to process message" },
      { status: 500 }
    );
  }
}
