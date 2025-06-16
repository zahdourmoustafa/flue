"use client";

import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface TTSControlProps {
  className?: string;
}

export function TTSControl({ className }: TTSControlProps) {
  const { isPlaying, isLoading, stop } = useTextToSpeech();

  // Don't show anything if TTS is not active
  if (!isPlaying && !isLoading) return null;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      ) : (
        <Volume2 className="h-4 w-4 text-blue-600" />
      )}

      <span className="text-sm text-blue-800">
        {isLoading ? "Generating speech..." : "Emma is speaking"}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={stop}
        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
      >
        <VolumeX className="h-3 w-3" />
      </Button>
    </div>
  );
}
