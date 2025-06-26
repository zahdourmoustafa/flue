"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DialogueScenarioCard } from "./dialogue-scenario-card";

const dialogueScenarios = [
  // Beginner Level
  {
    id: "ordering-coffee",
    title: "Ordering Coffee",
    description:
      "Practice ordering coffee and asking about menu items in a café",
    difficulty: "Beginner",
    duration: "5-8 min",
    category: "Food & Drink",
    gradient: "from-amber-500 via-orange-600 to-red-600",
    skills: ["Basic Ordering", "Menu Items", "Politeness"],
  },
  {
    id: "greeting-introduction",
    title: "Greetings & Introductions",
    description: "Learn how to greet someone and introduce yourself properly",
    difficulty: "Beginner",
    duration: "3-5 min",
    category: "Social",
    gradient: "from-pink-500 via-rose-600 to-red-600",
    skills: ["Basic Greetings", "Self-Introduction", "Small Talk"],
  },
  {
    id: "shopping-groceries",
    title: "Grocery Shopping",
    description: "Ask for help finding items and inquire about prices",
    difficulty: "Beginner",
    duration: "5-8 min",
    category: "Shopping",
    gradient: "from-green-500 via-emerald-600 to-teal-700",
    skills: ["Shopping Vocabulary", "Numbers", "Basic Questions"],
  },
  {
    id: "asking-directions",
    title: "Asking for Directions",
    description: "Learn how to ask for and understand directions to places",
    difficulty: "Beginner",
    duration: "5-8 min",
    category: "Navigation",
    gradient: "from-blue-500 via-cyan-600 to-teal-700",
    skills: ["Location Vocabulary", "Directions", "Public Transport"],
  },

  // Intermediate Level
  {
    id: "ordering-taxi",
    title: "Ordering a Taxi",
    description:
      "Call a taxi service and provide pickup and destination details",
    difficulty: "Intermediate",
    duration: "8-12 min",
    category: "Transportation",
    gradient: "from-yellow-500 via-orange-600 to-red-600",
    skills: ["Phone Conversations", "Addresses", "Time Management"],
  },
  {
    id: "ordering-pizza",
    title: "Ordering Pizza",
    description:
      "Call a pizza place and customize your order with specific toppings",
    difficulty: "Intermediate",
    duration: "8-12 min",
    category: "Food & Drink",
    gradient: "from-red-500 via-pink-600 to-purple-700",
    skills: ["Phone Orders", "Food Customization", "Payment Methods"],
  },
  {
    id: "booking-hotel",
    title: "Hotel Booking",
    description: "Reserve a hotel room and discuss amenities and policies",
    difficulty: "Intermediate",
    duration: "10-15 min",
    category: "Travel",
    gradient: "from-indigo-500 via-purple-600 to-pink-700",
    skills: ["Reservations", "Dates & Times", "Hotel Services"],
  },
  {
    id: "restaurant-dining",
    title: "Restaurant Dining",
    description: "Order a meal, ask about ingredients, and request the bill",
    difficulty: "Intermediate",
    duration: "10-15 min",
    category: "Food & Drink",
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    skills: ["Fine Dining", "Dietary Preferences", "Service Requests"],
  },
  {
    id: "job-inquiry",
    title: "Job Inquiry Call",
    description: "Call about a job posting and ask relevant questions",
    difficulty: "Intermediate",
    duration: "10-15 min",
    category: "Professional",
    gradient: "from-blue-600 via-indigo-700 to-purple-800",
    skills: ["Professional Communication", "Job Requirements", "Scheduling"],
  },
  {
    id: "doctor-appointment",
    title: "Booking Doctor's Appointment",
    description: "Schedule a medical appointment and describe symptoms",
    difficulty: "Intermediate",
    duration: "8-12 min",
    category: "Healthcare",
    gradient: "from-teal-500 via-cyan-600 to-blue-700",
    skills: ["Medical Vocabulary", "Appointment Scheduling", "Health Issues"],
  },

  // Advanced Level
  {
    id: "business-negotiation",
    title: "Business Negotiation",
    description: "Negotiate contract terms and discuss business proposals",
    difficulty: "Advanced",
    duration: "15-20 min",
    category: "Professional",
    gradient: "from-slate-600 via-gray-700 to-zinc-800",
    skills: ["Negotiation", "Business Terms", "Persuasion"],
  },
  {
    id: "complaint-resolution",
    title: "Customer Complaint",
    description: "Handle a service complaint and work towards resolution",
    difficulty: "Advanced",
    duration: "12-18 min",
    category: "Customer Service",
    gradient: "from-red-600 via-orange-700 to-yellow-800",
    skills: ["Problem Solving", "Conflict Resolution", "Customer Service"],
  },
  {
    id: "technical-support",
    title: "Technical Support",
    description: "Explain technical issues and follow complex troubleshooting",
    difficulty: "Advanced",
    duration: "15-20 min",
    category: "Technology",
    gradient: "from-purple-600 via-indigo-700 to-blue-800",
    skills: [
      "Technical Vocabulary",
      "Problem Description",
      "Following Instructions",
    ],
  },
  {
    id: "real-estate-viewing",
    title: "Property Viewing",
    description:
      "Discuss property features, negotiate rent, and ask detailed questions",
    difficulty: "Advanced",
    duration: "15-20 min",
    category: "Real Estate",
    gradient: "from-cyan-600 via-blue-700 to-indigo-800",
    skills: ["Property Features", "Negotiation", "Legal Terms"],
  },
  {
    id: "academic-discussion",
    title: "Academic Discussion",
    description: "Engage in intellectual discourse about complex topics",
    difficulty: "Advanced",
    duration: "20-25 min",
    category: "Educational",
    gradient: "from-violet-600 via-purple-700 to-indigo-800",
    skills: ["Academic Language", "Critical Thinking", "Argumentation"],
  },
  {
    id: "insurance-claim",
    title: "Insurance Claim",
    description:
      "File an insurance claim and provide detailed incident information",
    difficulty: "Advanced",
    duration: "15-20 min",
    category: "Services",
    gradient: "from-emerald-600 via-green-700 to-teal-800",
    skills: [
      "Insurance Terminology",
      "Detailed Reporting",
      "Policy Understanding",
    ],
  },
];

export const DialogueScenariosContent: React.FC = () => {
  const beginnerScenarios = dialogueScenarios.filter(
    (s) => s.difficulty === "Beginner"
  );
  const intermediateScenarios = dialogueScenarios.filter(
    (s) => s.difficulty === "Intermediate"
  );
  const advancedScenarios = dialogueScenarios.filter(
    (s) => s.difficulty === "Advanced"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Dialogue Practice
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Scenarios
              </span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl">
              Master real-world conversations through interactive dialogue
              scenarios. Practice specific situations from ordering coffee to
              business negotiations with AI role-playing partners.
            </p>
          </div>
        </div>

        {/* Beginner Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Beginner Level</h2>
            <span className="text-sm text-gray-500 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              {beginnerScenarios.length} scenarios
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {beginnerScenarios.map((scenario) => (
              <DialogueScenarioCard key={scenario.id} {...scenario} />
            ))}
          </div>
        </div>

        {/* Intermediate Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              Intermediate Level
            </h2>
            <span className="text-sm text-gray-500 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
              {intermediateScenarios.length} scenarios
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {intermediateScenarios.map((scenario) => (
              <DialogueScenarioCard key={scenario.id} {...scenario} />
            ))}
          </div>
        </div>

        {/* Advanced Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">Advanced Level</h2>
            <span className="text-sm text-gray-500 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              {advancedScenarios.length} scenarios
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {advancedScenarios.map((scenario) => (
              <DialogueScenarioCard key={scenario.id} {...scenario} />
            ))}
          </div>
        </div>

        {/* Bottom Info Section */}
        <div className="mt-16 p-8 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-3xl border border-blue-100/50">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              💬 How Dialogue Practice Works
            </h3>
            <p className="text-gray-600 text-lg mb-6 max-w-3xl mx-auto">
              Each scenario places you in a specific real-world situation where
              you'll chat with an AI that plays a role (waiter, taxi driver,
              hotel receptionist, etc.). Practice natural conversations and get
              instant feedback on your language use.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎭</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Role Playing
                </h4>
                <p className="text-gray-600 text-sm">
                  AI adapts to specific scenarios and plays authentic roles
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✏️</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Real-time Correction
                </h4>
                <p className="text-gray-600 text-sm">
                  Get instant feedback on grammar, vocabulary, and style
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📈</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Progressive Learning
                </h4>
                <p className="text-gray-600 text-sm">
                  Start with basics and advance to complex conversations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
