"use client";

import { useState, KeyboardEvent, useEffect, useRef } from "react";
import { Send, Mic, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner, ThreeDots } from "@/components/ui/loading-dots";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { VoiceWaveform } from "./VoiceWaveform";

interface ChatInputProps {
  onSendMessage: (message: string, audioUrl?: string) => void;
  disabled?: boolean;
  prefilledText?: string;
  onPrefilledTextUsed?: () => void;
  onSuggestAnswer?: () => void;
  onAnotherQuestion?: () => void;
  isGeneratingSuggestion?: boolean;
  isGeneratingQuestion?: boolean;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  prefilledText,
  onPrefilledTextUsed,
  onSuggestAnswer,
  onAnotherQuestion,
  isGeneratingSuggestion = false,
  isGeneratingQuestion = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useSpeechToText((text, audioUrl) => {
    onSendMessage(text, audioUrl);
  });

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    if (prefilledText) {
      setMessage(prefilledText);
      onPrefilledTextUsed?.();
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.select();
        }
      }, 100);
    }
  }, [prefilledText, onPrefilledTextUsed]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Main input area content
  const renderInputArea = () => {
    if (isRecording || isTranscribing) {
      return (
        <div className="flex-1 relative min-h-[44px] rounded-2xl border border-gray-300 px-3 py-2 flex items-center bg-blue-50">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-red-500 hover:bg-red-100"
            onClick={cancelRecording}
            disabled={isTranscribing}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <VoiceWaveform />
          <Button
            size="icon"
            className="ml-auto h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700"
            onClick={handleMicClick}
            disabled={isTranscribing}
          >
            {isTranscribing ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      );
    }

    if (isGeneratingSuggestion) {
      return (
        <div className="min-h-[44px] max-h-32 rounded-2xl border border-gray-300 px-3 py-2 flex items-center bg-gray-50">
          <ThreeDots size="sm" text="Generating suggestion..." />
        </div>
      );
    }

    return (
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Aa"
          className="min-h-[44px] max-h-32 resize-none rounded-2xl border-gray-300 pr-12 focus:border-blue-500 focus:ring-blue-500"
          disabled={disabled}
        />
        {message.trim() ? (
          <Button
            size="icon"
            className="absolute right-2 bottom-2 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700"
            onClick={handleSend}
            disabled={disabled}
          >
            <Send className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-2 h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={handleMicClick}
            disabled={disabled}
          >
            <Mic className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Quick Action Buttons */}
      <div className="flex gap-3 mb-3">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-gray-600 border-gray-300 hover:bg-gray-50"
          onClick={onAnotherQuestion}
          disabled={disabled || isGeneratingQuestion}
        >
          {isGeneratingQuestion ? (
            <LoadingSpinner size="sm" text="Generating..." />
          ) : (
            "Another question"
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-gray-600 border-gray-300 hover:bg-gray-50"
          onClick={onSuggestAnswer}
          disabled={disabled || isGeneratingSuggestion}
        >
          {isGeneratingSuggestion ? (
            <LoadingSpinner size="sm" text="Generating..." />
          ) : (
            "Suggest answer"
          )}
        </Button>
      </div>

      {/* Input Area */}
      <div className="flex items-end gap-3">{renderInputArea()}</div>
    </div>
  );
}
