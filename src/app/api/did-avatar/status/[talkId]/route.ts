import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: {
    talkId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { talkId } = params;

    if (!talkId) {
      return NextResponse.json(
        { error: "Talk ID is required" },
        { status: 400 }
      );
    }

    const DID_API_KEY = process.env.DID_API_KEY;
    if (!DID_API_KEY) {
      console.error("❌ D-ID API key not found in environment variables");
      return NextResponse.json(
        { error: "D-ID API key not configured" },
        { status: 500 }
      );
    }

    console.log("📊 Checking D-ID talk status:", talkId);

    // Get clip status from D-ID API
    const response = await fetch(`https://api.d-id.com/clips/${talkId}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${DID_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ D-ID API error:", response.status, errorText);

      return NextResponse.json(
        { error: `D-ID API error: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("📊 D-ID talk status:", data.status);

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error checking D-ID talk status:", error);
    return NextResponse.json(
      { error: "Failed to check video status" },
      { status: 500 }
    );
  }
}
