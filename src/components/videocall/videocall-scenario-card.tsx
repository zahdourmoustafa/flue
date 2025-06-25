"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Video, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface VideoCallScenarioCardProps {
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
    case "basics":
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
    case "healthcare":
      return "bg-emerald-100 text-emerald-700";
    case "educational":
      return "bg-purple-100 text-purple-700";
    case "services":
      return "bg-teal-100 text-teal-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const VideoCallScenarioCard: React.FC<VideoCallScenarioCardProps> = ({
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

  const handleStartCall = () => {
    router.push(`/dashboard/videocall/call/${id}`);
  };
  return (
    <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden group hover:scale-105 cursor-pointer">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Header Section with Gradient Background */}
        <div
          className={`relative h-48 bg-gradient-to-br ${gradient} overflow-hidden`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

          {/* Content */}
          <div className="relative p-6 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Video className="w-6 h-6 text-white" />
              </div>
              <Badge
                className={`${getDifficultyColor(
                  difficulty
                )} border backdrop-blur-sm font-medium`}
              >
                {difficulty}
              </Badge>
            </div>

            <div className="text-white">
              <h3 className="text-xl font-bold mb-2 leading-tight">{title}</h3>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
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
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-1">
            {description}
          </p>

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-100"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleStartCall}
            className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 bg-gray-50 text-gray-700 hover:bg-gray-100 border-0 shadow-sm"
            variant="outline"
          >
            <span>Start Video Call</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
