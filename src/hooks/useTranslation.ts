import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface TranslateParams {
  text: string;
  from: string;
  to: string;
}

interface TranslateResponse {
  translatedText: string;
}

const translateMessage = async ({
  text,
  from,
  to,
}: TranslateParams): Promise<TranslateResponse> => {
  const response = await fetch("/api/chat/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, from, to }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to translate message");
  }

  return response.json();
};

export const useTranslation = () => {
  const mutation = useMutation<TranslateResponse, Error, TranslateParams>({
    mutationFn: translateMessage,
    onSuccess: () => {
      // We can remove the toast from here to avoid repetitive notifications,
      // as the UI will update to show the translation.
      // toast.success("Message translated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "An unexpected error occurred.");
    },
  });

  return mutation;
};
