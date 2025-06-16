import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    console.log("🌐 Translation API called");

    // Get authenticated user
    console.log("🔍 Getting authenticated user...");
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      console.log("❌ User not authenticated");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log("✅ User authenticated:", {
      id: session.user.id,
      learningLanguage: session.user.learningLanguage,
    });

    // Validate learning language
    const learningLanguage = session.user.learningLanguage;
    if (!learningLanguage) {
      console.log("❌ No learning language set");
      return NextResponse.json(
        { error: "Learning language not set" },
        { status: 400 }
      );
    }

    console.log("🔍 Validating learning language...");
    console.log("✅ Learning language validated:", learningLanguage);

    // Parse request body
    const { text, from, to } = await request.json();

    if (!text) {
      console.log("❌ No text provided for translation");
      return NextResponse.json(
        { error: "Text is required for translation" },
        { status: 400 }
      );
    }

    console.log("📝 Text to translate:", text.substring(0, 100) + "...");
    console.log("🔄 Translation direction:", `${from} → ${to}`);

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.log("❌ OpenAI API key not configured");
      return NextResponse.json(
        { error: "Translation service not configured" },
        { status: 500 }
      );
    }

    console.log("🤖 Generating translation with OpenAI...");

    // Create translation prompt
    const prompt = `You are a professional translator. Translate the following text from ${from} to ${to}. 
    
    Important guidelines:
    - Provide only the translation, no explanations
    - Maintain the tone and style of the original
    - Keep the meaning accurate and natural
    - If translating from Spanish to English, use clear, simple English
    - If translating from English to Spanish, use proper Spanish grammar
    
    Text to translate: "${text}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional translator that provides accurate, natural translations between languages.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const translation = completion.choices[0]?.message?.content?.trim();

    if (!translation) {
      console.log("❌ No translation generated");
      return NextResponse.json(
        { error: "Failed to generate translation" },
        { status: 500 }
      );
    }

    console.log(
      "✅ Translation generated:",
      translation.substring(0, 100) + "..."
    );

    return NextResponse.json({
      success: true,
      data: {
        translation,
        originalText: text,
        from,
        to,
      },
    });
  } catch (error) {
    console.error("❌ Translation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
