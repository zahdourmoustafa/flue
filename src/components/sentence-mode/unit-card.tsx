"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SentenceUnit } from "@/types/sentence-mode";
import { BookOpen, CheckCircle, Clock, ArrowRight } from "lucide-react";

interface UnitCardProps {
  unit: SentenceUnit;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
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

const getUnitGradient = (index: number) => {
  const gradients = [
    "from-blue-500 to-purple-600",
    "from-orange-500 to-red-600",
    "from-emerald-500 to-teal-600",
    "from-purple-500 to-pink-600",
    "from-indigo-500 to-blue-600",
    "from-green-500 to-emerald-600",
  ];
  return gradients[index % gradients.length];
};

export const UnitCard = ({ unit }: UnitCardProps) => {
  const progress = unit.progress;
  const progressPercentage = progress
    ? Math.round((progress.completedSentences / progress.totalSentences) * 100)
    : 0;

  const isStarted = progress && progress.completedSentences > 0;
  const isCompleted = progress?.isCompleted || false;

  // Use unit ID to determine gradient (or you can pass index as prop)
  const unitIndex = parseInt(unit.id.split("-")[1]) || 0;
  const gradient = getUnitGradient(unitIndex);

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
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <Badge
                className={`${getDifficultyColor(
                  unit.difficulty
                )} border backdrop-blur-sm font-medium`}
              >
                {unit.difficulty}
              </Badge>
            </div>

            <div className="text-white">
              <h3 className="text-xl font-bold mb-2 leading-tight">
                {unit.title}
              </h3>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{progress?.totalLessons || 3} lessons</span>
                </div>
                <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {progressPercentage}% complete
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-1">
            {unit.description}
          </p>

          {/* Progress Info */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-100">
              {progress?.completedSentences || 0}/
              {progress?.totalSentences || 30} sentences
            </span>
            {progress?.averageScore && (
              <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium border border-green-100">
                Avg: {Math.round(progress.averageScore)}%
              </span>
            )}
          </div>

          {/* CTA Button */}
          <Button
            asChild
            className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 bg-gray-50 text-gray-700 hover:bg-gray-100 border-0 shadow-sm"
            variant="outline"
          >
            <Link href={`/dashboard/sentence-mode/${unit.id}`}>
              {isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Review Unit</span>
                </>
              ) : isStarted ? (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Continue Unit</span>
                </>
              ) : (
                <span>Start Unit</span>
              )}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
