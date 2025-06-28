"use client";

import { useParams } from "next/navigation";
import { DialogueChatInterface } from "@/components/dialogue/DialogueChatInterface";
import { ChatErrorBoundary } from "@/components/chat/ChatErrorBoundary";
import { getDialogueConfig } from "@/lib/dialogue-config";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTimeTracker } from "@/hooks/useTimeTracker";

export default function DialoguePracticePage() {
  const params = useParams();
  const scenarioId = params.scenarioId as string;
  useTimeTracker("dialogue-mode");

  // Get the dialogue configuration
  const dialogueConfig = getDialogueConfig(scenarioId);

  if (!dialogueConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Scenario Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The dialogue scenario you're looking for doesn't exist.
          </p>
          <Link href="/dashboard/dialogue">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dialogue Practice
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ChatErrorBoundary>
      <DialogueChatInterface scenarioConfig={dialogueConfig} />
    </ChatErrorBoundary>
  );
}
