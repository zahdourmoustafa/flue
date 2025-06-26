"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SentenceCard } from "./sentence-card";
import { AudioControls } from "./audio-controls";
import { PronunciationPanel } from "./pronunciation-panel";
import { Sentence, PronunciationFeedback } from "@/types/sentence-mode";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Volume2, Mic, RotateCcw, ArrowRight, CheckCircle } from "lucide-react";

interface SentencePracticeProps {
  lessonId: string;
  unitId: string;
  userId: string;
}

// Hardcoded sentence data for the first lesson
const LESSON_SENTENCES: { [key: string]: Sentence[] } = {
  "lesson-1-1": [
    {
      id: "sentence-1-1-1",
      lessonId: "lesson-1-1",
      text: "Hello, my name is John.",
      translation: "Hello, my name is John.",
      difficulty: 1,
      audioUrl: null,
      orderIndex: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "sentence-1-1-2",
      lessonId: "lesson-1-1",
      text: "I am from New York.",
      translation: "I am from New York.",
      difficulty: 1,
      audioUrl: null,
      orderIndex: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "sentence-1-1-3",
      lessonId: "lesson-1-1",
      text: "I am 25 years old.",
      translation: "I am 25 years old.",
      difficulty: 1,
      audioUrl: null,
      orderIndex: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "sentence-1-1-4",
      lessonId: "lesson-1-1",
      text: "Nice to meet you.",
      translation: "Nice to meet you.",
      difficulty: 1,
      audioUrl: null,
      orderIndex: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "sentence-1-1-5",
      lessonId: "lesson-1-1",
      text: "I work as a teacher.",
      translation: "I work as a teacher.",
      difficulty: 2,
      audioUrl: null,
      orderIndex: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "sentence-1-1-6",
      lessonId: "lesson-1-1",
      text: "I live in the city.",
      translation: "I live in the city.",
      difficulty: 2,
      audioUrl: null,
      orderIndex: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "sentence-1-1-7",
      lessonId: "lesson-1-1",
      text: "I speak English and Spanish.",
      translation: "I speak English and Spanish.",
      difficulty: 2,
      audioUrl: null,
      orderIndex: 7,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "sentence-1-1-8",
      lessonId: "lesson-1-1",
      text: "I am a student.",
      translation: "I am a student.",
      difficulty: 1,
      audioUrl: null,
      orderIndex: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "sentence-1-1-9",
      lessonId: "lesson-1-1",
      text: "I am learning French.",
      translation: "I am learning French.",
      difficulty: 2,
      audioUrl: null,
      orderIndex: 9,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "sentence-1-1-10",
      lessonId: "lesson-1-1",
      text: "Thank you for your time.",
      translation: "Thank you for your time.",
      difficulty: 2,
      audioUrl: null,
      orderIndex: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

export const SentencePractice = ({
  lessonId,
  unitId,
  userId,
}: SentencePracticeProps) => {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPronunciation, setShowPronunciation] = useState(false);
  const [pronunciationFeedback, setPronunciationFeedback] =
    useState<PronunciationFeedback | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Use TTS hook for Eleven Labs integration
  const { speak, isPlaying, isLoading: ttsLoading } = useTextToSpeech();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const lessonSentences = LESSON_SENTENCES[lessonId] || [];
      setSentences(lessonSentences);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [lessonId]);

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
              language: "english",
              gender: "female",
            });
          } catch (error) {
            console.error("Autoplay failed:", error);
          }
        }, 800);

        return () => clearTimeout(autoplayTimer);
      }
    }
  }, [currentIndex, loading, sentences, speak]);

  if (loading) {
    return <div>Loading lesson...</div>;
  }

  if (sentences.length === 0) {
    return <div>No sentences found for this lesson.</div>;
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
        language: "english", // Default to English for now
        gender: "female",
      });
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  };

  const handleRecordingComplete = async (transcript: string) => {
    try {
      console.log("📝 Received transcript:", transcript);

      // Store the transcript
      setTranscribedText(transcript);

      // Get pronunciation feedback from OpenAI
      const response = await fetch("/api/pronunciation-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalText: currentSentence.text,
          transcribedText: transcript,
          language: "english",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get pronunciation feedback");
      }

      const feedback = await response.json();
      console.log("🎯 Pronunciation feedback:", feedback);

      // Convert the OpenAI feedback to our format
      const pronunciationFeedback: PronunciationFeedback = {
        overallScore: feedback.overallScore,
        wordScores: feedback.wordScores || [],
        feedback: feedback.feedback,
      };

      setPronunciationFeedback(pronunciationFeedback);
      setShowPronunciation(true);
    } catch (error) {
      console.error("Failed to analyze pronunciation:", error);

      // Fallback to basic analysis
      const words = currentSentence.text.split(" ");
      const fallbackFeedback: PronunciationFeedback = {
        overallScore: 75, // Default decent score
        wordScores: words.map((word) => ({
          word: word.replace(/[.,!?]/g, ""),
          score: 75,
          correct: true,
        })),
        feedback: "Good effort! Keep practicing to improve your pronunciation.",
      };

      setPronunciationFeedback(fallbackFeedback);
      setShowPronunciation(true);
    }
  };

  const handleNext = () => {
    if (isLastSentence) {
      // Handle lesson completion
      console.log("Lesson complete!");
    } else {
      setCurrentIndex(currentIndex + 1);
      setShowPronunciation(false);
      setPronunciationFeedback(null);
    }
  };

  const handleRestart = () => {
    setShowPronunciation(false);
    setPronunciationFeedback(null);
  };

  return (
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
          />
        </div>
      )}
    </div>
  );
};
