"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { CallStatus } from "./CallStatus";
import { CallControls } from "./CallControls";
import { VoiceWaveform } from "./VoiceWaveform";
import { useRealtimeCall } from "@/hooks/useRealtimeCall";
import { useUserProfile } from "@/hooks/useUserProfile";

interface CallInterfaceProps {
  user: {
    id: string;
    name: string;
    learningLanguage?: string;
    languageLevel?: string;
  };
}

type CallState =
  | "initializing"
  | "setup"
  | "ringing"
  | "connecting"
  | "connected"
  | "ended";

export const CallInterface = ({ user }: CallInterfaceProps) => {
  const router = useRouter();
  const [callState, setCallState] = useState<CallState>("initializing");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const durationInterval = useRef<NodeJS.Timeout>();

  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile();

  const completeUser = useMemo(
    () => ({
      ...user,
      learningLanguage: profile?.learningLanguage || user.learningLanguage,
      languageLevel: profile?.languageLevel || user.languageLevel,
    }),
    [user, profile]
  );

  const {
    isConnected,
    isUserSpeaking,
    isAISpeaking,
    error: callError,
    connect,
    disconnect,
    toggleMute,
  } = useRealtimeCall({
    user: completeUser,
    onCallStart: () => setCallState("connected"),
    onCallEnd: () => setCallState("ended"),
  });

  useEffect(() => {
    if (!profileLoading) {
      setCallState("setup");
    }
  }, [profileLoading]);

  // Handle ringing and connection
  useEffect(() => {
    if (callState === "setup" && completeUser.learningLanguage) {
      setCallState("ringing");
    }
  }, [callState, completeUser.learningLanguage]);

  // Sound and auto-connect effect
  useEffect(() => {
    if (callState === "ringing") {
      // Logic for ringing sound (can be simplified or implemented as before)
      const timer = setTimeout(() => {
        setCallState("connecting");
        connect();
      }, 2000); // Ring for 2 seconds then connect

      return () => clearTimeout(timer);
    }
  }, [callState, connect]);

  // Call duration timer
  useEffect(() => {
    if (callState === "connected") {
      durationInterval.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
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
    router.push("/dashboard");
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    toggleMute();
  };

  if (callState === "initializing" || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (callState === "setup" && !completeUser.learningLanguage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Language Not Set
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Please set your learning language in your profile settings to use
            Call Mode.
          </p>
          <Button onClick={() => router.push("/dashboard/account/profile")}>
            Go to Profile Settings
          </Button>
        </Card>
      </div>
    );
  }

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
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Call Mode
          </h1>
        </div>
      </div>

      {/* Main Call Interface */}
      <Card className="w-full max-w-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-2xl">
        <div className="p-6 text-center">
          <div className="mb-4">
            <Avatar className="w-32 h-32 mx-auto border-4 border-white dark:border-slate-700 shadow-lg">
              <AvatarImage src="/emma-avatar.svg" alt="Emma" />
              <AvatarFallback>E</AvatarFallback>
            </Avatar>
          </div>
          <CallStatus
            state={callState}
            duration={callDuration}
            isConnected={isConnected}
            error={callError || profileError?.message}
          />
          <div className="my-6">
            <VoiceWaveform
              isUserSpeaking={isUserSpeaking}
              isAISpeaking={isAISpeaking}
            />
          </div>
          <CallControls
            callState={callState}
            isMuted={isMuted}
            onMuteToggle={handleMuteToggle}
            onEndCall={handleEndCall}
          />
        </div>
      </Card>
    </div>
  );
};
