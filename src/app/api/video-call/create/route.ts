import { NextRequest, NextResponse } from "next/server";
import { tavusAPI } from "@/services/tavus-api";
import { CreateConversationRequest } from "@/types/video-call";

// Scenario configurations
const SCENARIO_CONFIGS = {
  "job-interview": {
    systemPrompt:
      "You are a professional hiring manager conducting a comprehensive job interview. Ask thoughtful questions about the candidate's experience, technical skills, problem-solving abilities, and cultural fit. Provide constructive feedback and create realistic interview scenarios to help them practice and improve their interview performance.",
    conversationalContext:
      "This is a professional job interview simulation for a mid-level position. The candidate wants to practice answering common interview questions, discussing their background, and demonstrating their qualifications in a realistic interview setting.",
    customGreeting:
      "Good morning! Welcome, and thank you for taking the time to interview with us today. I'm really looking forward to learning more about your background and experience. Please, have a seat and make yourself comfortable. To start, could you tell me a little bit about yourself and what initially drew you to apply for this position?",
  },
  "coffee-shop": {
    systemPrompt:
      "You are a friendly barista in a coffee shop. Take orders, make small talk, and create a welcoming atmosphere. Help the customer practice casual conversation and ordering.",
    conversationalContext:
      "This is a casual coffee shop interaction where the customer wants to practice ordering drinks and having friendly conversation.",
    customGreeting:
      "Welcome to our coffee shop! What can I get started for you today? We have some great seasonal specials if you're interested!",
  },
  "doctor-appointment": {
    systemPrompt:
      "You are a caring doctor conducting a medical consultation. Ask about symptoms, provide medical advice, and help the patient practice describing health issues clearly.",
    conversationalContext:
      "This is a medical consultation where the patient wants to practice describing symptoms and understanding medical advice.",
    customGreeting:
      "Good morning! Please have a seat. What brings you in to see me today? Take your time describing what's been bothering you.",
  },
  "business-meeting": {
    systemPrompt:
      "You are a business colleague in a professional meeting. Discuss project updates, collaborate on solutions, and provide constructive feedback. Help practice professional communication.",
    conversationalContext:
      "This is a business meeting to discuss ongoing projects and upcoming deadlines.",
    customGreeting:
      "Good morning! Let's dive into today's agenda. I'm excited to hear about the progress on your recent projects and discuss next steps.",
  },
  "first-date": {
    systemPrompt:
      "You are on a first date. Be charming, ask getting-to-know-you questions, and share interesting stories about yourself. Help practice casual romantic conversation.",
    conversationalContext:
      "This is a first date scenario where two people are getting to know each other.",
    customGreeting:
      "Hi! It's so nice to finally meet you in person. How has your day been so far? You look great, by the way!",
  },
  "university-interview": {
    systemPrompt:
      "You are a university admissions officer conducting an interview. Ask about academic goals, achievements, and motivations. Help the student practice articulating their aspirations.",
    conversationalContext:
      "This is a university admissions interview where the student wants to showcase their academic goals and achievements.",
    customGreeting:
      "Welcome! Thank you for your interest in our university. I'm looking forward to learning more about you and your academic journey. Let's start with what drew you to our program.",
  },
} as const;

export async function POST(request: NextRequest) {
  try {
    const { scenarioId, language = "english" } = await request.json();

    if (!scenarioId) {
      return NextResponse.json(
        { error: "Scenario ID is required" },
        { status: 400 }
      );
    }

    // Check for existing active conversations and end them before creating a new one
    const activeConversations = await tavusAPI.listConversations("active");

    // End any existing active conversations to ensure clean state
    for (const conversation of activeConversations) {
      try {
        console.log(
          `Ending existing conversation: ${conversation.conversation_id}`
        );
        await tavusAPI.endConversation(conversation.conversation_id);
      } catch (endError) {
        console.warn(
          `Failed to end conversation ${conversation.conversation_id}:`,
          endError
        );
        // Continue with creation even if ending fails
      }
    }

    // Get scenario configuration
    const scenarioConfig =
      SCENARIO_CONFIGS[scenarioId as keyof typeof SCENARIO_CONFIGS];
    if (!scenarioConfig) {
      return NextResponse.json(
        { error: "Invalid scenario ID" },
        { status: 400 }
      );
    }

    // Get environment variables - use specific IDs for job interview
    const replicaId =
      scenarioId === "job-interview"
        ? "r92debe21318"
        : process.env.TAVUS_REPLICA_ID;
    const personaId =
      scenarioId === "job-interview"
        ? "pf35752e4fc8"
        : process.env.TAVUS_PERSONA_ID;

    if (!replicaId || !personaId) {
      return NextResponse.json(
        {
          error:
            "Tavus configuration missing. Please check TAVUS_REPLICA_ID and TAVUS_PERSONA_ID environment variables.",
        },
        { status: 500 }
      );
    }

    // Create conversation request
    const conversationRequest: CreateConversationRequest = {
      replica_id: replicaId,
      persona_id: personaId,
      conversation_name: `Language Practice - ${scenarioId.replace("-", " ")}`,
      conversational_context: scenarioConfig.conversationalContext,
      custom_greeting: scenarioConfig.customGreeting,
      properties: {
        max_call_duration: 1800, // 30 minutes
        participant_left_timeout: 60,
        participant_absent_timeout: 300,
        enable_recording: false, // Set to true if you want recordings
        enable_closed_captions: true,
        apply_greenscreen: false,
        language: language,
      },
    };

    // Create conversation with Tavus
    const conversation = await tavusAPI.createConversation(conversationRequest);

    return NextResponse.json({
      conversation_id: conversation.conversation_id,
      conversation_url: conversation.conversation_url,
      status: conversation.status,
      scenario_id: scenarioId,
      created_at: conversation.created_at,
    });
  } catch (error) {
    console.error("Video call creation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (
      errorMessage.includes("User has reached maximum concurrent conversations")
    ) {
      return NextResponse.json(
        {
          error: "Failed to create video call",
          details:
            "You have reached the maximum number of concurrent conversations allowed on your plan.",
        },
        { status: 429 } // 429 Too Many Requests
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create video call",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
