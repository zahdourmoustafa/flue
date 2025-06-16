import { useMutation } from "@tanstack/react-query";

interface TranslateRequest {
  text: string;
  from: string;
  to: string;
}

interface TranslateResponse {
  success: boolean;
  data: {
    translation: string;
    originalText: string;
    from: string;
    to: string;
  };
}

export const useTranslation = () => {
  return useMutation({
    mutationFn: async ({
      text,
      from,
      to,
    }: TranslateRequest): Promise<TranslateResponse> => {
      const response = await fetch("/api/chat/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, from, to }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Translation failed");
      }

      return response.json();
    },
  });
};
