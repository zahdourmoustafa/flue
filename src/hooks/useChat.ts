"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type ApiResponse,
  type ChatStartResponse,
  type ChatMessageResponse,
} from "@/types/api";

export interface UseChatOptions {
  enabled?: boolean;
}

export function useChatStart(options: UseChatOptions = {}) {
  return useQuery({
    queryKey: ["chat", "start"],
    queryFn: async (): Promise<ChatStartResponse> => {
      console.log("🚀 Starting chat session...");

      const response = await fetch("/api/chat/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for auth cookies
      });

      console.log("📡 Chat start response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Chat start failed:", errorText);
        throw new Error(
          `Failed to start chat: ${response.status} ${errorText}`
        );
      }

      const result: ApiResponse<ChatStartResponse> = await response.json();
      console.log("✅ Chat start result:", result);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to initialize chat");
      }

      return result.data;
    },
    enabled: options.enabled !== false,
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error("🔥 Chat start error:", error);
      toast.error(
        "Failed to start chat. Please check your connection and try again."
      );
    },
  });
}

export function useSuggestAnswer() {
  return useMutation({
    mutationFn: async (params: {
      lastAiMessage: string;
      conversationHistory: Array<{
        role: "user" | "assistant";
        content: string;
      }>;
    }): Promise<{ suggestedAnswer: string }> => {
      console.log("💡 Generating suggested answer...");

      const response = await fetch("/api/chat/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(params),
      });

      console.log("📡 Suggest answer response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Suggest answer failed:", errorText);
        throw new Error(
          `Failed to generate suggestion: ${response.status} ${errorText}`
        );
      }

      const result: ApiResponse<{ suggestedAnswer: string }> =
        await response.json();
      console.log("✅ Suggested answer result:", result);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to generate suggested answer");
      }

      return result.data;
    },
    onError: (error) => {
      console.error("🔥 Suggest answer error:", error);
      toast.error("Failed to generate suggestion. Please try again.");
    },
  });
}

export function useChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      message: string;
      sessionId: string;
      conversationHistory: Array<{
        role: "user" | "assistant";
        content: string;
      }>;
    }): Promise<ChatMessageResponse> => {
      console.log("💬 Sending message:", params.message);

      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(params),
      });

      console.log("📡 Chat message response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Chat message failed:", errorText);
        throw new Error(
          `Failed to send message: ${response.status} ${errorText}`
        );
      }

      const result: ApiResponse<ChatMessageResponse> = await response.json();
      console.log("✅ Chat message result:", result);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to process message");
      }

      return result.data;
    },
    onError: (error) => {
      console.error("🔥 Chat message error:", error);
      toast.error("Failed to send message. Please try again.");
    },
    onSuccess: () => {
      // Optionally invalidate queries if needed
      // queryClient.invalidateQueries(['chat'])
    },
  });
}

// Utility function to check if user is authenticated
export async function checkAuth(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/session", {
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}
