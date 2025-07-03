"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { VideoCallInterface } from "@/components/video-call/VideoCallInterface";
import { VideoCallScenario } from "@/types/video-call";
import { useTimeTracker } from "@/hooks/useTimeTracker";

// Scenario data - in a real app, this would come from a database or API
const SCENARIOS: Record<string, VideoCallScenario> = {
  "job-interview": {
    id: "job-interview",
    name: "Job Interview",
    description:
      "Practice professional interview skills and confident responses with a dedicated AI interviewer",
    category: "Professional",
    difficulty: "Intermediate",
    duration: "15-20 min",
    gradient: "from-blue-600 via-blue-700 to-indigo-800",
    skills: [
      "Professional Communication",
      "Confidence",
      "Interview Preparation",
      "Problem Solving",
    ],
    personaConfig: {
      systemPrompt:
        "You are a professional hiring manager conducting a comprehensive job interview.",
      conversationalContext:
        "This is a professional job interview simulation for a mid-level position.",
      customGreeting:
        "Good morning! Welcome, and thank you for taking the time to interview with us today.",
    },
  },
  "coffee-shop": {
    id: "coffee-shop",
    name: "Coffee Shop Conversation",
    description: "Casual conversations and everyday social interactions",
    category: "Social",
    difficulty: "Basics",
    duration: "10-15 min",
    gradient: "from-amber-500 via-orange-600 to-red-600",
    skills: ["Small Talk", "Ordering", "Social Skills"],
    personaConfig: {
      systemPrompt: "You are a friendly barista in a coffee shop.",
      conversationalContext: "This is a casual coffee shop interaction.",
      customGreeting:
        "Welcome to our coffee shop! What can I get started for you today?",
    },
  },
  "doctor-appointment": {
    id: "doctor-appointment",
    name: "Doctor's Appointment",
    description: "Describe symptoms and understand medical advice",
    category: "Healthcare",
    difficulty: "Intermediate",
    duration: "15-20 min",
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    skills: ["Medical Vocabulary", "Symptom Description", "Health"],
    personaConfig: {
      systemPrompt:
        "You are a caring doctor conducting a medical consultation.",
      conversationalContext: "This is a medical consultation.",
      customGreeting:
        "Good morning! Please have a seat. What brings you in to see me today?",
    },
  },
  "business-meeting": {
    id: "business-meeting",
    name: "Business Meeting",
    description: "Lead discussions and present ideas professionally",
    category: "Professional",
    difficulty: "Advanced",
    duration: "20-25 min",
    gradient: "from-slate-600 via-gray-700 to-zinc-800",
    skills: ["Leadership", "Negotiation", "Business English"],
    personaConfig: {
      systemPrompt: "You are a business colleague in a professional meeting.",
      conversationalContext: "This is a business meeting to discuss projects.",
      customGreeting:
        "Good morning! Let's dive into today's agenda and discuss our progress.",
    },
  },
  "first-date": {
    id: "first-date",
    name: "First Date",
    description: "Build connections and express yourself naturally",
    category: "Social",
    difficulty: "Basics",
    duration: "15-20 min",
    gradient: "from-pink-500 via-rose-600 to-red-600",
    skills: ["Personal Topics", "Getting to Know", "Romance"],
    personaConfig: {
      systemPrompt: "You are on a first date.",
      conversationalContext: "This is a first date scenario.",
      customGreeting:
        "Hi! It's so nice to finally meet you in person. How has your day been so far?",
    },
  },
  "university-interview": {
    id: "university-interview",
    name: "University Interview",
    description: "Showcase academic goals and personal achievements",
    category: "Educational",
    difficulty: "Advanced",
    duration: "20-25 min",
    gradient: "from-purple-600 via-violet-700 to-indigo-800",
    skills: ["Academic English", "Goals", "Achievements"],
    personaConfig: {
      systemPrompt: "You are a university admissions officer.",
      conversationalContext: "This is a university admissions interview.",
      customGreeting: "Welcome! Thank you for your interest in our university.",
    },
  },
  "bank-visit": {
    id: "bank-visit",
    name: "Bank Visit",
    description: "Handle financial transactions and account inquiries",
    category: "Services",
    difficulty: "Intermediate",
    duration: "10-15 min",
    gradient: "from-green-600 via-emerald-700 to-teal-800",
    skills: ["Financial Terms", "Transactions", "Problem Solving"],
    personaConfig: {
      systemPrompt:
        "You are a professional bank customer service representative.",
      conversationalContext:
        "This is a bank visit to handle financial transactions.",
      customGreeting: "Welcome to our bank. How can I help you today?",
    },
  },
  "family-dinner": {
    id: "family-dinner",
    name: "Family Dinner",
    description: "Engage in natural, heartwarming conversations with family",
    category: "Social",
    difficulty: "Basics",
    duration: "15-20 min",
    gradient: "from-rose-500 via-pink-600 to-fuchsia-700",
    skills: ["Storytelling", "Personal Updates", "Active Listening"],
    personaConfig: {
      systemPrompt:
        "You are a warm and engaging family member at a lively family dinner.",
      conversationalContext:
        "This is a family dinner simulation where family members are catching up and sharing stories.",
      customGreeting:
        "Hey everyone! It's so wonderful to have us all together around the table. What's new?",
    },
  },
  "travel-planning": {
    id: "travel-planning",
    name: "Travel Planning",
    description: "Organize trips and discuss travel details with an agent",
    category: "Services",
    difficulty: "Intermediate",
    duration: "20-25 min",
    gradient: "from-sky-500 via-blue-600 to-indigo-700",
    skills: ["Booking", "Itinerary", "Budgeting", "Negotiation"],
    personaConfig: {
      systemPrompt:
        "You are an experienced travel agent helping a client plan a detailed trip.",
      conversationalContext:
        "This is a travel planning simulation where a client is working with a travel agent to organize a trip.",
      customGreeting:
        "Hello! Welcome, I'm so excited to help you plan your next adventure. Where have you been dreaming of going?",
    },
  },
  "shopping-trip": {
    id: "shopping-trip",
    name: "Shopping Trip",
    description: "Go shopping and discuss your preferences with a salesperson",
    category: "Social",
    difficulty: "Basics",
    duration: "15-20 min",
    gradient: "from-teal-500 via-cyan-600 to-blue-700",
    skills: ["Shopping", "Product Discussion", "Negotiation"],
    personaConfig: {
      systemPrompt:
        "You are a helpful and friendly salesperson in a retail store.",
      conversationalContext:
        "This is a shopping trip simulation where a customer is interacting with a salesperson in a retail store.",
      customGreeting:
        "Hi there! Welcome to our store. Is there anything in particular you're looking for today?",
    },
  },
  "tech-support-call": {
    id: "tech-support-call",
    name: "Tech Support Call",
    description: "Troubleshoot technical issues with a support agent",
    category: "Services",
    difficulty: "Intermediate",
    duration: "20-25 min",
    gradient: "from-gray-500 via-gray-600 to-slate-700",
    skills: ["Problem Solving", "Technical Vocabulary", "Patience"],
    personaConfig: {
      systemPrompt:
        "You are a patient and knowledgeable tech support agent guiding a user through a technical issue.",
      conversationalContext:
        "This is a tech support call simulation where a user is seeking help with a technical problem.",
      customGreeting:
        "Thank you for calling Tech Solutions. My name is Alex. How can I help you today?",
    },
  },
};

interface VideoCallPageProps {
  params: {
    scenarioId: string;
  };
}

export default function VideoCallPage({ params }: VideoCallPageProps) {
  const { scenarioId } = params;
  const router = useRouter();
  useTimeTracker("videocall-mode");

  const scenario = SCENARIOS[scenarioId];

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Scenario Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The requested video call scenario does not exist.
          </p>
          <button
            onClick={() => router.push("/dashboard/videocall")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Scenarios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <VideoCallInterface
          scenario={scenario}
          className="animate-in fade-in-0 duration-500"
        />
      </div>
    </div>
  );
}
