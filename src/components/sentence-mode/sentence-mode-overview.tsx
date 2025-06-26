"use client";

import { useState, useEffect } from "react";
import { UnitCard } from "./unit-card";
import { SentenceProgress } from "./sentence-progress";
import { SentenceUnit } from "@/types/sentence-mode";

interface SentenceModeOverviewProps {
  userId: string;
}

// Hardcoded data for initial implementation
const SENTENCE_UNITS: SentenceUnit[] = [
  {
    id: "unit-1",
    title: "Making Introductions",
    description: "Learn to introduce yourself and others in various contexts",
    difficulty: "beginner",
    orderIndex: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: {
      unitId: "unit-1",
      totalLessons: 3,
      completedLessons: 0,
      totalSentences: 30,
      completedSentences: 0,
      averageScore: null,
      isCompleted: false,
    },
  },
  {
    id: "unit-2",
    title: "In the City",
    description: "Navigate urban environments and ask for directions",
    difficulty: "beginner",
    orderIndex: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: {
      unitId: "unit-2",
      totalLessons: 3,
      completedLessons: 0,
      totalSentences: 30,
      completedSentences: 0,
      averageScore: null,
      isCompleted: false,
    },
  },
  {
    id: "unit-3",
    title: "Travel",
    description: "Essential phrases for airports, hotels, and sightseeing",
    difficulty: "intermediate",
    orderIndex: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: {
      unitId: "unit-3",
      totalLessons: 3,
      completedLessons: 0,
      totalSentences: 30,
      completedSentences: 0,
      averageScore: null,
      isCompleted: false,
    },
  },
  {
    id: "unit-4",
    title: "Food & Dining",
    description: "Order food and discuss dining preferences",
    difficulty: "intermediate",
    orderIndex: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: {
      unitId: "unit-4",
      totalLessons: 3,
      completedLessons: 0,
      totalSentences: 30,
      completedSentences: 0,
      averageScore: null,
      isCompleted: false,
    },
  },
  {
    id: "unit-5",
    title: "Work & Business",
    description: "Professional conversations and workplace interactions",
    difficulty: "intermediate",
    orderIndex: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: {
      unitId: "unit-5",
      totalLessons: 3,
      completedLessons: 0,
      totalSentences: 30,
      completedSentences: 0,
      averageScore: null,
      isCompleted: false,
    },
  },
  {
    id: "unit-6",
    title: "Health & Medical",
    description: "Medical appointments and health-related conversations",
    difficulty: "intermediate",
    orderIndex: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: {
      unitId: "unit-6",
      totalLessons: 3,
      completedLessons: 0,
      totalSentences: 30,
      completedSentences: 0,
      averageScore: null,
      isCompleted: false,
    },
  },
  {
    id: "unit-7",
    title: "Shopping",
    description: "Shopping conversations and making purchases",
    difficulty: "intermediate",
    orderIndex: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: {
      unitId: "unit-7",
      totalLessons: 3,
      completedLessons: 0,
      totalSentences: 30,
      completedSentences: 0,
      averageScore: null,
      isCompleted: false,
    },
  },
  {
    id: "unit-8",
    title: "Entertainment",
    description: "Movies, music, and leisure activities",
    difficulty: "advanced",
    orderIndex: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: {
      unitId: "unit-8",
      totalLessons: 3,
      completedLessons: 0,
      totalSentences: 30,
      completedSentences: 0,
      averageScore: null,
      isCompleted: false,
    },
  },
  {
    id: "unit-9",
    title: "Culture & Traditions",
    description: "Discuss cultural topics and traditions",
    difficulty: "advanced",
    orderIndex: 9,
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: {
      unitId: "unit-9",
      totalLessons: 3,
      completedLessons: 0,
      totalSentences: 30,
      completedSentences: 0,
      averageScore: null,
      isCompleted: false,
    },
  },
  {
    id: "unit-10",
    title: "Advanced Conversations",
    description: "Complex discussions and advanced vocabulary",
    difficulty: "advanced",
    orderIndex: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: {
      unitId: "unit-10",
      totalLessons: 3,
      completedLessons: 0,
      totalSentences: 30,
      completedSentences: 0,
      averageScore: null,
      isCompleted: false,
    },
  },
];

export const SentenceModeOverview = ({ userId }: SentenceModeOverviewProps) => {
  const [units, setUnits] = useState<SentenceUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setUnits(SENTENCE_UNITS);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [userId]);

  if (loading) {
    return <div>Loading units...</div>;
  }

  const totalProgress = units.reduce((acc, unit) => {
    return acc + (unit.progress?.completedSentences || 0);
  }, 0);

  const totalSentences = units.reduce((acc, unit) => {
    return acc + (unit.progress?.totalSentences || 0);
  }, 0);

  return (
    <div className="space-y-8">
      <SentenceProgress
        completed={totalProgress}
        total={totalSentences}
        title="Overall Progress"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
      </div>
    </div>
  );
};
