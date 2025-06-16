"use client";

import { X, Languages, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Message } from "@/types/chat";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-dots";
import { cn } from "@/lib/utils";

interface TranslationPanelProps {
  isOpen: boolean;
  message: Message | null;
  translation: string | null;
  isLoading: boolean;
  onClose: () => void;
}

export function TranslationPanel({
  isOpen,
  message,
  translation,
  isLoading,
  onClose,
}: TranslationPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (translation) {
      try {
        await navigator.clipboard.writeText(translation);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy translation:", error);
      }
    }
  };

  if (!isOpen || !message) return null;

  return (
    <div>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Translation
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* Original Message */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Original Message (
                  {message.senderType === "ai" ? "Spanish" : "Your Message"})
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800">
                  {message.originalMessage}
                </div>
              </div>

              {/* Translation */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    Translation (
                    {message.senderType === "ai" ? "English" : "Spanish"})
                  </h3>
                  {translation && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="h-8 px-2 text-xs"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <div className="bg-blue-50 rounded-lg p-3 min-h-[60px] flex items-center">
                  {isLoading ? (
                    <LoadingSpinner size="sm" text="Translating..." />
                  ) : translation ? (
                    <p className="text-sm text-gray-800">{translation}</p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Translation not available
                    </p>
                  )}
                </div>
              </div>

              {/* Helper Text */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  💡 <strong>Tip:</strong> Use translations to understand the
                  meaning, but try to practice reading the original text to
                  improve your language skills!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
