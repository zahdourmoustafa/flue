import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      text,
      targetLanguage,
      sourceLanguage = "english",
    }: TranslationRequest = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing required parameters: text and targetLanguage" },
        { status: 400 }
      );
    }

    console.log("🌐 Translating text:", {
      text: text.substring(0, 50) + "...",
      from: sourceLanguage,
      to: targetLanguage,
    });

    const languageMap: Record<string, string> = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
    };

    const sourceLanguageName = languageMap[sourceLanguage] || sourceLanguage;
    const targetLanguageName = languageMap[targetLanguage] || targetLanguage;

    const systemPrompt = `You are a professional translator. Your task is to translate text from ${sourceLanguageName} to ${targetLanguageName}.

Instructions:
1. Provide an accurate, natural translation
2. Maintain the tone and meaning of the original text
3. Use appropriate grammar and vocabulary for the target language
4. For language learning contexts, provide clear, simple translations
5. Return ONLY the translated text, nothing else

Original text (${sourceLanguageName}): "${text}"

Translate this to ${targetLanguageName}:`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Please translate: "${text}"`,
        },
      ],
      max_tokens: 200,
      temperature: 0.3, // Lower temperature for more consistent translations
    });

    const translation = completion.choices[0]?.message?.content?.trim();

    if (!translation) {
      throw new Error("Failed to get translation from OpenAI");
    }

    console.log("✅ Translation successful:", {
      original: text,
      translated: translation,
      language: targetLanguageName,
    });

    return NextResponse.json({
      translation,
      originalText: text,
      sourceLanguage: sourceLanguageName,
      targetLanguage: targetLanguageName,
    });
  } catch (error) {
    console.error("❌ Translation error:", error);

    // Fallback: return original text if translation fails
    const { text } = await request.json();
    return NextResponse.json(
      {
        translation: text, // Fallback to original text
        originalText: text,
        sourceLanguage: "english",
        targetLanguage: "english",
        error: "Translation failed, showing original text",
      },
      { status: 200 }
    ); // Return 200 to avoid breaking the UI
  }
}
