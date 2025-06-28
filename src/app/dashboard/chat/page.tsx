"use client";

import { ChatInterface } from "@/components/chat/ChatInterface";
import { ChatErrorBoundary } from "@/components/chat/ChatErrorBoundary";
import { useTimeTracker } from "@/hooks/useTimeTracker";

export default function ChatPage() {
  useTimeTracker("chat-mode");

  return (
    <ChatErrorBoundary>
      <ChatInterface />
    </ChatErrorBoundary>
  );
}
