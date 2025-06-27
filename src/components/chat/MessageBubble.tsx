"use client";

import { AlertTriangle, Mic } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AudioControls } from "./AudioControls";
import { type Message } from "@/types/chat";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  onErrorIconClick: (message: Message) => void;
  onRepeatAudio: (messageId: string) => void;
  onTranslate: (message: Message) => void;
  onPlayPronunciation: (audioUrl: string) => void;
}

export function MessageBubble({
  message,
  onErrorIconClick,
  onRepeatAudio,
  onTranslate,
  onPlayPronunciation,
}: MessageBubbleProps) {
  const isAI = message.senderType === "ai";
  const isUser = message.senderType === "user";

  if (isAI) {
    return (
      <div className="flex items-start gap-3 max-w-[80%]">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src="/emma-avatar.svg" alt="Emma" />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
            EM
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-2">
          <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
            <p className="text-gray-900 leading-relaxed">
              {message.originalMessage}
            </p>
          </div>

          <AudioControls
            message={message}
            onRepeatAudio={onRepeatAudio}
            onTranslate={onTranslate}
          />
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-3 max-w-[80%] ml-auto">
        <div className="flex flex-col items-end gap-2">
          <div className="relative">
            <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3">
              <p className="leading-relaxed">{message.originalMessage}</p>
            </div>

            {message.hasErrors && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6 bg-orange-500 hover:bg-orange-600 rounded-full p-0"
                onClick={() => onErrorIconClick(message)}
              >
                <AlertTriangle className="h-3 w-3 text-white" />
              </Button>
            )}
          </div>
          {message.audioUrl && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 px-3 rounded-full"
                onClick={() => onPlayPronunciation(message.audioUrl!)}
              >
                <Mic className="h-3 w-3 mr-1.5" />
                Pronunciation
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
