import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to convert learning language to TTS language format
export const getTTSLanguage = (learningLanguage: string | null): string => {
  if (!learningLanguage) return "english";

  const languageMap: Record<string, string> = {
    // Language codes
    es: "spanish",
    en: "english",
    fr: "french",
    de: "german",
    it: "italian",
    pt: "portuguese",
    ja: "japanese",
    ko: "korean",
    zh: "chinese",
    ar: "arabic",
    ru: "russian",
    tr: "turkish",
    nl: "dutch",
    pl: "polish",
    // Full language names (lowercase)
    spanish: "spanish",
    english: "english",
    french: "french",
    german: "german",
    italian: "italian",
    portuguese: "portuguese",
    japanese: "japanese",
    korean: "korean",
    chinese: "chinese",
    arabic: "arabic",
    russian: "russian",
    turkish: "turkish",
    dutch: "dutch",
    polish: "polish",
  };

  const normalized = learningLanguage.toLowerCase().trim();
  const result = languageMap[normalized] || "english";

  console.log(`🔤 Language mapping: "${learningLanguage}" -> "${result}"`);
  return result;
};
