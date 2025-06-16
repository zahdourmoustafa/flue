// API Response Types for Chat Feature

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ChatStartResponse {
  sessionId: string;
  userId: string;
  learningLanguage: string;
  initialMessage: string;
  user: {
    name: string;
    learningLanguage: string | null;
    languageLevel: string | null;
  };
}

export interface ChatMessageResponse {
  aiResponse: string;
  hasErrors: boolean;
  correctedMessage?: string;
  explanation?: string;
  timestamp: string;
}

export interface ChatMessageRequest {
  message: string;
  sessionId: string;
  conversationHistory?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}
