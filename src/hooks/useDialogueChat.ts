"use client";

import {
  useMutation,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type ApiResponse,
  type ChatStartResponse,
  type ChatMessageResponse,
} from "@/types/api";

export interface DialogueChatStartParams {
  scenarioId: string;
}

export interface DialogueChatMessageParams {
  message: string;
  sessionId: string;
  scenarioId: string;
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

export function useDialogueChatStart(
  scenarioId: string
): UseQueryResult<ChatStartResponse, Error> {
  return useQuery<ChatStartResponse, Error>({
    queryKey: ["dialogue-chat", "start", scenarioId],
    queryFn: async (): Promise<ChatStartResponse> => {
      console.log("🚀 Starting dialogue session for scenario:", scenarioId);

      const response = await fetch("/api/dialogue/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ scenarioId }),
      });

      console.log("📡 Dialogue start response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Dialogue start failed:", errorText);
        throw new Error(
          `Failed to start dialogue: ${response.status} ${errorText}`
        );
      }

      const result: ApiResponse<ChatStartResponse> = await response.json();
      console.log("✅ Dialogue start result:", result);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to initialize dialogue");
      }

      return result.data;
    },
    enabled: !!scenarioId,
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error("🔥 Dialogue start error:", error);
      toast.error(
        "Failed to start dialogue. Please check your connection and try again."
      );
    },
  });
}

export function useDialogueChatMessage() {
  return useMutation({
    mutationFn: async (
      params: DialogueChatMessageParams
    ): Promise<ChatMessageResponse> => {
      console.log("💬 Sending dialogue message:", params.message);

      const response = await fetch("/api/dialogue/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(params),
      });

      console.log("📡 Dialogue message response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Dialogue message failed:", errorText);
        throw new Error(
          `Failed to send message: ${response.status} ${errorText}`
        );
      }

      const result: ApiResponse<ChatMessageResponse> = await response.json();
      console.log("✅ Dialogue message result:", result);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to process message");
      }

      return result.data;
    },
    onError: (error) => {
      console.error("🔥 Dialogue message error:", error);
      toast.error("Failed to send message. Please try again.");
    },
  });
}

export function useDialogueSuggestAnswer() {
  return useMutation({
    mutationFn: async (params: {
      lastAiMessage: string;
      scenarioId: string;
      conversationHistory: Array<{
        role: "user" | "assistant";
        content: string;
      }>;
    }): Promise<{ suggestedAnswer: string }> => {
      console.log(
        "💡 Generating dialogue suggestion for scenario:",
        params.scenarioId
      );

      const response = await fetch("/api/dialogue/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(params),
      });

      console.log("📡 Dialogue suggest response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Dialogue suggest failed:", errorText);
        throw new Error(
          `Failed to generate suggestion: ${response.status} ${errorText}`
        );
      }

      const result: ApiResponse<{ suggestedAnswer: string }> =
        await response.json();
      console.log("✅ Dialogue suggestion result:", result);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to generate suggested answer");
      }

      return result.data;
    },
    onError: (error) => {
      console.error("🔥 Dialogue suggest error:", error);
      toast.error("Failed to generate suggestion. Please try again.");
    },
  });
}
