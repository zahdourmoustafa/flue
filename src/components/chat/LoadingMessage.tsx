"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function LoadingMessage() {
  return (
    <div className="flex items-start gap-3 max-w-[80%]">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src="/emma-avatar.svg" alt="Emma" />
        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
          EM
        </AvatarFallback>
      </Avatar>

      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
