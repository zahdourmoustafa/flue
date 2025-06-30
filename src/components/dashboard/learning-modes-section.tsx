"use client";

import React from "react";
import { MessageCircle, Video, Mic, Play, Phone } from "lucide-react";
import { LearningModeCard } from "./learning-mode-card";

const learningModes = [
  {
    id: "chat",
    title: "AI Chat",
    description:
      "Engage in natural conversations with our advanced AI teacher to improve your writing and reading skills.",
    href: "/dashboard/chat",
    color: "from-amber-400 via-orange-400 to-yellow-500",
    icon: MessageCircle,
    tags: ["#Writing", "#Reading", "#Conversation"],
  },
  {
    id: "call-mode",
    title: "Call Mode",
    description:
      "Real-time voice conversations with AI teacher Emma. Practice speaking and get instant corrections like a phone call.",
    href: "/dashboard/call-mode",
    color: "from-indigo-400 via-purple-500 to-blue-600",
    icon: Phone,
    tags: ["#Speaking", "#Real-time", "#Voice"],
    badge: "New",
  },
  {
    id: "video-call",
    title: "Video Call",
    description:
      "Interactive video conversations with visual AI avatars for immersive speaking practice.",
    href: "/dashboard/videocall",
    color: "from-rose-400 via-pink-500 to-red-500",
    icon: Video,
    tags: ["#Video", "#Avatar", "#Immersive"],
    badge: "Popular",
  },
  {
    id: "sentence",
    title: "Sentence Builder",
    description:
      "Master grammar and sentence structure through interactive exercises and guided practice.",
    href: "/dashboard/sentence-mode",
    color: "from-blue-400 via-blue-500 to-purple-600",
    icon: Play,
    tags: ["#Grammar", "#Structure", "#Practice"],
  },
  {
    id: "dialogue",
    title: "Dialogue Practice",
    description:
      "Learn practical conversations for real-world scenarios with pre-scripted dialogues.",
    href: "/dashboard/dialogue",
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
