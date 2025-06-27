"use client";

import { useEffect, useState } from "react";
import { Mic, MicOff } from "lucide-react";

interface VoiceWaveformProps {
  isUserSpeaking: boolean;
  isAISpeaking: boolean;
}

export const VoiceWaveform = ({
  isUserSpeaking,
  isAISpeaking,
}: VoiceWaveformProps) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (isUserSpeaking || isAISpeaking) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [isUserSpeaking, isAISpeaking]);

  const isActive = isUserSpeaking || isAISpeaking;
  const activeColor = isUserSpeaking ? "bg-blue-500" : "bg-green-500";
  const activeBorder = isUserSpeaking ? "border-blue-500" : "border-green-500";

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Large Speaking Indicator */}
      {isUserSpeaking && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
          <div className="relative">
            <Mic className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div className="absolute -inset-2 border-2 border-blue-500 rounded-full animate-ping opacity-30"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
              You're Speaking
            </span>
            <span className="text-blue-500 dark:text-blue-300 text-sm">
              Keep talking, I'm listening...
            </span>
          </div>
        </div>
      )}

      {/* AI Speaking Indicator */}
      {isAISpeaking && (
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
          <div className="relative">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="absolute -inset-2 border-2 border-green-500 rounded-full animate-ping opacity-30"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-green-600 dark:text-green-400 font-semibold text-lg">
              Emma is Speaking
            </span>
            <span className="text-green-500 dark:text-green-300 text-sm">
              Listen carefully...
            </span>
          </div>
        </div>
      )}

      {/* Voice Activity Bars */}
      <div className="flex items-center justify-center gap-1 h-12">
        {[...Array(7)].map((_, index) => {
          const height = isActive ? Math.random() * 32 + 8 : 4;
          return (
            <div
              key={`${animationKey}-${index}`}
              className={`w-2 rounded-full transition-all duration-300 ${
                isActive ? activeColor : "bg-slate-300 dark:bg-slate-600"
              }`}
              style={{
                height: `${height}px`,
                animationDelay: `${index * 150}ms`,
                animation: isActive
                  ? `waveform 0.8s ease-in-out infinite alternate`
                  : "none",
              }}
            />
          );
        })}
      </div>

      {/* Status Text */}
      {!isActive && (
        <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <MicOff className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-slate-500 dark:text-slate-400 text-sm">
            Ready to speak - Start talking anytime
          </span>
        </div>
      )}

      {/* Inline CSS for animation */}
      <style jsx>{`
        @keyframes waveform {
          0% {
            transform: scaleY(0.3);
            opacity: 0.7;
          }
          100% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
