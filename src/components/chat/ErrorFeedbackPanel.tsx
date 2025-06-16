"use client";

import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Message } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ErrorFeedbackPanelProps {
  isOpen: boolean;
  message: Message | null;
  onClose: () => void;
}

export function ErrorFeedbackPanel({
  isOpen,
  message,
  onClose,
}: ErrorFeedbackPanelProps) {
  if (!message) return null;

  return (
    <>
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
            <h2 className="text-lg font-semibold text-gray-900">Feedback</h2>
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
              {/* Your Message */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Your message
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-900 bg-gray-50 rounded-lg p-3">
                    {message.originalMessage}
                  </p>
                </CardContent>
              </Card>

              {/* Corrected Message */}
              {message.correctedMessage && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-700">
                      Corrected message
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-900 bg-green-50 border border-green-200 rounded-lg p-3">
                      {message.correctedMessage}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Explanation */}
              {message.correctionExplanation && (
                <Card className="bg-orange-50 border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Explanation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-orange-900 text-sm leading-relaxed">
                      {message.correctionExplanation}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Advanced Feedback Button */}
              <Button
                variant="outline"
                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Advanced feedback
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
