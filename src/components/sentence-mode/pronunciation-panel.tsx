"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PronunciationFeedback } from "@/types/sentence-mode";
import { RotateCcw, ArrowRight, CheckCircle, X } from "lucide-react";

interface PronunciationPanelProps {
  feedback: PronunciationFeedback;
  originalSentence: string;
  userTranscript: string;
  onTryAgain: () => void;
  onNext: () => void;
  isLastSentence: boolean;
  onClose?: () => void;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600 dark:text-green-400";
  if (score >= 80) return "text-blue-600 dark:text-blue-400";
  if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
  if (score >= 60) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
};

const getScoreEmoji = (score: number) => {
  if (score >= 90) return "🤩";
  if (score >= 80) return "😄";
  if (score >= 70) return "😊";
  if (score >= 60) return "😐";
  return "😞";
};

const getScoreBgColor = (score: number) => {
  if (score >= 90)
    return "bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-700";
  if (score >= 80)
    return "bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700";
  if (score >= 70)
    return "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700";
  if (score >= 60)
    return "bg-orange-100 border-orange-300 dark:bg-orange-900/20 dark:border-orange-700";
  return "bg-red-100 border-red-300 dark:bg-red-900/20 dark:border-red-700";
};

export const PronunciationPanel = ({
  feedback,
  originalSentence,
  userTranscript,
  onTryAgain,
  onNext,
  isLastSentence,
  onClose,
}: PronunciationPanelProps) => {
  const scoreColor = getScoreColor(feedback.overallScore);
  const scoreEmoji = getScoreEmoji(feedback.overallScore);
  const scoreBgColor = getScoreBgColor(feedback.overallScore);

  return (
    <Card
      className={`h-full flex flex-col border-2 shadow-xl rounded-2xl ${scoreBgColor}`}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <CardTitle className="text-base font-bold">Pronunciation</CardTitle>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
            aria-label="Close pronunciation panel"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <Card className={`border-2 ${scoreBgColor}`}>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm">Pronunciation Score</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Overall Score */}
            <div className="text-center space-y-2">
              <div className="text-3xl">{scoreEmoji}</div>
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${scoreColor}`}>
                  {feedback.overallScore}
                </div>
                <Progress
                  value={feedback.overallScore}
                  className="h-1.5 w-20 mx-auto"
                />
              </div>
            </div>

            {/* Speech Comparison */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-center">
                Speech Comparison
              </h3>

              {/* Original Text */}
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
                <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                  📖 Expected:
                </div>
                <div className="text-xs text-blue-900 dark:text-blue-100 font-medium">
                  "{originalSentence}"
                </div>
              </div>

              {/* Transcribed Text */}
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-700">
                <div className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">
                  🎤 You said:
                </div>
                <div className="text-xs text-purple-900 dark:text-purple-100 font-medium">
                  "{userTranscript}"
                </div>
              </div>
            </div>

            {/* Word-by-word feedback */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-center">
                Word Analysis
              </h3>
              <div className="p-2 bg-white dark:bg-gray-800 rounded border">
                <div className="flex flex-wrap gap-1 justify-center">
                  {feedback.wordScores.map((wordScore, index) => (
                    <span
                      key={index}
                      className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        wordScore.correct
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                      title={`Score: ${wordScore.score}%${
                        wordScore.suggestion ? ` - ${wordScore.suggestion}` : ""
                      }`}
                    >
                      {wordScore.word}
                    </span>
                  ))}
                </div>
                <div className="text-center mt-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-100 dark:bg-green-900/30 rounded"></span>
                    Correct
                  </span>
                  <span className="inline-flex items-center gap-1 ml-3">
                    <span className="inline-block w-2 h-2 bg-red-100 dark:bg-red-900/30 rounded"></span>
                    Needs work
                  </span>
                </div>
              </div>
            </div>

            {/* Feedback Text */}
            <div className="text-center">
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-tight">
                {feedback.feedback}
              </p>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {feedback.wordScores.filter((w) => w.correct).length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Correct
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {feedback.wordScores.length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Total
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(
                    (feedback.wordScores.filter((w) => w.correct).length /
                      feedback.wordScores.length) *
                      100
                  )}
                  %
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Accuracy
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Card>
  );
};
