import OpenAI from "openai";
import { DialogueScenario } from "@/types/dialogue";
import { ChatResponse } from "./openai";

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  throw new Error(
    "NEXT_PUBLIC_OPENAI_API_KEY environment variable is required"
  );
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Creates a system prompt for a dialogue scenario
 */
export function createDialogueSystemPrompt(
  dialogueConfig: DialogueScenario,
  learningLanguage: string
): string {
  const languageMap: Record<string, string> = {
    es: "Spanish",
    en: "English",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
  };

  const fullLanguageName = languageMap[learningLanguage] || learningLanguage;

  // Replace {language} placeholder in the scenario's system prompt
  const customizedPrompt = dialogueConfig.systemPrompt.replace(
    /{language}/g,
    fullLanguageName
  );

  return `${customizedPrompt}

CONTEXT: ${dialogueConfig.context}

For error correction, you should identify:
- Spelling mistakes
- Grammar errors
- Wrong verb conjugations
- Missing accents or punctuation
- Vocabulary usage issues

Remember: You are ${dialogueConfig.aiPersona.name}, a ${dialogueConfig.aiPersona.role}. 
Stay in character throughout the conversation while being helpful with language learning.`;
}

/**
 * Generates initial message for a dialogue scenario
 */
export async function generateDialogueInitialMessage(
  dialogueConfig: DialogueScenario,
  learningLanguage: string
): Promise<string> {
  const systemPrompt = createDialogueSystemPrompt(
    dialogueConfig,
    learningLanguage
  );

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Please start this ${dialogueConfig.title.toLowerCase()} scenario. You should introduce yourself as ${
            dialogueConfig.aiPersona.name
          } and begin the conversation naturally according to your role as ${
            dialogueConfig.aiPersona.role
          }.`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const generatedMessage = response.choices[0]?.message?.content;

    // If AI generation fails, use the configured initial message
    return generatedMessage || dialogueConfig.initialMessage;
  } catch (error) {
    console.error("Error generating dialogue initial message:", error);
    // Fallback to configured initial message
    return dialogueConfig.initialMessage;
  }
}

/**
 * Processes user message in a dialogue scenario context
 */
export async function processDialogueUserMessage(
  userMessage: string,
  learningLanguage: string,
  dialogueConfig: DialogueScenario,
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }> = []
): Promise<ChatResponse> {
  const systemPrompt = createDialogueSystemPrompt(
    dialogueConfig,
    learningLanguage
  );

  try {
    // Build conversation context
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history (keep last 8 messages for context)
    const recentHistory = conversationHistory.slice(-8);
    recentHistory.forEach((msg) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    // Add current user message
    messages.push({
      role: "user",
      content: userMessage,
    });

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      max_tokens: 300,
      temperature: 0.8, // Slightly higher for more natural dialogue
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Analyze the user's message for errors
    const errorAnalysis = await analyzeDialogueMessageForErrors(
      userMessage,
      learningLanguage,
      dialogueConfig
    );

    return {
      message: aiResponse,
      hasErrors: errorAnalysis.hasErrors,
      correctedMessage: errorAnalysis.correctedMessage,
      explanation: errorAnalysis.explanation,
    };
  } catch (error) {
    console.error("Error processing dialogue user message:", error);
    throw error;
  }
}

/**
 * Analyzes a user message for language errors in dialogue context
 */
async function analyzeDialogueMessageForErrors(
  userMessage: string,
  learningLanguage: string,
  dialogueConfig: DialogueScenario
): Promise<{
  hasErrors: boolean;
  correctedMessage?: string;
  explanation?: string;
}> {
  const languageMap: Record<string, string> = {
    es: "Spanish",
    en: "English",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
  };

  const fullLanguageName = languageMap[learningLanguage] || learningLanguage;

  const errorAnalysisPrompt = `You are an expert ${fullLanguageName} language teacher analyzing a student's message in a ${dialogueConfig.title.toLowerCase()} scenario.

CONTEXT: The student is ${dialogueConfig.context.toLowerCase()}

Student's message: "${userMessage}"

Analyze this message for:
1. Spelling mistakes
2. Grammar errors  
3. Wrong verb conjugations
4. Missing or incorrect accents/punctuation
5. Inappropriate vocabulary for this context
6. Unnatural expressions

IMPORTANT: Only flag actual errors, not stylistic preferences. Consider the context of ${dialogueConfig.title.toLowerCase()}.

If there are NO errors, respond with: NO_ERRORS

If there ARE errors, respond in this format:
CORRECTED: [the corrected version]
EXPLANATION: [brief explanation of what was wrong and why]`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: errorAnalysisPrompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.1, // Low temperature for consistent error analysis
    });

    const analysis = completion.choices[0]?.message?.content;
    if (!analysis) {
      return { hasErrors: false };
    }

    if (analysis.includes("NO_ERRORS")) {
      return { hasErrors: false };
    }

    // Parse the correction response
    const correctedMatch = analysis.match(/CORRECTED:\s*(.+)/);
    const explanationMatch = analysis.match(/EXPLANATION:\s*(.+)/);

    if (correctedMatch && explanationMatch) {
      return {
        hasErrors: true,
        correctedMessage: correctedMatch[1].trim(),
        explanation: explanationMatch[1].trim(),
      };
    }

    return { hasErrors: false };
  } catch (error) {
    console.error("Error analyzing dialogue message for errors:", error);
    return { hasErrors: false };
  }
}

/**
 * Generates a suggested answer for dialogue scenarios
 */
export async function generateDialogueSuggestedAnswer(
  aiQuestion: string,
  learningLanguage: string,
  dialogueConfig: DialogueScenario,
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }> = []
): Promise<string> {
  const languageMap: Record<string, string> = {
    es: "Spanish",
    en: "English",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
  };

  const fullLanguageName = languageMap[learningLanguage] || learningLanguage;

  const systemPrompt = `You are a helpful language learning assistant for a ${dialogueConfig.title.toLowerCase()} scenario.

CONTEXT: ${dialogueConfig.context}
SCENARIO: The student is practicing ${dialogueConfig.title.toLowerCase()}
AI ROLE: The AI is acting as ${dialogueConfig.aiPersona.name}, a ${
    dialogueConfig.aiPersona.role
  }

Generate a realistic response in ${fullLanguageName} that a language learner might give in this scenario.

Guidelines:
- Keep responses appropriate for the ${dialogueConfig.title.toLowerCase()} context
- Use vocabulary suitable for a language learner (beginner-intermediate level)
- Make it natural and conversational for this specific scenario
- Consider what a real person would say in this situation
- Response should be 1-3 sentences long

AI's question/statement: "${aiQuestion}"

Generate a good example response that fits this dialogue scenario.`;

  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add recent conversation context
    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-4);
      recentHistory.forEach((msg) => {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      });
    }

    messages.push({
      role: "user",
      content: `Please suggest a good response for a language learner in this ${dialogueConfig.title.toLowerCase()} scenario.`,
    });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    const suggestedAnswer = completion.choices[0]?.message?.content?.trim();

    if (!suggestedAnswer) {
      throw new Error("Failed to generate suggested answer");
    }

    return suggestedAnswer;
  } catch (error) {
    console.error("Error generating dialogue suggested answer:", error);
    throw error;
  }
}
