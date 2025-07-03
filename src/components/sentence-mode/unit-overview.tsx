"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SentenceProgress } from "./sentence-progress";
import { SentenceUnit, SentenceLesson } from "@/types/sentence-mode";
import { BookOpen, Play, CheckCircle, Clock } from "lucide-react";

interface UnitOverviewProps {
  unitId: string;
  userId: string;
}

// Hardcoded lesson data for the first three units
const UNIT_LESSONS: { [key: string]: SentenceLesson[] } = {
  "unit-1": [
    {
      id: "lesson-1-1",
      unitId: "unit-1",
      title: "Introducing Yourself",
      description: "Learn to introduce yourself in casual and formal settings",
      orderIndex: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-1-1",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-1-2",
      unitId: "unit-1",
      title: "Introducing Someone Else",
      description: "Practice introducing friends, family, and colleagues",
      orderIndex: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-1-2",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-1-3",
      unitId: "unit-1",
      title: "Formal Introductions",
      description: "Master professional and formal introduction scenarios",
      orderIndex: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-1-3",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
  ],
  "unit-2": [
    {
      id: "lesson-2-1",
      unitId: "unit-2",
      title: "Using Public Transport",
      description: "Navigate buses, trains, and subway systems",
      orderIndex: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-2-1",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-2-2",
      unitId: "unit-2",
      title: "Asking for Directions",
      description: "Get help finding your way around the city",
      orderIndex: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-2-2",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-2-3",
      unitId: "unit-2",
      title: "Places in the City",
      description: "Talk about various city locations and landmarks",
      orderIndex: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-2-3",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
  ],
  "unit-3": [
    {
      id: "lesson-3-1",
      unitId: "unit-3",
      title: "At the Airport",
      description: "Handle airport procedures and conversations",
      orderIndex: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-3-1",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-3-2",
      unitId: "unit-3",
      title: "Hotel Reservations",
      description: "Book rooms and communicate with hotel staff",
      orderIndex: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-3-2",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-3-3",
      unitId: "unit-3",
      title: "Sightseeing",
      description: "Explore tourist attractions and ask about places",
      orderIndex: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-3-3",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
  ],
  "unit-4": [
    {
      id: "lesson-4-1",
      unitId: "unit-4",
      title: "Ordering Food",
      description:
        "ordering meals at restaurants, understanding menus, dietary restrictions",
      orderIndex: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-4-1",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-4-2",
      unitId: "unit-4",
      title: "Food Preferences",
      description:
        "discussing food likes, dislikes, allergies, and cooking methods",
      orderIndex: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-4-2",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-4-3",
      unitId: "unit-4",
      title: "Dining Etiquette",
      description:
        "understanding cultural dining norms and polite conversation at meals",
      orderIndex: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-4-3",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
  ],
  "unit-5": [
    {
      id: "lesson-5-1",
      unitId: "unit-5",
      title: "Job Interviews",
      description:
        "professional interviews, discussing skills, experience, and qualifications",
      orderIndex: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-5-1",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-5-2",
      unitId: "unit-5",
      title: "Office Communication",
      description:
        "workplace conversations, meetings, emails, and colleague interactions",
      orderIndex: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-5-2",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-5-3",
      unitId: "unit-5",
      title: "Business Presentations",
      description:
        "formal presentations, explaining ideas, and professional speaking",
      orderIndex: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-5-3",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
  ],
  "unit-6": [
    {
      id: "lesson-6-1",
      unitId: "unit-6",
      title: "Doctor Appointments",
      description:
        "scheduling medical appointments, describing symptoms, and understanding medical advice",
      orderIndex: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-6-1",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-6-2",
      unitId: "unit-6",
      title: "Pharmacy Visits",
      description:
        "picking up prescriptions, asking about medications, and understanding dosage instructions",
      orderIndex: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-6-2",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-6-3",
      unitId: "unit-6",
      title: "Health and Wellness",
      description:
        "discussing health habits, fitness routines, and wellness practices",
      orderIndex: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-6-3",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
  ],
  "unit-7": [
    {
      id: "lesson-7-1",
      unitId: "unit-7",
      title: "At the Store",
      description:
        "shopping for clothes, electronics, and everyday items, asking for sizes and prices",
      orderIndex: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-7-1",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-7-2",
      unitId: "unit-7",
      title: "Market and Grocery Shopping",
      description:
        "buying groceries, asking for fresh produce, and understanding product labels",
      orderIndex: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-7-2",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-7-3",
      unitId: "unit-7",
      title: "Returns and Exchanges",
      description:
        "returning items, understanding return policies, and handling shopping issues",
      orderIndex: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-7-3",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
  ],
  "unit-8": [
    {
      id: "lesson-8-1",
      unitId: "unit-8",
      title: "Movies and TV",
      description:
        "discussing films, TV shows, preferences, and entertainment opinions",
      orderIndex: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-8-1",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-8-2",
      unitId: "unit-8",
      title: "Music and Concerts",
      description:
        "talking about music genres, favorite artists, and live performance experiences",
      orderIndex: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-8-2",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-8-3",
      unitId: "unit-8",
      title: "Sports and Games",
      description:
        "discussing sports, games, competitions, and recreational activities",
      orderIndex: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-8-3",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
  ],
  "unit-9": [
    {
      id: "lesson-9-1",
      unitId: "unit-9",
      title: "Holidays and Celebrations",
      description:
        "discussing cultural holidays, celebrations, and traditional customs",
      orderIndex: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-9-1",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-9-2",
      unitId: "unit-9",
      title: "History and Heritage",
      description:
        "talking about historical events, cultural heritage, and national identity",
      orderIndex: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-9-2",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-9-3",
      unitId: "unit-9",
      title: "Social Customs",
      description:
        "understanding social norms, etiquette, and informal communication styles",
      orderIndex: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-9-3",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
  ],
  "unit-10": [
    {
      id: "lesson-10-1",
      unitId: "unit-10",
      title: "Debates and Discussions",
      description:
        "engaging in complex debates, expressing opinions, and defending arguments",
      orderIndex: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-10-1",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-10-2",
      unitId: "unit-10",
      title: "Abstract Concepts",
      description:
        "discussing abstract topics like philosophy, art, and science",
      orderIndex: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-10-2",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
    {
      id: "lesson-10-3",
      unitId: "unit-10",
      title: "Storytelling",
      description:
        "narrating personal stories, anecdotes, and complex events with detail",
      orderIndex: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        lessonId: "lesson-10-3",
        totalSentences: 10,
        completedSentences: 0,
        averageScore: null,
        isCompleted: false,
      },
    },
  ],
};

const UNIT_INFO: { [key: string]: SentenceUnit } = {
  "unit-1": {
    id: "unit-1",
    title: "Making Introductions",
    description: "Learn to introduce yourself and others in various contexts",
    difficulty: "beginner",
    orderIndex: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "unit-2": {
    id: "unit-2",
    title: "In the City",
    description: "Navigate urban environments and ask for directions",
    difficulty: "beginner",
    orderIndex: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "unit-3": {
    id: "unit-3",
    title: "Travel",
    description: "Essential phrases for airports, hotels, and sightseeing",
    difficulty: "intermediate",
    orderIndex: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "unit-4": {
    id: "unit-4",
    title: "Food & Dining",
    description: "Order food and discuss dining preferences",
    difficulty: "intermediate",
    orderIndex: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "unit-5": {
    id: "unit-5",
    title: "Work & Business",
    description: "Professional conversations and workplace interactions",
    difficulty: "intermediate",
    orderIndex: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "unit-6": {
    id: "unit-6",
    title: "Health & Medical",
    description: "Medical appointments and health-related conversations",
    difficulty: "intermediate",
    orderIndex: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "unit-7": {
    id: "unit-7",
    title: "Shopping",
    description: "Shopping conversations and making purchases",
    difficulty: "intermediate",
    orderIndex: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "unit-8": {
    id: "unit-8",
    title: "Entertainment",
    description: "Movies, music, and leisure activities",
    difficulty: "advanced",
    orderIndex: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "unit-9": {
    id: "unit-9",
    title: "Culture & Traditions",
    description: "Discuss cultural topics and traditions",
    difficulty: "advanced",
    orderIndex: 9,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "unit-10": {
    id: "unit-10",
    title: "Advanced Conversations",
    description: "Complex discussions and advanced vocabulary",
    difficulty: "advanced",
    orderIndex: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const UnitOverview = ({ unitId, userId }: UnitOverviewProps) => {
  const [unit, setUnit] = useState<SentenceUnit | null>(null);
  const [lessons, setLessons] = useState<SentenceLesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const unitInfo = UNIT_INFO[unitId];
      const unitLessons = UNIT_LESSONS[unitId] || [];

      setUnit(unitInfo);
      setLessons(unitLessons);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [unitId, userId]);

  if (loading) {
    return <div>Loading unit...</div>;
  }

  if (!unit) {
    return <div>Unit not found</div>;
  }

  const totalSentences = lessons.reduce(
    (acc, lesson) => acc + (lesson.progress?.totalSentences || 0),
    0
  );
  const completedSentences = lessons.reduce(
    (acc, lesson) => acc + (lesson.progress?.completedSentences || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Unit Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {unit.title}
          </h1>
          <Badge variant="secondary" className="capitalize">
            {unit.difficulty}
          </Badge>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {unit.description}
        </p>
      </div>

      {/* Progress Overview */}
      <SentenceProgress
        completed={completedSentences}
        total={totalSentences}
        title="Unit Progress"
      />

      {/* Lessons Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Lessons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} unitId={unitId} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface LessonCardProps {
  lesson: SentenceLesson;
  unitId: string;
}

const getGradientForLesson = (orderIndex: number) => {
  const gradients = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-500",
    "from-cyan-500 to-blue-500",
    "from-violet-500 to-purple-600",
  ];
  return gradients[(orderIndex - 1) % gradients.length];
};

const LessonCard = ({ lesson, unitId }: LessonCardProps) => {
  const progress = lesson.progress;
  const progressPercentage = progress
    ? Math.round((progress.completedSentences / progress.totalSentences) * 100)
    : 0;

  const isStarted = progress && progress.completedSentences > 0;
  const isCompleted = progress?.isCompleted || false;
  const gradient = getGradientForLesson(lesson.orderIndex);

  return (
    <Card className="group hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 border-0 overflow-hidden bg-white dark:bg-gray-800">
      {/* Gradient Header */}
      <div
        className={`relative h-32 bg-gradient-to-br ${gradient} overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8" />

        {/* Content */}
        <div className="relative p-4 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white font-medium">
              {progressPercentage}%
            </div>
          </div>

          <div className="text-white">
            <h3 className="text-lg font-bold leading-tight line-clamp-2">
              {lesson.title}
            </h3>
            <div className="flex items-center gap-1 text-white/80 text-xs mt-1">
              <span>{progress?.totalSentences || 10} sentences</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-4 space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
          {lesson.description}
        </p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              {progress?.completedSentences || 0} /{" "}
              {progress?.totalSentences || 10} completed
            </span>
            {progress?.averageScore && (
              <span>Avg: {Math.round(progress.averageScore)}%</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isCompleted ? (
            <Button
              asChild
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href={`/dashboard/sentence-mode/${unitId}/${lesson.id}`}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Review Lesson
              </Link>
            </Button>
          ) : isStarted ? (
            <Button
              asChild
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href={`/dashboard/sentence-mode/${unitId}/${lesson.id}`}>
                <Clock className="h-4 w-4 mr-2" />
                Continue
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href={`/dashboard/sentence-mode/${unitId}/${lesson.id}`}>
                <Play className="h-4 w-4 mr-2" />
                Start Lesson
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
