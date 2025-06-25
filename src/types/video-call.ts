export interface VideoCallScenario {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: "Basics" | "Intermediate" | "Advanced";
  duration: string;
  gradient: string;
  skills: string[];
  personaConfig: {
    systemPrompt: string;
    conversationalContext: string;
    customGreeting: string;
  };
}

export interface TavusConversation {
  conversation_id: string;
  conversation_name: string;
  conversation_url: string;
  status: "active" | "ended" | "created";
  replica_id: string;
  persona_id: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateConversationRequest {
  replica_id: string;
  persona_id: string;
  conversation_name: string;
  conversational_context: string;
  custom_greeting: string;
  callback_url?: string;
  properties?: {
    max_call_duration?: number;
    participant_left_timeout?: number;
    participant_absent_timeout?: number;
    enable_recording?: boolean;
    enable_closed_captions?: boolean;
    apply_greenscreen?: boolean;
    language?: string;
  };
}

export interface VideoCallSession {
  id: string;
  conversationId: string;
  scenarioId: string;
  conversationUrl: string;
  status: "idle" | "connecting" | "connected" | "ended" | "error";
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  error?: string;
}

export interface VideoCallContextType {
  session: VideoCallSession | null;
  isLoading: boolean;
  error: string | null;
  createConversation: (scenarioId: string, language?: string) => Promise<void>;
  joinConversation: (conversationUrl: string) => Promise<void>;
  endConversation: () => Promise<void>;
  clearError: () => void;
}
