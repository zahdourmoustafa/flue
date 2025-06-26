"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MessageCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface DialogueScenarioCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  category: string;
  gradient: string;
  skills: string[];
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "bg-green-100 text-green-700 border-green-200";
    case "intermediate":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "advanced":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "professional":
      return "bg-blue-100 text-blue-700";
    case "social":
      return "bg-pink-100 text-pink-700";
    case "food & drink":
      return "bg-orange-100 text-orange-700";
    case "shopping":
      return "bg-emerald-100 text-emerald-700";
    case "navigation":
      return "bg-cyan-100 text-cyan-700";
    case "transportation":
      return "bg-yellow-100 text-yellow-700";
    case "travel":
      return "bg-purple-100 text-purple-700";
    case "healthcare":
      return "bg-teal-100 text-teal-700";
    case "customer service":
      return "bg-red-100 text-red-700";
    case "technology":
      return "bg-indigo-100 text-indigo-700";
    case "real estate":
      return "bg-blue-100 text-blue-700";
    case "educational":
      return "bg-violet-100 text-violet-700";
    case "services":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const DialogueScenarioCard: React.FC<DialogueScenarioCardProps> = ({
  id,
  title,
  description,
  difficulty,
  duration,
  category,
  gradient,
  skills,
}) => {
  const router = useRouter();

  const handleStartDialogue = () => {
    router.push(`/dashboard/dialogue/practice/${id}`);
  };

  return (
    <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden group hover:scale-105 cursor-pointer">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Header Section with Gradient Background */}
        <div
          className={`relative h-40 bg-gradient-to-br ${gradient} overflow-hidden`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10" />
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

          {/* Content */}
          <div className="relative p-4 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <Badge
                className={`${getDifficultyColor(
                  difficulty
                )} border backdrop-blur-sm font-medium text-xs`}
              >
                {difficulty}
              </Badge>
            </div>

            <div className="text-white">
              <h3 className="text-lg font-bold mb-2 leading-tight">{title}</h3>
              <div className="flex items-center gap-3 text-white/80 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{duration}</span>
                </div>
                <Badge className={`${getCategoryColor(category)} text-xs`}>
                  {category}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col">
          <p className="text-gray-600 text-sm mb-3 leading-relaxed flex-1">
            {description}
          </p>

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {skills.slice(0, 2).map((skill) => (
              <span
                key={skill}
                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium border border-blue-100"
              >
                {skill}
              </span>
            ))}
            {skills.length > 2 && (
              <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full font-medium border border-gray-200">
                +{skills.length - 2} more
              </span>
            )}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleStartDialogue}
            className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 bg-gray-50 text-gray-700 hover:bg-gray-100 border-0 shadow-sm"
            variant="outline"
            size="sm"
          >
            <span>Start Dialogue</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
