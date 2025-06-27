import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Another question API called");

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
    const { conversationHistory = [] } = await request.json();

    // Validate OpenAI API key
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      console.log("❌ OpenAI API key not configured");
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    console.log("🤖 Generating new question with OpenAI...");

    // Determine the language for the AI to speak
    const aiLanguage = learningLanguage === "es" ? "Spanish" : "English";
    const userNativeLanguage =
      learningLanguage === "es" ? "English" : "Spanish";

    // Create conversation context
    const conversationContext =
      conversationHistory.length > 0
        ? `Based on our conversation so far: ${conversationHistory
            .slice(-4)
            .map((msg: any) => `${msg.role}: ${msg.content}`)
            .join("\n")}`
        : "This is the start of our conversation.";

    const prompt = `You are Emma, a friendly and encouraging language teacher. Generate a new question or topic to continue the conversation in ${aiLanguage}.

Context: ${conversationContext}

Guidelines:
- Ask engaging questions that encourage conversation practice
- Keep the language appropriate for language learners
- Be encouraging and supportive
- Ask about different topics like hobbies, daily life, culture, food, travel, etc.
- Make questions open-ended to encourage longer responses
- Vary the complexity appropriately for language practice
- Keep it conversational and natural
- If this is a follow-up, build on what we've discussed or introduce a new interesting topic

Generate a single question or topic starter that will encourage the user to practice their ${aiLanguage}.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Emma, a friendly and encouraging language teacher who specializes in teaching ${aiLanguage}. You always respond in ${aiLanguage} and create engaging conversation opportunities for language learners.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    const newQuestion = completion.choices[0]?.message?.content?.trim();

    if (!newQuestion) {
      console.log("❌ No question generated");
      return NextResponse.json(
        { error: "Failed to generate question" },
        { status: 500 }
      );
    }

    console.log(
      "✅ New question generated:",
      newQuestion.substring(0, 100) + "..."
    );

    return NextResponse.json({
      success: true,
      data: {
        newQuestion,
        language: aiLanguage,
      },
    });
  } catch (error) {
    console.error("❌ Another question API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
