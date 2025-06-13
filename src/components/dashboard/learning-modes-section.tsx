"use client";

import React from "react";
import { MessageCircle, Video, Mic, Play } from "lucide-react";
import { LearningModeCard } from "./learning-mode-card";

const learningModes = [
  {
    id: "chat",
    title: "AI Chat",
    description:
      "Engage in natural conversations with our advanced AI teacher to improve your writing and reading skills.",
    href: "/chat",
    color: "from-amber-400 via-orange-400 to-yellow-500",
    icon: MessageCircle,
    tags: ["#Writing", "#Reading", "#Conversation"],
  },
  {
    id: "call",
    title: "Voice Call",
    description:
      "Practice speaking with real-time voice conversations to boost your pronunciation and listening skills.",
    href: "/video-call",
    color: "from-rose-400 via-pink-500 to-red-500",
    icon: Video,
    tags: ["#Speaking", "#Listening", "#Pronunciation"],
    badge: "Popular",
  },
  {
    id: "sentence",
    title: "Sentence Builder",
    description:
      "Master grammar and sentence structure through interactive exercises and guided practice.",
    href: "/sentence",
    color: "from-blue-400 via-blue-500 to-purple-600",
    icon: Play,
    tags: ["#Grammar", "#Structure", "#Practice"],
    badge: "New",
  },
  {
    id: "dialogue",
    title: "Dialogue Practice",
    description:
      "Learn practical conversations for real-world scenarios with pre-scripted dialogues.",
    href: "/dialogue",
    color: "from-emerald-400 via-green-500 to-teal-600",
    icon: Mic,
    tags: ["#Conversation", "#Real-world", "#Practice"],
    badge: "Featured",
  },
];

export const LearningModesSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Choose Your Learning Adventure
        </h2>
        <p className="text-gray-600 text-lg">
          Pick the perfect mode to match your learning style and goals
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {learningModes.map((mode) => (
          <LearningModeCard key={mode.id} {...mode} />
        ))}
      </div>
    </div>
  );
};
