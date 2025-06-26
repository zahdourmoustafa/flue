"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sentence } from "@/types/sentence-mode";
import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from "@/hooks/useTranslation";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Eye, EyeOff, Loader2, Volume2, VolumeX } from "lucide-react";

interface SentenceCardProps {
  sentence: Sentence;
}

export const SentenceCard = ({ sentence }: SentenceCardProps) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const { user } = useAuth();
  const { translation, isLoading, translate } = useTranslation();
  const { speak, isPlaying, isLoading: ttsLoading } = useTextToSpeech();

  // Get dynamic translation when user requests it
  useEffect(() => {
    if (showTranslation && user?.translationLanguage) {
      // Only translate if the target language is different from English
      if (user.translationLanguage !== "en") {
        translate(sentence.text, user.translationLanguage, "en");
      }
    }
  }, [showTranslation, user?.translationLanguage, sentence.text, translate]);

  const getDisplayTranslation = () => {
    if (!user?.translationLanguage || user.translationLanguage === "en") {
      // Default to English (hardcoded translation)
      return sentence.translation;
    }

    // Use dynamic translation for other languages
    return translation || sentence.translation;
  };

  const handleListen = async () => {
    try {
      await speak({
        text: sentence.text,
        language: "english",
        gender: "female",
      });
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  };

  const handleToggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  return (
    <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20 shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
            Read out loud:
          </h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={handleListen}
              disabled={isPlaying || ttsLoading}
            >
              {isPlaying || ttsLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4 mr-2" />
              )}
              {isPlaying ? "Playing..." : "Listen"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={handleToggleTranslation}
            >
              {showTranslation ? (
                <EyeOff className="w-4 h-4 mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              {showTranslation ? "Hide" : "Show"} Translation
            </Button>
          </div>
        </div>

        <div className="text-center py-6">
          <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {sentence.text}
          </p>

          {showTranslation && (
            <div className="mt-4 p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-blue-200 dark:border-blue-700">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Translating...
                  </span>
                </div>
              ) : (
                <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                  {getDisplayTranslation()}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
