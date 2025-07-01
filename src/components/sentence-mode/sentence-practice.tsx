"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SentenceCard } from "./sentence-card";
import { AudioControls } from "./audio-controls";
import { PronunciationPanel } from "./pronunciation-panel";
import { Sentence, PronunciationFeedback } from "@/types/sentence-mode";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useDynamicSentences } from "@/hooks/useDynamicSentences";
import { useUserProfile, getTTSLanguage } from "@/hooks/useUserProfile";
import {
  Volume2,
  Mic,
  RotateCcw,
  ArrowRight,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { NavigationProvider } from "@/contexts/navigation-context";

interface SentencePracticeProps {
  lessonId: string;
  unitId: string;
  userId: string;
}

export const SentencePractice = ({
  lessonId,
  unitId,
  userId,
}: SentencePracticeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPronunciation, setShowPronunciation] = useState(false);
  const [pronunciationFeedback, setPronunciationFeedback] =
    useState<PronunciationFeedback | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [isAnalyzingPronunciation, setIsAnalyzingPronunciation] =
    useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

  const router = useRouter();

  // Use dynamic sentences hook
  const { sentences, loading, error, refetch } = useDynamicSentences({
    unitId,
    lessonId,
    count: 10,
  });

  // Get user profile for language settings
  const { profile: userProfile } = useUserProfile();

  // Use TTS hook for Eleven Labs integration
  const { speak, isPlaying, isLoading: ttsLoading } = useTextToSpeech();

  // Get the correct language for TTS
  const ttsLanguage = getTTSLanguage(userProfile?.learningLanguage);

  // Autoplay current sentence when it changes
  useEffect(() => {
    if (!loading && sentences.length > 0) {
      const currentSentence = sentences[currentIndex];
      if (currentSentence) {
        // Autoplay the sentence after a short delay
        const autoplayTimer = setTimeout(async () => {
          try {
            await speak({
              text: currentSentence.text,
              language: ttsLanguage,
              gender: "female",
            });
          } catch (error) {
            console.error("Autoplay failed:", error);
          }
        }, 800);

        return () => clearTimeout(autoplayTimer);
      }
    }

    return () => {
      // Cleanup function for when conditions are not met
    };
  }, [currentIndex, loading, sentences, speak]);

  // Handle browser navigation (refresh, close tab, etc.)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentIndex > 0 || pronunciationFeedback) {
        e.preventDefault();
        e.returnValue =
          "Are you sure you want to leave? Your progress will be lost.";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentIndex, pronunciationFeedback]);

  // Clean up function to stop all ongoing processes
  const cleanupBeforeLeave = () => {
    // Stop any ongoing TTS
    if (isPlaying) {
      // TTS cleanup would happen automatically when component unmounts
    }

    // Clear any ongoing analysis
    setIsAnalyzingPronunciation(false);

    // Reset all states
    setShowPronunciation(false);
    setPronunciationFeedback(null);
    setTranscribedText("");
  };

  const handleLeaveConfirm = () => {
    cleanupBeforeLeave();
    setShowLeaveDialog(false);

    if (pendingNavigation) {
      router.push(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleLeaveCancel = () => {
    setShowLeaveDialog(false);
    setPendingNavigation(null);
  };

  // Function to check if user should be prompted before leaving
  const shouldPromptBeforeLeave = () => {
    return currentIndex > 0 || pronunciationFeedback || transcribedText;
  };

  // Custom navigation function that shows dialog if needed
  const navigateWithConfirmation = (path: string) => {
    if (shouldPromptBeforeLeave()) {
      setPendingNavigation(path);
      setShowLeaveDialog(true);
    } else {
      cleanupBeforeLeave();
      router.push(path);
    }
  };

  // Expose navigation function to parent components via context or props
  useEffect(() => {
    // Override browser back button
    const handlePopState = (e: PopStateEvent) => {
      if (shouldPromptBeforeLeave()) {
        e.preventDefault();
        setPendingNavigation(window.location.pathname);
        setShowLeaveDialog(true);
        // Push current state back to prevent navigation
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    window.addEventListener("popstate", handlePopState);
    // Push initial state to handle back button
    window.history.pushState(null, "", window.location.pathname);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentIndex, pronunciationFeedback, transcribedText]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Generating personalized sentences for your learning language...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">Error generating sentences: {error}</p>
        <Button onClick={refetch} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (sentences.length === 0 && !loading) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">
          No sentences could be generated for this lesson.
        </p>
        <p className="text-sm text-gray-500 mt-2 mb-4">
          Please try again or contact support if the issue persists.
        </p>
        <Button onClick={refetch} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Generate New Sentences
        </Button>
      </div>
    );
  }

  const currentSentence = sentences[currentIndex];
  const progressPercentage = Math.round(
    ((currentIndex + 1) / sentences.length) * 100
  );
  const isLastSentence = currentIndex === sentences.length - 1;

  const handlePlayAudio = async () => {
    if (!currentSentence) return;

    try {
      await speak({
        text: currentSentence.text,
        language: ttsLanguage,
        gender: "female",
      });
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  };

  const handleRecordingComplete = async (transcript: string) => {
    console.log("📝 Received transcript:", transcript);

    // Store the transcript immediately
    setTranscribedText(transcript);

    // Show instant basic feedback while detailed analysis runs in background
    const instantFeedback = generateInstantFeedback(
      currentSentence.text,
      transcript
    );
    setPronunciationFeedback(instantFeedback);
    setShowPronunciation(true);

    // Run detailed analysis in background
    setIsAnalyzingPronunciation(true);
    try {
      const response = await fetch("/api/pronunciation-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalText: currentSentence.text,
          transcribedText: transcript,
          language: ttsLanguage,
        }),
      });

      if (response.ok) {
        const feedback = await response.json();
        console.log("🎯 Enhanced pronunciation feedback:", feedback);

        // Update with detailed feedback
        const enhancedFeedback: PronunciationFeedback = {
          overallScore: feedback.overallScore,
          wordScores: feedback.wordScores || [],
          feedback: feedback.feedback,
          strengths: feedback.strengths,
          improvements: feedback.improvements,
        };

        setPronunciationFeedback(enhancedFeedback);
      }
    } catch (error) {
      console.error("Failed to get enhanced analysis:", error);
      // Keep the instant feedback if detailed analysis fails
    } finally {
      setIsAnalyzingPronunciation(false);
    }
  };

  // Generate instant feedback based on basic text similarity
  const generateInstantFeedback = (
    original: string,
    transcribed: string
  ): PronunciationFeedback => {
    const originalWords = original
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .split(" ");
    const transcribedWords = transcribed
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .split(" ");

    // Calculate basic similarity
    const similarity = calculateSimilarity(originalWords, transcribedWords);
    const overallScore = Math.round(similarity * 100);

    // Generate word scores
    const wordScores = originalWords.map((word, index) => {
      const transcribedWord = transcribedWords[index] || "";
      const wordSimilarity =
        word === transcribedWord
          ? 100
          : transcribedWord.includes(word) || word.includes(transcribedWord)
          ? 70
          : 50;

      return {
        word: word,
        score: wordSimilarity,
        correct: wordSimilarity >= 70,
        suggestion: wordSimilarity < 70 ? word : undefined,
      };
    });

    // Generate encouragement message
    let feedback = "";
    if (overallScore >= 90) {
      feedback = "Excellent pronunciation! You nailed it! 🎉";
    } else if (overallScore >= 75) {
      feedback = "Great job! Your pronunciation is very good! 👍";
    } else if (overallScore >= 60) {
      feedback = "Good effort! Keep practicing to improve. 💪";
    } else {
      feedback = "Don't worry, pronunciation takes practice. Try again! 😊";
    }

    return {
      overallScore,
      wordScores,
      feedback,
    };
  };

  // Simple similarity calculation
  const calculateSimilarity = (arr1: string[], arr2: string[]): number => {
    if (arr1.length === 0 && arr2.length === 0) return 1;
    if (arr1.length === 0 || arr2.length === 0) return 0;

    const maxLength = Math.max(arr1.length, arr2.length);
    let matches = 0;

    for (let i = 0; i < maxLength; i++) {
      const word1 = arr1[i] || "";
      const word2 = arr2[i] || "";

      if (word1 === word2) {
        matches += 1;
      } else if (word1.includes(word2) || word2.includes(word1)) {
        matches += 0.7;
      }
    }

    return matches / maxLength;
  };

  const handleNext = () => {
    if (isLastSentence) {
      // Handle lesson completion
      console.log("Lesson complete!");
    } else {
      setCurrentIndex(currentIndex + 1);
      setShowPronunciation(false);
      setPronunciationFeedback(null);
      setTranscribedText(""); // Reset transcribed text
      setIsAnalyzingPronunciation(false); // Reset analyzing state
      setResetTrigger((prev) => prev + 1); // Reset audio controls
    }
  };

  const handleRestart = () => {
    setShowPronunciation(false);
    setPronunciationFeedback(null);
    setTranscribedText(""); // Reset transcribed text
    setIsAnalyzingPronunciation(false); // Reset analyzing state
    setResetTrigger((prev) => prev + 1); // Reset audio controls
  };

  return (
    <NavigationProvider
      navigateWithConfirmation={navigateWithConfirmation}
      shouldPromptBeforeLeave={shouldPromptBeforeLeave}
    >
      <div className="flex-1 flex gap-8 items-start">
        <div className="flex-grow flex flex-col gap-6">
          {/* Progress and Sentence */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Sentence {currentIndex + 1} of {sentences.length}
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {progressPercentage}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Current Sentence */}
          <SentenceCard sentence={currentSentence} />

          {/* Practice Section */}
          <Card className="flex-grow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Practice</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-6">
              <AudioControls
                onListen={handlePlayAudio}
                onRecordingComplete={handleRecordingComplete}
                isRecording={false}
                isPlaying={isPlaying || ttsLoading}
                resetTrigger={resetTrigger}
              />

              {pronunciationFeedback && (
                <div className="mt-6 w-full text-center">
                  <Button
                    onClick={handleNext}
                    className="w-full max-w-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    disabled={!pronunciationFeedback}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Next Sentence
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {showPronunciation && pronunciationFeedback && (
          <div className="w-full max-w-md">
            <PronunciationPanel
              feedback={pronunciationFeedback}
              originalSentence={currentSentence.text}
              userTranscript={transcribedText}
              onTryAgain={handleRestart}
              onNext={handleNext}
              isLastSentence={isLastSentence}
              isAnalyzing={isAnalyzingPronunciation}
            />
          </div>
        )}
      </div>

      {/* Leave Confirmation Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Sentence Practice?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave? Your current progress will be lost
              and any ongoing recordings will be stopped.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleLeaveCancel}>
              Stay Here
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Leave Practice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </NavigationProvider>
  );
};
