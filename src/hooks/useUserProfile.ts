import { useState, useEffect } from "react";

export interface UserProfile {
  learningLanguage: string | null;
  languageLevel: string | null;
  preferredLanguage: string;
}

interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/profile");

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
  };
};

// Helper function to convert learning language to TTS language format
export const getTTSLanguage = (learningLanguage: string | null): string => {
  if (!learningLanguage) return "english";

  const languageMap: Record<string, string> = {
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
  };

  return languageMap[learningLanguage.toLowerCase()] || "english";
};
