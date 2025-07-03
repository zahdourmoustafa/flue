"use client";

import { useState, useCallback } from "react";
import { VideoCallSession } from "@/types/video-call";
import { v4 as uuidv4 } from "uuid";

export const useVideoCall = () => {
  const [session, setSession] = useState<VideoCallSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createConversation = useCallback(
    async (scenarioId: string, language?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // Create conversation via our API endpoint
        const response = await fetch("/api/video-call/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scenarioId,
            ...(language && { language }), // Only include language if explicitly provided
          }),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          throw new Error(
            `Failed to create conversation: ${
              errorData.error || response.statusText
            }`
          );
        }

        const conversationData = await response.json();
        console.log("Conversation created:", conversationData);

        const newSession: VideoCallSession = {
          id: uuidv4(),
          conversationId: conversationData.conversation_id,
          scenarioId,
          conversationUrl: conversationData.conversation_url,
          status: "connected",
          startedAt: new Date(),
        };

        setSession(newSession);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create conversation"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    session,
    isLoading,
    error,
    createConversation,
    clearError,
  };
};
