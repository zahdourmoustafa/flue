import { NextRequest, NextResponse } from "next/server";
import { tavusAPI } from "@/services/tavus-api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    console.log("Cleaning up conversation:", conversationId);

    try {
      await tavusAPI.endConversation(conversationId);
      console.log("Successfully ended conversation:", conversationId);
    } catch (error) {
      console.error("Failed to end conversation during cleanup:", error);
      // Don't return error response for cleanup calls - just log it
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cleanup endpoint error:", error);
    // Return success even on error to avoid blocking sendBeacon
    return NextResponse.json({ success: true });
  }
}
