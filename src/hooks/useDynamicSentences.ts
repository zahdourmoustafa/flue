import { useState, useEffect } from "react";
import { Sentence } from "@/types/sentence-mode";

interface UseDynamicSentencesOptions {
  unitId: string;
  lessonId: string;
  count?: number;
  useCache?: boolean;
}

interface UseDynamicSentencesReturn {
  sentences: Sentence[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isFromCache: boolean;
}

// Simple in-memory cache for sentences
const sentenceCache = new Map<
  string,
  { sentences: Sentence[]; timestamp: number }
>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const useDynamicSentences = ({
  unitId,
  lessonId,
  count = 10,
  useCache = true,
}: UseDynamicSentencesOptions): UseDynamicSentencesReturn => {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const getCacheKey = () => `${unitId}-${lessonId}-${count}`;

  const fetchSentences = async (bypassCache = false) => {
    setLoading(true);
    setError(null);
    setIsFromCache(false);

    const cacheKey = getCacheKey();

    // Check cache first (unless bypassing)
    if (useCache && !bypassCache) {
      const cached = sentenceCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setSentences(cached.sentences);
        setIsFromCache(true);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/sentences/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unitId,
          lessonId,
          count,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate sentences");
      }

      const data = await response.json();

      // Cache the new sentences
      if (useCache) {
        sentenceCache.set(cacheKey, {
          sentences: data.sentences,
          timestamp: Date.now(),
        });
      }

      setSentences(data.sentences);
      setIsFromCache(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching sentences:", err);

      // Fallback sentences in case of error
      setSentences([
        {
          id: "fallback-1",
          lessonId,
          text: "Hello, how are you?",
          translation: "Hello, how are you?",
          difficulty: 1,
          audioUrl: null,
          orderIndex: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "fallback-2",
          lessonId,
          text: "Nice to meet you.",
          translation: "Nice to meet you.",
          difficulty: 1,
          audioUrl: null,
          orderIndex: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      setIsFromCache(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (unitId && lessonId) {
      fetchSentences();
    }
  }, [unitId, lessonId, count]);

  const refetch = () => {
    fetchSentences(true); // Bypass cache on manual refetch
  };

  return {
    sentences,
    loading,
    error,
    refetch,
    isFromCache,
  };
};
