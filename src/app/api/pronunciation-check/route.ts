import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

interface PronunciationRequest {
  originalText: string;
  transcribedText: string;
  language: string;
}

interface WordScore {
  word: string;
  score: number;
  correct: boolean;
  suggestion?: string;
}

interface PronunciationFeedback {
  overallScore: number;
  wordScores: WordScore[];
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { originalText, transcribedText, language }: PronunciationRequest =
      await request.json();

    if (!originalText || !transcribedText || !language) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    console.log("🎯 Analyzing pronunciation:", {
      original: originalText,
      transcribed: transcribedText,
      language,
    });

    const languageMap: Record<string, string> = {
      english: "English",
      spanish: "Spanish",
      french: "French",
      german: "German",
    };

    const fullLanguageName = languageMap[language] || language;

    const systemPrompt = `You are an expert ${fullLanguageName} pronunciation teacher. Your task is to analyze a student's pronunciation by comparing what they were supposed to say with what they actually said (as transcribed by speech recognition).

Instructions:
1. Compare the original text with the transcribed text word by word
2. Identify pronunciation errors, missing words, or added words
3. Consider that speech recognition isn't perfect - focus on significant pronunciation issues
4. Provide constructive feedback with specific improvement suggestions
5. Calculate pronunciation scores (0-100) for each word and overall

IMPORTANT: Respond with valid JSON only. No markdown, no explanation outside the JSON.

Response format:
{
  "overallScore": number (0-100),
  "wordScores": [
    {
      "word": "original word",
      "score": number (0-100),
      "correct": boolean,
      "suggestion": "optional improvement tip"
    }
  ],
  "feedback": "Main feedback message (2-3 sentences)",
  "strengths": ["positive aspects of pronunciation"],
  "improvements": ["specific areas to work on"]
}

Scoring guidelines:
- 90-100: Excellent pronunciation
- 80-89: Good pronunciation with minor issues
- 70-79: Fair pronunciation, needs some work
- 60-69: Poor pronunciation, significant issues
- Below 60: Very poor pronunciation, major problems

Original text: "${originalText}"
Transcribed text: "${transcribedText}"`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Please analyze the pronunciation and provide feedback in JSON format.`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
      temperature: 0.3,
    });

    const responseContent = completion.choices[0]?.message?.content?.trim();

    if (!responseContent) {
      throw new Error("Failed to get OpenAI response");
    }

    try {
      const feedback: PronunciationFeedback = JSON.parse(responseContent);

      // Validate the response structure
      if (
        !feedback.overallScore ||
        !feedback.wordScores ||
        !feedback.feedback
      ) {
        throw new Error("Invalid response structure from OpenAI");
      }

      console.log("✅ Pronunciation analysis complete:", {
        score: feedback.overallScore,
        wordCount: feedback.wordScores.length,
      });

      return NextResponse.json(feedback);
    } catch (parseError) {
      console.error("❌ Failed to parse OpenAI response:", responseContent);

      // Fallback: Generate basic feedback
      const words = originalText.split(" ");
      const transcribedWords = transcribedText.split(" ");

      const wordScores: WordScore[] = words.map((word, index) => {
        const transcribedWord = transcribedWords[index];
        const isCorrect =
          transcribedWord &&
          transcribedWord.toLowerCase().replace(/[.,!?]/g, "") ===
            word.toLowerCase().replace(/[.,!?]/g, "");

        return {
          word: word.replace(/[.,!?]/g, ""),
          score: isCorrect ? 95 : 70,
          correct: isCorrect,
          suggestion: !isCorrect
            ? `Try pronouncing "${word}" more clearly`
            : undefined,
        };
      });

      const overallScore = Math.round(
        wordScores.reduce((sum, score) => sum + score.score, 0) /
          wordScores.length
      );

      const fallbackFeedback: PronunciationFeedback = {
        overallScore,
        wordScores,
        feedback: "Good effort! Keep practicing to improve your pronunciation.",
        strengths: ["Clear speech attempt"],
        improvements: ["Focus on word clarity", "Practice pronunciation"],
      };

      return NextResponse.json(fallbackFeedback);
    }
  } catch (error) {
    console.error("❌ Pronunciation check error:", error);
    return NextResponse.json(
      { error: "Failed to analyze pronunciation" },
      { status: 500 }
    );
  }
}
