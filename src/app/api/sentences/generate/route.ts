import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { getAuthenticatedUser } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user with full profile data
    const authenticatedUser = await getAuthenticatedUser();

    console.log(
      `👤 User authenticated: ${authenticatedUser.email}, Learning: ${authenticatedUser.learningLanguage}, Level: ${authenticatedUser.languageLevel}`
    );

    const body = await request.json();
    const { unitId, lessonId, count = 10 } = body;

    if (!unitId || !lessonId) {
      return NextResponse.json(
        { error: "unitId and lessonId are required" },
        { status: 400 }
      );
    }

    const learningLanguage = authenticatedUser.learningLanguage || "en";
    const languageLevel = authenticatedUser.languageLevel || "beginner";

    // Get context for the lesson
    const lessonContext = getLessonContext(unitId, lessonId);

    // Generate sentences using OpenAI
    const sentences = await generateSentencesWithOpenAI(
      learningLanguage,
      languageLevel,
      lessonContext,
      count
    );

    console.log(`✅ Successfully generated ${sentences.length} sentences`);
    return NextResponse.json({ sentences });
  } catch (error) {
    console.error("❌ Error generating sentences:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("User not authenticated")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      if (error.message.includes("User not found")) {
        return NextResponse.json(
          { error: "User profile not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: `Failed to generate sentences: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate sentences" },
      { status: 500 }
    );
  }
}

function getLessonContext(unitId: string, lessonId: string) {
  // Define context mapping based on your existing units and lessons
  const contextMap: Record<
    string,
    Record<string, { title: string; scenario: string; difficulty: string }>
  > = {
    "unit-1": {
      "lesson-1-1": {
        title: "Introducing Yourself",
        scenario:
          "casual and formal self-introductions, sharing name, age, origin, and occupation",
        difficulty: "beginner",
      },
      "lesson-1-2": {
        title: "Introducing Someone Else",
        scenario: "introducing friends, family, and colleagues to others",
        difficulty: "beginner",
      },
      "lesson-1-3": {
        title: "Formal Introductions",
        scenario:
          "professional and formal introduction scenarios in business settings",
        difficulty: "intermediate",
      },
    },
    "unit-2": {
      "lesson-2-1": {
        title: "Using Public Transport",
        scenario:
          "navigating buses, trains, and subway systems, asking for information",
        difficulty: "beginner",
      },
      "lesson-2-2": {
        title: "Asking for Directions",
        scenario:
          "getting help finding your way around the city, understanding directions",
        difficulty: "beginner",
      },
      "lesson-2-3": {
        title: "Places in the City",
        scenario:
          "talking about various city locations, landmarks, and urban facilities",
        difficulty: "intermediate",
      },
    },
    "unit-3": {
      "lesson-3-1": {
        title: "At the Airport",
        scenario:
          "handling airport procedures, check-in, security, and flight information",
        difficulty: "intermediate",
      },
      "lesson-3-2": {
        title: "Hotel Reservations",
        scenario:
          "booking rooms, communicating with hotel staff, requesting services",
        difficulty: "intermediate",
      },
      "lesson-3-3": {
        title: "Sightseeing",
        scenario:
          "exploring tourist attractions, asking about places, getting recommendations",
        difficulty: "intermediate",
      },
    },
    "unit-4": {
      "lesson-4-1": {
        title: "Ordering Food",
        scenario:
          "ordering meals at restaurants, understanding menus, dietary restrictions",
        difficulty: "intermediate",
      },
      "lesson-4-2": {
        title: "Food Preferences",
        scenario:
          "discussing food likes, dislikes, allergies, and cooking methods",
        difficulty: "intermediate",
      },
      "lesson-4-3": {
        title: "Dining Etiquette",
        scenario:
          "understanding cultural dining norms and polite conversation at meals",
        difficulty: "advanced",
      },
    },
    "unit-5": {
      "lesson-5-1": {
        title: "Job Interviews",
        scenario:
          "professional interviews, discussing skills, experience, and qualifications",
        difficulty: "advanced",
      },
      "lesson-5-2": {
        title: "Office Communication",
        scenario:
          "workplace conversations, meetings, emails, and colleague interactions",
        difficulty: "advanced",
      },
      "lesson-5-3": {
        title: "Business Presentations",
        scenario:
          "formal presentations, explaining ideas, and professional speaking",
        difficulty: "advanced",
      },
    },
    "unit-6": {
      "lesson-6-1": {
        title: "Doctor Appointments",
        scenario:
          "scheduling medical appointments, describing symptoms, and understanding medical advice",
        difficulty: "intermediate",
      },
      "lesson-6-2": {
        title: "Pharmacy Visits",
        scenario:
          "picking up prescriptions, asking about medications, and understanding dosage instructions",
        difficulty: "intermediate",
      },
      "lesson-6-3": {
        title: "Health and Wellness",
        scenario:
          "discussing health habits, fitness routines, and wellness practices",
        difficulty: "intermediate",
      },
    },
    "unit-7": {
      "lesson-7-1": {
        title: "At the Store",
        scenario:
          "shopping for clothes, electronics, and everyday items, asking for sizes and prices",
        difficulty: "intermediate",
      },
      "lesson-7-2": {
        title: "Market and Grocery Shopping",
        scenario:
          "buying groceries, asking for fresh produce, and understanding product labels",
        difficulty: "beginner",
      },
      "lesson-7-3": {
        title: "Returns and Exchanges",
        scenario:
          "returning items, understanding return policies, and handling shopping issues",
        difficulty: "intermediate",
      },
    },
    "unit-8": {
      "lesson-8-1": {
        title: "Movies and TV",
        scenario:
          "discussing films, TV shows, preferences, and entertainment opinions",
        difficulty: "intermediate",
      },
      "lesson-8-2": {
        title: "Music and Concerts",
        scenario:
          "talking about music genres, favorite artists, and live performance experiences",
        difficulty: "intermediate",
      },
      "lesson-8-3": {
        title: "Sports and Games",
        scenario:
          "discussing sports, games, competitions, and recreational activities",
        difficulty: "intermediate",
      },
    },
    "unit-9": {
      "lesson-9-1": {
        title: "Holidays and Celebrations",
        scenario:
          "discussing cultural holidays, celebrations, and traditional customs",
        difficulty: "advanced",
      },
      "lesson-9-2": {
        title: "History and Heritage",
        scenario:
          "talking about historical events, cultural heritage, and national identity",
        difficulty: "advanced",
      },
      "lesson-9-3": {
        title: "Art and Literature",
        scenario:
          "discussing artistic expressions, literature, and cultural appreciation",
        difficulty: "advanced",
      },
    },
    "unit-10": {
      "lesson-10-1": {
        title: "Complex Debates",
        scenario:
          "engaging in sophisticated discussions, expressing nuanced opinions, and debating topics",
        difficulty: "advanced",
      },
      "lesson-10-2": {
        title: "Academic Discussions",
        scenario:
          "participating in scholarly conversations, analyzing complex topics, and critical thinking",
        difficulty: "advanced",
      },
      "lesson-10-3": {
        title: "Professional Networking",
        scenario:
          "advanced networking conversations, building professional relationships, and industry discussions",
        difficulty: "advanced",
      },
    },
  };

  return (
    contextMap[unitId]?.[lessonId] || {
      title: "General Practice",
      scenario: "general conversation practice",
      difficulty: "beginner",
    }
  );
}

async function generateSentencesWithOpenAI(
  learningLanguage: string,
  languageLevel: string,
  lessonContext: { title: string; scenario: string; difficulty: string },
  count: number
) {
  console.log(
    `🌍 Generating sentences for language: "${learningLanguage}", level: "${languageLevel}"`
  );

  const languageMap: Record<string, string> = {
    es: "Spanish",
    en: "English",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese",
    ar: "Arabic",
    ru: "Russian",
    spanish: "Spanish",
    english: "English",
    french: "French",
    german: "German",
    italian: "Italian",
    portuguese: "Portuguese",
    japanese: "Japanese",
    korean: "Korean",
    chinese: "Chinese",
    arabic: "Arabic",
    russian: "Russian",
  };

  const targetLanguage =
    languageMap[learningLanguage.toLowerCase()] || learningLanguage;

  console.log(`🎯 Target language mapped to: "${targetLanguage}"`);

  const systemPrompt = `You are an expert language teacher creating practice sentences for ${targetLanguage} language learners.

Your task is to generate exactly ${count} practice sentences for a ${languageLevel} level lesson about "${lessonContext.title}".

Lesson Context: ${lessonContext.scenario}

Guidelines:
1. Generate sentences in ${targetLanguage} only
2. Adjust complexity for ${languageLevel} level (beginner = simple, intermediate = moderate, advanced = complex)
3. Focus on the specific scenario: ${lessonContext.scenario}
4. Include practical, real-world phrases students would actually use
5. Vary sentence length and structure appropriately for the level
6. Include key vocabulary relevant to the topic
7. Make sentences progressively slightly more challenging within the lesson
8. Each sentence should be standalone and useful for pronunciation practice

Return ONLY a JSON array of objects with this exact structure:
[
  {
    "text": "sentence in ${targetLanguage}",
    "translation": "English translation", 
    "difficulty": 1-3 (1=easy, 2=medium, 3=hard within the lesson level)
  }
]

Do not include any other text, explanations, or formatting. Just the JSON array.`;

  console.log(`🤖 Making OpenAI request for ${count} sentences...`);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Generate ${count} practice sentences for the lesson "${lessonContext.title}" focusing on: ${lessonContext.scenario}`,
      },
    ],
    max_tokens: 2000,
    temperature: 0.7,
  });

  const response = completion.choices[0]?.message?.content;
  console.log(
    `📝 OpenAI response received, length: ${response?.length || 0} characters`
  );

  if (!response) {
    console.error("❌ OpenAI returned empty response");
    throw new Error("Failed to generate sentences from OpenAI");
  }

  try {
    const parsedSentences = JSON.parse(response);

    // Validate and transform the response to match our Sentence interface
    const sentences = parsedSentences.map((item: any, index: number) => ({
      id: `generated-${Date.now()}-${index}`,
      lessonId: lessonContext.title.toLowerCase().replace(/\s+/g, "-"),
      text: item.text,
      translation: item.translation,
      difficulty: item.difficulty || 1,
      audioUrl: null,
      orderIndex: index + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return sentences;
  } catch (parseError) {
    console.error("Failed to parse OpenAI response:", response);
    throw new Error("Invalid response format from OpenAI");
  }
}
