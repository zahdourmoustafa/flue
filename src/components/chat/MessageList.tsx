"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { LoadingMessage } from "./LoadingMessage";
import { TypingIndicator } from "./TypingIndicator";
import { type Message } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isAiTyping?: boolean;
  onErrorIconClick: (message: Message) => void;
  onRepeatAudio: (messageId: string) => void;
  onTranslate: (message: Message) => void;
  onPlayPronunciation: (audioUrl: string) => void;
}

export function MessageList({
  messages,
  isLoading,
  isAiTyping = false,
  onErrorIconClick,
  onRepeatAudio,
  onTranslate,
  onPlayPronunciation,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onErrorIconClick={onErrorIconClick}
          onRepeatAudio={onRepeatAudio}
          onTranslate={onTranslate}
          onPlayPronunciation={onPlayPronunciation}
        />
      ))}

      {isLoading && <LoadingMessage />}
      {isAiTyping && <TypingIndicator />}

      {/* Invisible div to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
}
