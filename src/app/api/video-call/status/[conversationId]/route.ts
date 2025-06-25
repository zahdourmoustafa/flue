import { NextRequest, NextResponse } from "next/server";
import { tavusAPI } from "@/services/tavus-api";

export async function GET(
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

    // Get conversation details from Tavus
    const conversation = await tavusAPI.getConversation(conversationId);

    return NextResponse.json({
      conversation_id: conversation.conversation_id,
      status: conversation.status,
    });
  } catch (error) {
    console.error("Status check error:", error);

    return NextResponse.json(
      {
        error: "Failed to check conversation status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
