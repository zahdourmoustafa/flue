import { useMutation } from "@tanstack/react-query";

interface AnotherQuestionRequest {
  conversationHistory?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

interface AnotherQuestionResponse {
  success: boolean;
  data: {
    newQuestion: string;
    language: string;
  };
}

export const useAnotherQuestion = () => {
  return useMutation({
    mutationFn: async ({
      conversationHistory = [],
    }: AnotherQuestionRequest): Promise<AnotherQuestionResponse> => {
      const response = await fetch("/api/chat/another-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversationHistory }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate another question");
      }

      return response.json();
    },
  });
};
