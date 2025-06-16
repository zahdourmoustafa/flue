import { NextRequest, NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

const serverClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_SECRET!
);

export async function POST(request: NextRequest) {
  try {
    // Debug environment variables
    console.log(
      "API Key:",
      process.env.NEXT_PUBLIC_STREAM_API_KEY ? "Set" : "Missing"
    );
    console.log("Secret:", process.env.STREAM_SECRET ? "Set" : "Missing");

    const { userId, userName, userImage } = await request.json();

    if (!userId || !userName) {
      return NextResponse.json(
        { error: "User ID and name are required" },
        { status: 400 }
      );
    }

    // Generate token for the user
    const token = serverClient.createToken(userId);

    // Update or create user in Stream
    await serverClient.upsertUser({
      id: userId,
      name: userName,
      image:
        userImage ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          userName
        )}&background=25D366&color=fff&size=128`,
    });

    return NextResponse.json({
      token,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
    });
  } catch (error) {
    console.error("Stream token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
