"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VideoCallScenarioCard } from "./videocall-scenario-card";

const videoCallScenarios = [
  {
    id: "job-interview",
    title: "Job Interview",
    description:
      "Practice professional interview skills and confident responses with a dedicated AI interviewer",
    difficulty: "Intermediate",
    duration: "15-20 min",
    category: "Professional",
    gradient: "from-blue-600 via-blue-700 to-indigo-800",
    imageUrl: "/images/scenarios/job-interview.jpg",
    skills: [
      "Professional Communication",
      "Confidence",
      "Interview Preparation",
      "Problem Solving",
    ],
  },
  {
    id: "coffee-shop",
    title: "Coffee Shop Conversation",
    description: "Casual conversations and everyday social interactions",
    difficulty: "Basics",
    duration: "10-15 min",
    category: "Social",
    gradient: "from-amber-500 via-orange-600 to-red-600",
    imageUrl: "/images/scenarios/coffee-shop.jpg",
    skills: ["Small Talk", "Ordering", "Social Skills"],
  },
  {
    id: "doctor-appointment",
    title: "Doctor's Appointment",
    description: "Describe symptoms and understand medical advice",
    difficulty: "Intermediate",
    duration: "15-20 min",
    category: "Healthcare",
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    imageUrl: "/images/scenarios/doctor.jpg",
    skills: ["Medical Vocabulary", "Symptom Description", "Health"],
  },
  {
    id: "business-meeting",
    title: "Business Meeting",
    description: "Lead discussions and present ideas professionally",
    difficulty: "Advanced",
    duration: "20-25 min",
    category: "Professional",
    gradient: "from-slate-600 via-gray-700 to-zinc-800",
    imageUrl: "/images/scenarios/business-meeting.jpg",
    skills: ["Leadership", "Negotiation", "Business English"],
  },
  {
    id: "first-date",
    title: "First Date",
    description: "Build connections and express yourself naturally",
    difficulty: "Basics",
    duration: "15-20 min",
    category: "Social",
    gradient: "from-pink-500 via-rose-600 to-red-600",
    imageUrl: "/images/scenarios/first-date.jpg",
    skills: ["Personal Topics", "Getting to Know", "Romance"],
  },
  {
    id: "university-interview",
    title: "University Interview",
    description: "Showcase academic goals and personal achievements",
    difficulty: "Advanced",
    duration: "20-25 min",
    category: "Educational",
    gradient: "from-purple-600 via-violet-700 to-indigo-800",
    imageUrl: "/images/scenarios/university.jpg",
    skills: ["Academic English", "Goals", "Achievements"],
  },
  {
    id: "bank-visit",
    title: "Bank Visit",
    description: "Handle financial transactions and account inquiries",
    difficulty: "Intermediate",
    duration: "10-15 min",
    category: "Services",
    gradient: "from-green-600 via-emerald-700 to-teal-800",
    imageUrl: "/images/scenarios/bank.jpg",
    skills: ["Financial Terms", "Transactions", "Problem Solving"],
  },
  {
    id: "family-dinner",
    title: "Family Dinner",
    description: "Engage in natural, heartwarming conversations with family",
    difficulty: "Basics",
    duration: "15-20 min",
    category: "Social",
    gradient: "from-rose-500 via-pink-600 to-fuchsia-700",
    imageUrl: "/images/scenarios/family-dinner.jpg",
    skills: ["Storytelling", "Personal Updates", "Active Listening"],
    enabled: true,
  },
  {
    id: "travel-planning",
    title: "Travel Planning",
    description: "Organize trips and discuss travel details with an agent",
    difficulty: "Intermediate",
    duration: "20-25 min",
    category: "Services",
    gradient: "from-sky-500 via-blue-600 to-indigo-700",
    imageUrl: "/images/scenarios/travel.jpg",
    skills: ["Booking", "Itinerary", "Budgeting", "Negotiation"],
    enabled: true,
  },
  {
    id: "shopping-trip",
    title: "Shopping Trip",
    description: "Go shopping and discuss your preferences with a salesperson",
    difficulty: "Basics",
    duration: "15-20 min",
    category: "Social",
    gradient: "from-teal-500 via-cyan-600 to-blue-700",
    imageUrl: "/images/scenarios/shopping-trip.jpg",
    skills: ["Shopping", "Product Discussion", "Negotiation"],
    enabled: true,
  },
  {
    id: "tech-support-call",
    title: "Tech Support Call",
    description: "Troubleshoot technical issues with a support agent",
    difficulty: "Intermediate",
    duration: "20-25 min",
    category: "Services",
    gradient: "from-gray-500 via-gray-600 to-slate-700",
    imageUrl: "/images/scenarios/tech-support.jpg",
    skills: ["Problem Solving", "Technical Vocabulary", "Patience"],
    enabled: true,
  },
  {
    id: "networking-event",
    title: "Networking Event",
    description: "Make professional connections and exchange contacts",
    difficulty: "Advanced",
    duration: "20-25 min",
    category: "Professional",
    gradient: "from-indigo-600 via-purple-700 to-pink-800",
    imageUrl: "/images/scenarios/networking.jpg",
    skills: [
      "Professional Networking",
      "Self-Introduction",
      "Contact Exchange",
    ],
  },
  {
    id: "real-estate",
    title: "Real Estate Inquiry",
    description: "Ask about properties and negotiate rental terms",
    difficulty: "Intermediate",
    duration: "15-20 min",
    category: "Services",
    gradient: "from-teal-600 via-cyan-700 to-blue-800",
    imageUrl: "/images/scenarios/real-estate.jpg",
    skills: ["Property Description", "Negotiation", "Living Arrangements"],
  },
  {
    id: "language-exchange",
    title: "Language Exchange",
    description: "Practice with a native speaker and help them learn too",
    difficulty: "Basics",
    duration: "20-30 min",
    category: "Educational",
    gradient: "from-rose-500 via-pink-600 to-purple-700",
    imageUrl: "/images/scenarios/language-exchange.jpg",
    skills: ["Cultural Exchange", "Teaching", "Mutual Learning"],
  },
  {
    id: "restaurant-ordering",
    title: "Restaurant Ordering",
    description: "Order food and discuss your preferences with a waiter",
    difficulty: "Basics",
    duration: "15-20 min",
    category: "Social",
    gradient: "from-teal-500 via-cyan-600 to-blue-700",
    imageUrl: "/images/scenarios/restaurant-ordering.jpg",
    skills: ["Ordering", "Food Discussion", "Negotiation"],
    enabled: true,
  },
];

export const VideoCallScenariosContent: React.FC = () => {
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
              Video Call Practice
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Scenarios
              </span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl">
              Practice real-world conversations with AI in immersive video call
              scenarios. Build confidence through face-to-face interactions
              tailored to your learning goals.
            </p>
          </div>
        </div>

        {/* How it Works Section */}
        <div className="mb-12 p-8 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-3xl border border-blue-100/50">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              🎥 How Video Call Practice Works
            </h3>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              Each scenario features an AI conversation partner who adapts to
              your selected role. Practice speaking naturally while receiving
              real-time feedback and guidance to improve your fluency.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-xl">1️⃣</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Choose Scenario
                </h4>
                <p className="text-gray-500 text-sm">
                  Select from professional, social, or service-based
                  conversations
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 text-xl">2️⃣</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Start Video Call
                </h4>
                <p className="text-gray-500 text-sm">
                  Connect with your AI partner and begin the conversation
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 text-xl">3️⃣</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Practice & Improve
                </h4>
                <p className="text-gray-500 text-sm">
                  Receive feedback and build confidence in real-time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {videoCallScenarios.map((scenario) => (
            <VideoCallScenarioCard key={scenario.id} {...scenario} />
          ))}
        </div>
      </div>
    </div>
  );
};
