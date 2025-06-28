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

CRITICAL CONVERSATION RULES:
1. Keep responses VERY SHORT: Maximum 1-2 sentences
2. PROGRESS the conversation naturally - don't repeat the same topics
3. If the same topic has been discussed, introduce NEW related topics
4. Ask different types of questions to keep it interesting
5. Act naturally as ${dialogueConfig.aiPersona.name} would in real life
6. Use simple vocabulary appropriate for language learners

CONVERSATION PROGRESSION:
- Start with basics, then naturally move to related topics
- Vary your questions and responses
- Don't get stuck on one item or topic
- Think about what would happen next in a real conversation

For error correction, you should identify:
- Spelling mistakes
- Grammar errors
- Wrong verb conjugations
- Missing accents or punctuation
- Vocabulary usage issues

Remember: You are ${dialogueConfig.aiPersona.name}, a ${dialogueConfig.aiPersona.role}. 
Stay in character throughout the conversation while being helpful with language learning.
MOST IMPORTANT: Keep responses SHORT and PROGRESS the conversation naturally.`;
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
          content: `Start this ${dialogueConfig.title.toLowerCase()} scenario naturally. Be brief and welcoming. Maximum 1-2 sentences.`,
        },
      ],
      max_tokens: 60, // Reduced from 150 to force shorter initial messages
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

    // Add conversation history (keep last 6 messages for context)
    const recentHistory = conversationHistory.slice(-6);
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

    // Get AI response with stricter constraints
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      max_tokens: 100, // Reduced from 300 to force shorter responses
      temperature: 0.7,
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

  const systemPrompt = `You are responding as a language learner in a ${dialogueConfig.title.toLowerCase()} scenario.

CONTEXT: ${dialogueConfig.context}
YOUR ROLE: You are the customer/person in this ${dialogueConfig.title.toLowerCase()} situation
AI'S ROLE: ${dialogueConfig.aiPersona.name} is a ${
    dialogueConfig.aiPersona.role
  }

CRITICAL INSTRUCTIONS:
- Respond ONLY with what the learner should say - NO meta-commentary
- NO phrases like "Sure, it's a good response" or "Here's what you could say"
- Give DIRECT dialogue that fits the scenario naturally
- Keep it short: 1-2 sentences maximum
- Use beginner-intermediate ${fullLanguageName} vocabulary
- Sound natural for this specific situation

AI just said: "${aiQuestion}"

Respond directly as the learner would in this conversation:`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: "What should I say in response?",
        },
      ],
      max_tokens: 80, // Reduced to force shorter suggestions
      temperature: 0.6,
    });

    const suggestedAnswer = completion.choices[0]?.message?.content?.trim();

    if (!suggestedAnswer) {
      throw new Error("Failed to generate suggested answer");
    }

    // Remove any meta-commentary that might slip through
    const cleanAnswer = suggestedAnswer
      .replace(
        /^(Sure,?|Here's what you could say:?|You could respond:?|A good response would be:?)/i,
        ""
      )
      .replace(/^(It's a good response for.*?\.)/i, "")
      .trim();

    return cleanAnswer || suggestedAnswer;
  } catch (error) {
    console.error("Error generating dialogue suggested answer:", error);
    throw error;
  }
}
