"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Volume2, RotateCcw } from "lucide-react";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { toast } from "sonner";

interface SpeechPracticeInterfaceProps {
  aiMessage: string;
  suggestedResponse: string;
  onCorrectResponse: (userInput: string) => void;
  onRetry: () => void;
  isGeneratingSuggestion: boolean;
  learningLanguage: string;
}

export function SpeechPracticeInterface({
  aiMessage,
  suggestedResponse,
  onCorrectResponse,
  onRetry,
  isGeneratingSuggestion,
  learningLanguage,
}: SpeechPracticeInterfaceProps) {
  const [currentAttempt, setCurrentAttempt] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  // Reset practice state when suggestedResponse changes
  useEffect(() => {
    setIsCorrect(null);
    setCurrentAttempt("");
    setAttemptCount(0);
  }, [suggestedResponse]);

  const { speakMessage, isPlaying: isSpeaking } = useTextToSpeech();

  const handleTranscriptionComplete = (
    transcription: string,
    audioUrl: string
  ) => {
    setCurrentAttempt(transcription);

    // Simple similarity check (can be improved with more sophisticated matching)
    const accuracy = calculateSimilarity(
      transcription.toLowerCase().trim(),
      suggestedResponse.toLowerCase().trim()
    );

    if (accuracy > 0.7) {
      // 70% similarity threshold
      setIsCorrect(true);
      toast.success("Great! Your pronunciation was correct!");
      setTimeout(() => {
        onCorrectResponse(transcription);
      }, 1000);
    } else {
      setIsCorrect(false);
      setAttemptCount((prev) => prev + 1);
      toast.error("Try again! Listen to the pronunciation and repeat.");
    }
  };

  const { isRecording, isTranscribing, startRecording, stopRecording } =
    useSpeechToText(handleTranscriptionComplete);

  // Simple string similarity calculation
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
      setIsCorrect(null);
      setCurrentAttempt("");
    }
  };

  const handlePlaySuggestion = () => {
    speakMessage(suggestedResponse, learningLanguage);
  };

  const handleRetry = () => {
    setCurrentAttempt("");
    setIsCorrect(null);
    setAttemptCount(0);
    onRetry();
  };

  if (isGeneratingSuggestion || !suggestedResponse) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-blue-200 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">
            Generating your response suggestion...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Practice Section */}
      <Card
        className={`transition-colors ${
          isCorrect === null
            ? "bg-blue-50 border-blue-200"
            : isCorrect
            ? "bg-green-50 border-green-200"
            : "bg-red-50 border-red-200"
        }`}
      >
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3
              className={`text-lg font-medium ${
                isCorrect === null
                  ? "text-blue-800"
                  : isCorrect
                  ? "text-green-800"
                  : "text-red-800"
              }`}
            >
              {isCorrect === null
                ? "It's your turn, read it out loud:"
                : isCorrect
                ? "Perfect! Well done!"
                : "Try again, read it out loud:"}
            </h3>

            {/* Suggested Response */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-800 font-medium">
                    {suggestedResponse}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlaySuggestion}
                    disabled={isSpeaking}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Attempt Display */}
            {currentAttempt && (
              <div className="text-sm text-gray-600">
                <strong>You said:</strong> "{currentAttempt}"
              </div>
            )}

            {/* Microphone Button */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleMicClick}
                disabled={isTranscribing || isCorrect === true}
                className={`w-16 h-16 rounded-full ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600"
                    : isCorrect === true
                    ? "bg-green-500"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                <Mic className="w-8 h-8 text-white" />
              </Button>

              {attemptCount > 2 && (
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Skip & Continue
                </Button>
              )}
            </div>

            <p className="text-sm text-gray-600">
              {isRecording
                ? "Listening... Click again to stop"
                : isTranscribing
                ? "Processing your speech..."
                : isCorrect === true
                ? "Moving to next response..."
                : "Click the microphone and say the response above"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
