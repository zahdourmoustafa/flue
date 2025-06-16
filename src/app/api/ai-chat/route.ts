import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "deepseek/deepseek-chat"; // DeepSeek model via OpenRouter

export async function POST(request: NextRequest) {
  try {
    const { message, conversation } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Build conversation context for the AI
    const messages = [
      {
        role: "system",
        content: `You are a friendly English teacher AI. Your goal is to help users practice English conversation in a natural, engaging way. 

Guidelines:
- Keep responses conversational and encouraging
- Mix English and Spanish when helpful for learning
- Ask follow-up questions to keep the conversation going
- Gently correct mistakes in a helpful way
- Use simple, clear language appropriate for language learners
- Be enthusiastic and supportive
- Keep responses to 1-2 sentences max for natural conversation flow`,
      },
      // Add previous conversation messages
      ...conversation.map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      // Add current user message
      {
        role: "user",
        content: message,
      },
    ];

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "Flue AI Chat",
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          temperature: 0.7,
          max_tokens: 150,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        }),
      }
    );

    if (!response.ok) {
      console.error("OpenRouter API error:", await response.text());
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const reply =
      data.choices[0]?.message?.content ||
      "Sorry, I didn't understand that. Could you try again?";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
