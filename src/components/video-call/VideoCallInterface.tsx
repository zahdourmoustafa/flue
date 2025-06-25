"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVideoCall } from "./hooks/useVideoCall";
import { VideoCallScenario } from "@/types/video-call";
import { cn } from "@/lib/utils";
import { LoadingDots } from "@/components/ui/loading-dots";
import { PhoneOff } from "lucide-react";

interface VideoCallInterfaceProps {
  scenario: VideoCallScenario;
  className?: string;
}

export const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({
  scenario,
  className,
}) => {
  const { session, isLoading, error, createConversation } = useVideoCall();

  const [isEnding, setIsEnding] = useState(false);

  // Initialize conversation and auto-join
  const conversationInitRef = useRef(false);
  useEffect(() => {
    if (!conversationInitRef.current && !session) {
      conversationInitRef.current = true;
      createConversation(scenario.id);
    }
  }, [scenario.id, session, createConversation]);

  // Monitor iframe and auto-end conversation when user leaves
  useEffect(() => {
    if (!session?.conversationId) return;

    let isCallActive = true;
    let pollInterval: NodeJS.Timeout;

    const endConversation = async () => {
      if (!isCallActive) return;
      isCallActive = false;

      try {
        await fetch(`/api/video-call/end/${session.conversationId}`, {
          method: "POST",
        });
        console.log("Conversation ended successfully");
      } catch (error) {
        console.error("Failed to end conversation:", error);
      }
    };

    // Listen for ALL messages for debugging
    const handleMessage = (event: MessageEvent) => {
      // Log all messages to understand what Tavus/Daily sends
      console.log("🔍 PostMessage received:", {
        origin: event.origin,
        data: event.data,
        source: event.source === window ? "window" : "iframe",
      });

      // Be more permissive with origins due to potential iframe restrictions
      if (
        event.origin.includes("daily.co") ||
        event.origin.includes("tavus") ||
        event.origin.includes("meet") ||
        event.origin === "null" || // Sometimes iframes send null origin
        event.origin === "" || // Empty origin
        true // Temporarily accept all origins for debugging
      ) {
        console.log("📹 Potential Tavus/Daily message:", event.data);

        // Check for leave/end events from Tavus interface
        if (event.data) {
          const data = event.data;
          const dataStr = JSON.stringify(data).toLowerCase();

          // ANY message from iframe might indicate activity - trigger aggressive checking
          console.log(
            "🔄 Iframe activity detected, starting aggressive status checking"
          );

          // Start rapid polling for 10 seconds after any iframe activity
          let rapidCheckCount = 0;
          const rapidCheck = setInterval(async () => {
            rapidCheckCount++;
            console.log(`🔥 Rapid check #${rapidCheckCount}`);
            await checkConversationStatus();

            if (rapidCheckCount >= 20) {
              // 20 checks = 10 seconds at 500ms intervals
              clearInterval(rapidCheck);
              console.log("🔥 Rapid checking complete");

              // If still active after 10 seconds of rapid checking, force end
              if (isCallActive) {
                console.log(
                  "⚠️ Conversation still active after user interaction - force ending"
                );
                handleTavusLeave();
              }
            }
          }, 500);

          // Daily.co specific events (based on their documentation)
          if (
            // Daily.co standard events
            data.action === "left-meeting" ||
            data.action === "participant-left" ||
            data.action === "meeting-ended" ||
            data.action === "error" ||
            // Alternative event formats
            data.type === "left-meeting" ||
            data.type === "participant-left" ||
            data.type === "meeting-ended" ||
            data.event === "left-meeting" ||
            data.event === "participant-left" ||
            data.event === "meeting-ended" ||
            // String-based checks for various formats
            dataStr.includes('"action":"left-meeting"') ||
            dataStr.includes('"action":"participant-left"') ||
            dataStr.includes('"type":"left-meeting"') ||
            dataStr.includes('"event":"left-meeting"') ||
            dataStr.includes("left-meeting") ||
            dataStr.includes("participant-left") ||
            dataStr.includes("meeting-ended") ||
            dataStr.includes("call-ended") ||
            dataStr.includes("disconnected")
          ) {
            console.log(
              "✅ User left meeting via Tavus interface - Event:",
              data
            );
            handleTavusLeave();
          }
        }
      }
    };

    // Handle when user leaves via Tavus interface - same as manual end
    const handleTavusLeave = async () => {
      if (!isCallActive) return;
      isCallActive = false;

      try {
        await fetch(`/api/video-call/end/${session.conversationId}`, {
          method: "POST",
        });
        console.log("Conversation ended via Tavus Leave button");
        // Redirect back to scenarios page
        window.location.href = "/dashboard/videocall";
      } catch (error) {
        console.error("Failed to end conversation via Tavus leave:", error);
        // Still redirect even if API call fails
        window.location.href = "/dashboard/videocall";
      }
    };

    // Monitor iframe for meeting end state
    const checkIframeMeetingState = () => {
      if (!isCallActive) return;

      const iframe = document.querySelector(
        'iframe[title="Tavus Video Call"]'
      ) as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        try {
          // Check if iframe shows "meeting has ended" message
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow.document;
          if (iframeDoc) {
            const bodyText = iframeDoc.body?.textContent || "";
            if (
              bodyText.includes("meeting has ended") ||
              bodyText.includes("The meeting has ended") ||
              bodyText.includes("meeting ended") ||
              bodyText.includes("call has ended")
            ) {
              console.log("Meeting ended detected in iframe content");
              handleTavusLeave();
            }
          }
        } catch (error) {
          // Cross-origin restrictions - this is expected
        }
      }
    };

    // Poll the Tavus API to check conversation status
    const checkConversationStatus = async () => {
      if (!isCallActive) return;

      try {
        const response = await fetch(
          `/api/video-call/status/${session.conversationId}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("📊 API Status Check:", data);

          // If Tavus reports the conversation as ended, redirect immediately
          if (data.status === "ended") {
            isCallActive = false;
            console.log(
              "✅ Conversation ended - detected via API status check - Status:",
              data.status
            );
            window.location.href = "/dashboard/videocall";
          } else if (data.status !== "active") {
            console.log("⚠️ Unexpected conversation status:", data.status);
          }
        } else {
          console.log("❌ API status check failed:", response.status);
        }
      } catch (error) {
        console.error("❌ Failed to check conversation status:", error);
      }
    };

    // Add message listener
    window.addEventListener("message", handleMessage);

    // Add beforeunload listener for when user closes tab or navigates away
    const handleBeforeUnload = () => {
      if (isCallActive && session?.conversationId) {
        // Use sendBeacon for reliable request when leaving page
        navigator.sendBeacon(
          `/api/video-call/cleanup/${session.conversationId}`
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Add visibility change listener for when user switches tabs or minimizes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("👁️ Page became hidden, checking if meeting ended");
        // Check if meeting ended after a short delay
        setTimeout(() => {
          if (isCallActive) {
            checkConversationStatus();
          }
        }, 2000);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Add focus listeners to detect when user returns to page
    const handleWindowFocus = () => {
      console.log("🔄 Window focused, checking conversation status");
      if (isCallActive) {
        checkConversationStatus();
      }
    };
    window.addEventListener("focus", handleWindowFocus);

    // Check status every 500ms for more responsive detection
    pollInterval = setInterval(() => {
      checkConversationStatus();
      checkIframeMeetingState();
      checkIframeUrl();
    }, 500);

    // Monitor iframe URL changes
    let lastIframeUrl = session.conversationUrl;
    const checkIframeUrl = () => {
      if (!isCallActive) return;

      const iframe = document.querySelector(
        'iframe[title="Tavus Video Call"]'
      ) as HTMLIFrameElement;

      if (iframe) {
        try {
          // If iframe src has changed or iframe is no longer accessible
          if (iframe.src !== lastIframeUrl) {
            console.log("🔄 Iframe URL changed:", iframe.src);
            lastIframeUrl = iframe.src;

            // If URL indicates meeting ended
            if (
              iframe.src.includes("ended") ||
              iframe.src.includes("left") ||
              !iframe.src.includes("daily.co")
            ) {
              console.log("🚫 Meeting ended detected via URL change");
              handleTavusLeave();
            }
          }
        } catch (error) {
          // Cross-origin restrictions
        }
      }
    };

    // Cleanup function
    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      endConversation();
    };
  }, [session?.conversationId]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <LoadingDots />
          <p className="mt-4 text-gray-600">Preparing video call...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to start video call</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!session?.conversationUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-600">No video session available</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-6xl mx-auto space-y-4", className)}>
      {/* Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {scenario.category}
                </Badge>
                <Badge
                  variant={
                    scenario.difficulty === "Basics"
                      ? "default"
                      : scenario.difficulty === "Intermediate"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {scenario.difficulty}
                </Badge>
              </div>
              <h1 className="text-xl font-semibold">{scenario.name}</h1>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Call Container - RED ZONE */}
      <Card>
        <CardContent className="p-0">
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <div
              className="w-full aspect-video min-h-[500px] bg-gray-900 flex items-center justify-center"
              style={{ minHeight: "500px" }}
            >
              {/* Tavus Meet Interface - Direct Embed */}
              {session?.conversationUrl && (
                <iframe
                  src={session.conversationUrl}
                  title="Tavus Video Call"
                  className="w-full h-full"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  allow="camera; microphone; autoplay; encrypted-media; fullscreen; display-capture"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Debug Info */}
      {session?.conversationUrl && (
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">
              <p>Conversation ID: {session.conversationId}</p>
              <p>Status: Active (Polling every second)</p>
              <p className="text-xs mt-2">
                Use the native Daily.co leave button in the video interface.
                Check console for detection logs.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scenario Info */}
      <Card>
        <CardContent className="p-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Scenario Description</h3>
              <p className="text-gray-600 text-sm">{scenario.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Skills You'll Practice</h3>
              <div className="flex flex-wrap gap-2">
                {scenario.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
