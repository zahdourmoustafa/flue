"use client";

import { Button } from "@/components/ui/button";
import { PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface CallControlsProps {
  callState: "ringing" | "connecting" | "connected" | "ended";
  isMuted: boolean;
  onMuteToggle: () => void;
  onEndCall: () => void;
}

export const CallControls = ({
  callState,
  isMuted,
  onMuteToggle,
  onEndCall,
}: CallControlsProps) => {
  const isCallActive = callState === "connected";

  return (
    <div className="flex items-center justify-center gap-6">
      {/* Mute Button */}
      <Button
        variant="outline"
        size="lg"
        onClick={onMuteToggle}
        disabled={!isCallActive}
        className={`w-14 h-14 rounded-full border-2 transition-all ${
          !isCallActive
            ? "opacity-50 cursor-not-allowed"
            : isMuted
            ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        }`}
      >
        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </Button>

      {/* End Call Button */}
      <Button
        variant="destructive"
        size="lg"
        onClick={onEndCall}
        disabled={callState === "ended"}
        className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <PhoneOff className="w-7 h-7" />
      </Button>

      {/* Volume Button (placeholder for future feature) */}
      <Button
        variant="outline"
        size="lg"
        disabled={!isCallActive}
        className={`w-14 h-14 rounded-full border-2 transition-all ${
          !isCallActive
            ? "opacity-50 cursor-not-allowed"
            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        }`}
      >
        <Volume2 className="w-6 h-6" />
      </Button>
    </div>
  );
};
