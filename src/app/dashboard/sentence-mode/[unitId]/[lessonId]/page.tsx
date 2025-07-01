"use client";

import { SentencePractice } from "@/components/sentence-mode";
import { useAuth } from "@/contexts/auth-context";
import { useNavigationContext } from "@/contexts";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTimeTracker } from "@/hooks/useTimeTracker";

interface LessonPracticePageProps {
  params: {
    unitId: string;
    lessonId: string;
  };
}

const LessonPracticePage = ({ params }: LessonPracticePageProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { navigateWithConfirmation } = useNavigationContext();
  useTimeTracker("sentence-mode");

  const handleBackNavigation = () => {
    const backPath = `/dashboard/sentence-mode/${params.unitId}`;
    if (navigateWithConfirmation) {
      navigateWithConfirmation(backPath);
    } else {
      router.push(backPath);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Please sign in to access this lesson
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col">
        <div className="mb-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackNavigation}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Unit
          </Button>
        </div>

        <SentencePractice
          lessonId={params.lessonId}
          unitId={params.unitId}
          userId={user.id}
        />
      </div>
    </div>
  );
};

export default LessonPracticePage;
