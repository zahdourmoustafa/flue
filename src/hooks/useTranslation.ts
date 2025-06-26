import { useState, useCallback } from "react";

interface TranslationState {
  translation: string | null;
  isLoading: boolean;
  error: string | null;
}

interface TranslationResponse {
  translation: string;
  originalText: string;
  sourceLanguage: string;
  targetLanguage: string;
  error?: string;
}

export const useTranslation = () => {
  const [state, setState] = useState<TranslationState>({
    translation: null,
    isLoading: false,
    error: null,
  });

  const translate = useCallback(
    async (text: string, targetLanguage: string, sourceLanguage = "en") => {
      // If target language is the same as source, return original text
      if (targetLanguage === sourceLanguage) {
        setState({
          translation: text,
          isLoading: false,
          error: null,
        });
        return text;
      }

      setState({
        translation: null,
        isLoading: true,
        error: null,
      });

      try {
        console.log("🌐 Requesting translation:", {
          text: text.substring(0, 50) + "...",
          from: sourceLanguage,
          to: targetLanguage,
        });

        const response = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            targetLanguage,
            sourceLanguage,
          }),
        });

        if (!response.ok) {
          throw new Error("Translation request failed");
        }

        const data: TranslationResponse = await response.json();

        setState({
          translation: data.translation,
          isLoading: false,
          error: data.error || null,
        });

        return data.translation;
      } catch (error) {
        console.error("Translation error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Translation failed";

        setState({
          translation: text, // Fallback to original text
          isLoading: false,
          error: errorMessage,
        });

        return text; // Return original text as fallback
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      translation: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    translation: state.translation,
    isLoading: state.isLoading,
    error: state.error,
    translate,
    reset,
  };
};
