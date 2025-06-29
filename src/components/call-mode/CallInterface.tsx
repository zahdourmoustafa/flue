"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Phone, PhoneOff, Mic, MicOff, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CallStatus } from "./CallStatus";
import { CallControls } from "./CallControls";
import { VoiceWaveform } from "./VoiceWaveform";
import { useRealtimeCall } from "@/hooks/useRealtimeCall";

interface CallInterfaceProps {
  user: {
    id: string;
    name: string;
    learningLanguage?: string;
    languageLevel?: string;
  };
}

type CallState = "ringing" | "connecting" | "connected" | "ended";

export const CallInterface = ({ user }: CallInterfaceProps) => {
  const router = useRouter();
  const [callState, setCallState] = useState<CallState>("ringing");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const ringtonRef = useRef<HTMLAudioElement>(null);
  const durationInterval = useRef<NodeJS.Timeout>();

  const {
    isConnected,
    isUserSpeaking,
    isAISpeaking,
    error,
    connect,
    disconnect,
    toggleMute,
  } = useRealtimeCall({
    user,
    onCallStart: () => setCallState("connected"),
    onCallEnd: () => setCallState("ended"),
  });

  // Play ringing sound on mount
  useEffect(() => {
    if (callState === "ringing") {
      // Create a simple ringing sound using Web Audio API
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      let isPlaying = true;

      const playRingTone = () => {
        if (!isPlaying) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);

        setTimeout(() => playRingTone(), 1000);
      };

      playRingTone();

      // Auto-connect after 3 seconds
      const timer = setTimeout(() => {
        isPlaying = false;
        setCallState("connecting");
        setTimeout(() => {
          connect();
        }, 1000);
      }, 3000);

      return () => {
        isPlaying = false;
        clearTimeout(timer);
      };
    }

    return () => {
      // Cleanup function for when callState is not "ringing"
    };
  }, [callState, connect]);

  // Call duration timer
  useEffect(() => {
    if (callState === "connected") {
      durationInterval.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    }

    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, [callState]);

  const handleEndCall = () => {
    disconnect();
    setCallState("ended");
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    toggleMute();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getCallStatusText = () => {
    switch (callState) {
      case "ringing":
        return "Calling...";
      case "connecting":
        return "Connecting...";
      case "connected":
        return formatDuration(callDuration);
      case "ended":
        return "Call ended";
      default:
        return "";
    }
  };

  const getAvatarStatus = () => {
    if (callState === "ringing") return "ringing";
    if (callState === "connecting") return "connecting";
    if (isAISpeaking) return "speaking";
    if (isUserSpeaking) return "listening";
    return "connected";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Header */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
              Call Mode
            </h1>
          </div>
        </div>
      </div>

      {/* Main Call Interface */}
      <Card className="w-full max-w-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-2xl">
        <div className="p-6 text-center">
          {/* Emma Info */}
          <div className="mb-4">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Emma
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
              <div
                className={`w-2 h-2 rounded-full ${
                  callState === "connected"
                    ? "bg-green-500"
                    : callState === "connecting"
                    ? "bg-yellow-500"
                    : "bg-slate-400"
                }`}
              ></div>
              <span className="text-sm">{getCallStatusText()}</span>
            </div>
          </div>

          {/* Avatar with Visual Feedback */}
          <div className="relative mb-6">
            <div
              className={`relative inline-block ${
                callState === "ringing" ? "animate-pulse" : ""
              }`}
            >
              {/* Pulsing Ring for Ringing State */}
              {callState === "ringing" && (
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping opacity-30"></div>
              )}

              {/* Speaking Animation Ring */}
              {(isAISpeaking || isUserSpeaking) &&
                callState === "connected" && (
                  <div
                    className={`absolute inset-0 rounded-full border-4 ${
                      isAISpeaking ? "border-green-500" : "border-blue-500"
                    } animate-pulse`}
                  ></div>
                )}

              <Avatar className="w-32 h-32 border-4 border-white dark:border-slate-700 shadow-lg">
                <AvatarImage src="/emma-avatar.svg" alt="Emma" />
                <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  E
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Voice Waveform - Enhanced Speaking Indicator */}
          {callState === "connected" && (
            <div className="mb-6 min-h-[120px] flex items-center justify-center">
              <VoiceWaveform
                isUserSpeaking={isUserSpeaking}
                isAISpeaking={isAISpeaking}
              />
            </div>
          )}

          {/* Call Status */}
          <CallStatus
            state={callState}
            duration={callDuration}
            isConnected={isConnected}
            error={error || undefined}
          />

          {/* Call Controls */}
          <div className="mt-6">
            <CallControls
              callState={callState}
              isMuted={isMuted}
              onMuteToggle={handleMuteToggle}
              onEndCall={handleEndCall}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Learning Language Indicator */}
          {user.learningLanguage && callState === "connected" && (
            <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Speaking in{" "}
              {user.learningLanguage === "es" ? "Spanish" : "English"}
            </div>
          )}
        </div>
      </Card>

      {/* Call ended message */}
      {callState === "ended" && (
        <div className="mt-6 text-center">
          <p className="text-slate-600 dark:text-slate-300">
            Redirecting to dashboard...
          </p>
        </div>
      )}
    </div>
  );
};
