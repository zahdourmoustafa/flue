"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThreeDots } from "@/components/ui/loading-dots";

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 p-4 animate-fade-in">
      {/* Emma's Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
          E
        </AvatarFallback>
      </Avatar>

      {/* Typing bubble */}
      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs">
        <ThreeDots size="md" text="Emma is typing" />
      </div>
    </div>
  );
}
