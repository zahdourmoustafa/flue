export interface DialogueScenario {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  category: string;
  systemPrompt: string;
  aiPersona: {
    name: string;
    role: string;
    characteristics: string[];
  };
  initialMessage: string;
  context: string;
}

export interface DialogueConfig {
  [scenarioId: string]: DialogueScenario;
}

export interface DialogueChatSession {
  id: string;
  userId: string;
  scenarioId: string;
  language: string;
  status: "active" | "completed" | "paused";
  createdAt: Date;
  updatedAt: Date;
}
