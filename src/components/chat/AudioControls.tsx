"use client";

import { RefreshCw, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioControlsProps {
  messageId: string;
  onRepeatAudio: (messageId: string) => void;
  onTranslate: (messageId: string) => void;
}

export function AudioControls({
  messageId,
  onRepeatAudio,
  onTranslate,
}: AudioControlsProps) {
  return (
    <div className="flex items-center gap-3 mt-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 text-gray-500 hover:text-gray-700 font-normal text-sm"
        onClick={() => onRepeatAudio(messageId)}
      >
        <RefreshCw className="h-3 w-3 mr-1" />
        Repeat
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 text-gray-500 hover:text-gray-700 font-normal text-sm"
        onClick={() => onTranslate(messageId)}
      >
        <Languages className="h-3 w-3 mr-1" />
        Translate
      </Button>
    </div>
  );
}
