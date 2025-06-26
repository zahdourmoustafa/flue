import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// Voice IDs for different languages and genders
const VOICE_CONFIG = {
  english: {
    female: "EXAVITQu4vr4xnSDxMaL", // Sarah - soft, young female (American)
  },
  spanish: {
    female: "ajOR9IDAaubDK5qtLUqQ", // Mimi - Spanish female voice
  },
};

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    console.log("🗣️ TTS API called");

    if (!process.env.ELEVENLABS_API_KEY) {
      console.log("❌ ElevenLabs API key not found");
      return NextResponse.json(
        { error: "ElevenLabs API key not configured" },
        { status: 500 }
      );
    }

    const { text, language } = await request.json();

    if (!text || !language) {
      console.log("❌ Missing required parameters");
      return NextResponse.json(
        { error: "Text and language are required" },
        { status: 400 }
      );
    }

    console.log("🎙️ Generating speech:", {
      text: text.substring(0, 50) + "...",
      language,
    });

    // Get voice ID based on language
    const voiceId = VOICE_CONFIG[language as keyof typeof VOICE_CONFIG]?.female;

    if (!voiceId) {
      console.log("❌ Invalid language");
      return NextResponse.json(
        { error: "Invalid language specified" },
        { status: 400 }
      );
    }

    // Generate speech using ElevenLabs
    try {
      const audioStream = await elevenlabs.textToSpeech.stream(voiceId, {
        text,
        modelId: "eleven_flash_v2_5", // Lowest latency model
        outputFormat: "mp3_44100_128",
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.8,
          style: 0.2,
          useSpeakerBoost: true,
          speed: 1.0,
        },
      });

      // Convert stream to buffer
      const chunks: Buffer[] = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);

      console.log("✅ Speech generated successfully");

      // Return audio as response
      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": audioBuffer.length.toString(),
          "Cache-Control": "no-cache",
        },
      });
    } catch (elevenLabsError) {
      console.error("❌ ElevenLabs TTS Error:", elevenLabsError);

      // If Spanish voice fails, try fallback to English voice
      if (language === "spanish") {
        console.log("🔄 Falling back to English voice for Spanish text");
        try {
          const fallbackVoiceId = VOICE_CONFIG.english.female;
          const audioStream = await elevenlabs.textToSpeech.stream(
            fallbackVoiceId,
            {
              text,
              modelId: "eleven_flash_v2_5",
              outputFormat: "mp3_44100_128",
              voiceSettings: {
                stability: 0.5,
                similarityBoost: 0.8,
                style: 0.2,
                useSpeakerBoost: true,
                speed: 1.0,
              },
            }
          );

          const chunks: Buffer[] = [];
          for await (const chunk of audioStream) {
            chunks.push(chunk);
          }
          const audioBuffer = Buffer.concat(chunks);

          console.log("✅ Speech generated with fallback voice");

          return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Length": audioBuffer.length.toString(),
              "Cache-Control": "no-cache",
            },
          });
        } catch (fallbackError) {
          console.error("❌ Fallback voice also failed:", fallbackError);
          throw elevenLabsError;
        }
      } else {
        throw elevenLabsError;
      }
    }
  } catch (error) {
    console.error("❌ TTS API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
