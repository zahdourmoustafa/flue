import { NextRequest, NextResponse } from "next/server";
import { tavusAPI } from "@/services/tavus-api";

export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { conversationId } = params;

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    // End conversation with Tavus
    await tavusAPI.endConversation(conversationId);

    return NextResponse.json({
      success: true,
      conversation_id: conversationId,
      ended_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Video call end error:", error);

    return NextResponse.json(
      {
        error: "Failed to end video call",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
