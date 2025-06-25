"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VideoCallInterface } from "./VideoCallInterface";
import { VideoCallScenario } from "@/types/video-call";

const demoScenario: VideoCallScenario = {
  id: "demo-call",
  name: "Demo Video Call",
  description: "A simple demo of the video call functionality with AI",
  category: "Demo",
  difficulty: "Basics",
  duration: "5-10 min",
  gradient: "from-blue-500 to-purple-600",
  skills: ["Video Calling", "AI Interaction", "Testing"],
  personaConfig: {
    systemPrompt:
      "You are a friendly AI assistant helping test the video call functionality.",
    conversationalContext: "This is a demo video call to test the system.",
    customGreeting:
      "Hello! Welcome to the video call demo. How are you doing today?",
  },
};

export const VideoCallDemo: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);

  if (showDemo) {
    return <VideoCallInterface scenario={demoScenario} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Video Call Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Test the video call functionality with a demo AI conversation.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">
                Before starting:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Make sure your camera and microphone are connected</li>
                <li>• Ensure you have a stable internet connection</li>
                <li>• Grant camera/microphone permissions when prompted</li>
                <li>
                  • Add TAVUS_API_KEY, TAVUS_PERSONA_ID, and TAVUS_REPLICA_ID to
                  your .env file
                </li>
              </ul>
            </div>
            <Button
              onClick={() => setShowDemo(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Start Demo Video Call
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
