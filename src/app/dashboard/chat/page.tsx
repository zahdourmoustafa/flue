import { ChatInterface } from "@/components/chat/ChatInterface";
import { ChatErrorBoundary } from "@/components/chat/ChatErrorBoundary";

export default function ChatPage() {
  return (
    <ChatErrorBoundary>
      <ChatInterface />
    </ChatErrorBoundary>
  );
}
