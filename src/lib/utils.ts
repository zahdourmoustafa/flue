import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ALL_LANGUAGES } from "@/types/onboarding";

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

export function absoluteUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}${path}`;
}

// Helper to validate onboarding data is properly saved
export function validateOnboardingData(user: {
  learningLanguage?: string | null;
  languageLevel?: string | null;
}) {
  const issues = [];

  if (!user.learningLanguage) {
    issues.push(
      "Target language not set - this should have been saved during onboarding"
    );
  } else {
    const language = ALL_LANGUAGES.find(
      (lang) => lang.code === user.learningLanguage
    );
    if (!language) {
      issues.push(`Invalid language code: ${user.learningLanguage}`);
    }
  }

  if (!user.languageLevel) {
    issues.push(
      "Language level not set - this should have been saved during onboarding"
    );
  }

  return {
    isValid: issues.length === 0,
    issues,
    language: user.learningLanguage
      ? ALL_LANGUAGES.find((lang) => lang.code === user.learningLanguage)
      : null,
  };
}
