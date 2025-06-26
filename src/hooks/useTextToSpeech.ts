import { useState, useEffect, useCallback } from "react";
import { ttsService } from "@/services/textToSpeechService";

interface TTSOptions {
  text: string;
  language: "english" | "spanish";
  gender?: "female" | "male";
}

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize TTS service on mount
  useEffect(() => {
    // Preload common phrases for instant playback
    ttsService.preloadCommonPhrases().catch(console.warn);
  }, []);

  /**
   * Speak text with instant audio playback
   */
  const speak = useCallback(
    async (options: TTSOptions, onComplete?: () => void) => {
      try {
        setIsLoading(true);
        setError(null);
        setIsPlaying(true);

        console.log("🗣️ Speaking via hook:", options);

        // Use fast speech for instant playback
        await ttsService.speakFast(options, onComplete);

        setIsPlaying(false);
      } catch (err) {
        console.error("❌ TTS Hook Error:", err);
        setError(err instanceof Error ? err.message : "TTS failed");
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Stop any currently playing audio
   */
  const stop = useCallback(() => {
    ttsService.stopAudio();
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  /**
   * Speak with automatic language detection based on learning language
   */
  const speakMessage = useCallback(
    async (
      text: string,
      learningLanguage: "es" | "en",
      onComplete?: () => void
    ) => {
      const language = learningLanguage === "es" ? "spanish" : "english";
      await speak({ text, language, gender: "female" }, onComplete);
    },
    [speak]
  );

  return {
    speak,
    speakMessage,
    stop,
    isPlaying,
    isLoading,
    error,
  };
};
