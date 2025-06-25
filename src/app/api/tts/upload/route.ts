import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

interface UploadAudioRequest {
  audioData: string; // base64 encoded audio
  mimeType: string;
}

export async function POST(request: NextRequest) {
  try {
    const { audioData, mimeType }: UploadAudioRequest = await request.json();

    if (!audioData || !mimeType) {
      return NextResponse.json(
        { error: "Audio data and MIME type are required" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileId = uuidv4();
    const extension = mimeType.includes("wav") ? "wav" : "mp3";
    const filename = `${fileId}.${extension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "audio");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioData, "base64");

    // Save file
    const filePath = join(uploadsDir, filename);
    await writeFile(filePath, audioBuffer);

    // Return public URL
    const audioUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
    }/uploads/audio/${filename}`;

    console.log("📤 Audio uploaded:", audioUrl);

    return NextResponse.json({
      audioUrl,
      filename,
      size: audioBuffer.length,
    });
  } catch (error) {
    console.error("❌ Error uploading audio:", error);
    return NextResponse.json(
      { error: "Failed to upload audio" },
      { status: 500 }
    );
  }
}
