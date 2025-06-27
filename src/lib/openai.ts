import OpenAI from "openai";

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  throw new Error(
    "NEXT_PUBLIC_OPENAI_API_KEY environment variable is required"
  );
}

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface ChatResponse {
  message: string;
  hasErrors: boolean;
  correctedMessage?: string;
  explanation?: string;
}

export interface EmmaPersona {
  language: string;
  level: string;
  name: string;
}

/**
 * Creates a system prompt for Emma based on the user's learning language
 */
export function createEmmaSystemPrompt(learningLanguage: string): string {
  const languageMap: Record<string, string> = {
    es: "Spanish",
    en: "English",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
  };

  const fullLanguageName = languageMap[learningLanguage] || learningLanguage;

  return `You are Emma, an expert ${fullLanguageName} language teacher with a warm, encouraging personality. Your role is to:

1. ALWAYS respond in ${fullLanguageName} to help the student practice
2. Act as a supportive tutor who makes learning enjoyable
3. Correct mistakes gently but clearly when they occur
4. Keep your responses concise and to the point, ideally 1-3 sentences.
5. Engage in natural conversations while teaching

IMPORTANT RESPONSE FORMAT:
- If the student's message has NO errors: Respond naturally and concisely in ${fullLanguageName}
- If the student's message HAS errors: First acknowledge their attempt positively, then provide your response

For error correction, you should identify:
- Spelling mistakes
- Grammar errors
- Wrong verb conjugations
- Missing accents or punctuation
- Vocabulary usage issues

Keep conversations natural, encouraging, and educational. Ask follow-up questions to keep the dialogue flowing, but always aim for brevity to avoid overwhelming the learner.`;
}

/**
 * Generates a suggested answer to Emma's question
 */
export async function generateSuggestedAnswer(
  aiQuestion: string,
  learningLanguage: string,
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }> = []
): Promise<string> {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    throw new Error("NEXT_PUBLIC_OPENAI_API_KEY is not configured");
  }

  const languageMap: Record<string, string> = {
    es: "Spanish",
    en: "English",
    fr: "French",
    de: "German",
  };

  const fullLanguageName = languageMap[learningLanguage] || learningLanguage;

  const systemPrompt = `You are a helpful language learning assistant. Your task is to generate a realistic, appropriate response to the teacher's question that a language learner might give.

Guidelines:
- Generate a response in ${fullLanguageName}
- Keep the response simple and appropriate for a language learner (beginner-intermediate level)
- Make it realistic and natural - something a real student would say
- Use vocabulary and grammar appropriate for a language learner
- The response should be 1-3 sentences long
- Make it engaging and conversational
- Consider the conversation context if provided

Teacher's question: "${aiQuestion}"

Generate a good example response that a student learning ${fullLanguageName} might give. Just provide the response, nothing else.`;

  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation context if available (last few exchanges)
    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-4); // Last 4 messages for context
      recentHistory.forEach((msg) => {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      });
    }

    // Add the current question that needs a suggestion
    messages.push({
      role: "user",
      content: `Please suggest a good response to this question: "${aiQuestion}"`,
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
    console.error("Error generating suggested answer:", error);
    throw error;
  }
}

/**
 * Generates Emma's initial greeting message
 */
export async function generateInitialGreeting(
  learningLanguage: string
): Promise<string> {
  const systemPrompt = createEmmaSystemPrompt(learningLanguage);

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
          content:
            "Please introduce yourself as my language teacher and ask me what I'd like to talk about or learn today.",
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return (
      response.choices[0]?.message?.content ||
      "Hello! I'm Emma, your language teacher. What would you like to practice today?"
    );
  } catch (error) {
    console.error("Error generating initial greeting:", error);
    // Fallback greeting
    const greetings: Record<string, string> = {
      es: "¡Hola! Soy Emma, tu profesora personal de idiomas con IA. Pregúntame lo que quieras o haz clic en un tema abajo:",
      en: "Hello! I'm Emma, your AI language teacher. Ask me anything or click on a topic below:",
      fr: "Bonjour! Je suis Emma, votre professeur de langue IA. Demandez-moi ce que vous voulez ou cliquez sur un sujet ci-dessous:",
      de: "Hallo! Ich bin Emma, deine KI-Sprachlehrerin. Frag mich alles oder klicke auf ein Thema unten:",
    };

    return greetings[learningLanguage] || greetings["en"];
  }
}

/**
 * Processes user message and returns AI response with error correction
 */
export async function processUserMessage(
  userMessage: string,
  learningLanguage: string,
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }> = []
): Promise<ChatResponse> {
  const systemPrompt = createEmmaSystemPrompt(learningLanguage);

  try {
    // Build conversation context
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...conversationHistory.map(
        (msg) =>
          ({
            role: msg.role,
            content: msg.content,
          } as OpenAI.Chat.ChatCompletionMessageParam)
      ),
      {
        role: "user",
        content: `Please analyze this message for errors and respond naturally: "${userMessage}"`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse =
      response.choices[0]?.message?.content ||
      "I couldn't process your message. Please try again.";

    // Check for errors using a separate call for more accurate detection
    const errorAnalysis = await analyzeMessageForErrors(
      userMessage,
      learningLanguage
    );

    return {
      message: aiResponse,
      hasErrors: errorAnalysis.hasErrors,
      correctedMessage: errorAnalysis.correctedMessage,
      explanation: errorAnalysis.explanation,
    };
  } catch (error) {
    console.error("Error processing user message:", error);
    throw new Error("Failed to process message");
  }
}

/**
 * Analyzes user message specifically for language errors
 */
async function analyzeMessageForErrors(
  userMessage: string,
  learningLanguage: string
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
  };

  const fullLanguageName = languageMap[learningLanguage] || learningLanguage;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert ${fullLanguageName} grammar checker. Analyze the following message for errors:

1. If NO errors found: respond with exactly "NO_ERRORS"
2. If errors found: provide JSON response in this format:
{
  "hasErrors": true,
  "correctedMessage": "corrected version here",
  "explanation": "detailed explanation of mistakes here"
}

Focus on: spelling, grammar, punctuation, accents, verb conjugations, and word choice.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_tokens: 300,
      temperature: 0.1,
    });

    const analysisResult = response.choices[0]?.message?.content?.trim();

    if (analysisResult === "NO_ERRORS") {
      return { hasErrors: false };
    }

    try {
      const parsed = JSON.parse(analysisResult || "{}");
      return {
        hasErrors: parsed.hasErrors || false,
        correctedMessage: parsed.correctedMessage,
        explanation: parsed.explanation,
      };
    } catch {
      // If JSON parsing fails, assume no errors
      return { hasErrors: false };
    }
  } catch (error) {
    console.error("Error analyzing message for errors:", error);
    return { hasErrors: false };
  }
}

export async function getOpenAIEmbedding(text: string) {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    throw new Error("NEXT_PUBLIC_OPENAI_API_KEY is not configured");
  }

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error getting OpenAI embedding:", error);
    throw error;
  }
}
