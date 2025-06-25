import { NextRequest, NextResponse } from "next/server";

interface CreateTalkRequest {
  presenterId: string;
  audioUrl?: string;
  text?: string;
  language?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { presenterId, audioUrl, text, language }: CreateTalkRequest =
      await request.json();

    if (!presenterId || (!audioUrl && !text)) {
      return NextResponse.json(
        { error: "Presenter ID and either audio URL or text are required" },
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

    console.log("🎬 Creating D-ID clip with:", { presenterId, audioUrl, text });

    // Prepare script based on input type
    let script;
    if (text) {
      script = {
        type: "text",
        input: text,
        provider: {
          type: "elevenlabs",
          voice_id: "pNInz6obpgDQGcFmaJgB", // Default ElevenLabs voice
        },
      };
    } else {
      script = {
        type: "audio",
        audio_url: audioUrl,
      };
    }

    // Create talking video with D-ID API using Clips endpoint for Premium Presenters
    const response = await fetch("https://api.d-id.com/clips", {
      method: "POST",
      headers: {
        Authorization: `Basic ${DID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        presenter_id: presenterId,
        script,
        config: {
          fluent: false,
          pad_audio: 0.0,
        },
      }),
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
    console.log("✅ D-ID clip created:", data.id);

    return NextResponse.json({
      talkId: data.id,
      status: data.status,
    });
  } catch (error) {
    console.error("❌ Error creating D-ID talk:", error);
    return NextResponse.json(
      { error: "Failed to create talking video" },
      { status: 500 }
    );
  }
}
