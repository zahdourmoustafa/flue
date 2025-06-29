"use client";

import { useEffect, useRef } from "react";
import { useTalkingAvatar } from "@/hooks/useTalkingAvatar";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TalkingAvatarProps {
  text: string;
  language: "english" | "spanish";
  presenterId?: string;
  autoPlay?: boolean;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  className?: string;
}

export function TalkingAvatar({
  text,
  language,
  presenterId = "v2_public_amber@Y5K02DLS4m",
  autoPlay = true,
  onSpeechStart,
  onSpeechEnd,
  className,
}: TalkingAvatarProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    isGenerating,
    isAudioPlaying,
    isVideoReady,
    videoUrl,
    error,
    speakWithAvatar,
    stopAvatar,
    clearError,
    resetAvatar,
    onAudioEnd,
    isPlaying,
    showVideo,
    showLoadingVideo,
  } = useTalkingAvatar();

  // Auto-play when text changes
  useEffect(() => {
    if (text && autoPlay && !isGenerating && !isAudioPlaying) {
      handleSpeak();
    }
  }, [text, autoPlay, isGenerating, isAudioPlaying]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      console.log("🎬 Avatar video started playing");
      onSpeechStart?.();
    };

    const handleEnded = () => {
      console.log("🎬 Avatar video ended");
      onSpeechEnd?.();
      onAudioEnd();
    };

    const handleError = () => {
      console.error("❌ Video playback error");
      onSpeechEnd?.();
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
    };
  }, [onSpeechStart, onSpeechEnd, resetAvatar]);

  // Auto-play video when URL is ready
  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [showVideo]);

  const handleSpeak = async () => {
    if (!text.trim()) return;

    try {
      clearError();
      await speakWithAvatar({
        text,
        language,
        presenterId,
      });
    } catch (error) {
      console.error("❌ Failed to create talking avatar:", error);
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    stopAvatar();
    onSpeechEnd?.();
  };

  const handleRetry = () => {
    clearError();
    handleSpeak();
  };

  // Don't render if no text
  if (!text.trim()) return null;

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      {/* Avatar Video Container */}
      <div className="relative w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full overflow-hidden shadow-lg border-4 border-white">
        {showLoadingVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-800 font-medium">
                Preparing Avatar...
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Audio playing while avatar loads
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <div className="text-center p-4">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-800 font-medium mb-2">
                Avatar Error
              </p>
              <p className="text-xs text-red-600 mb-3">{error}</p>
              <Button
                size="sm"
                onClick={handleRetry}
                className="bg-red-500 hover:bg-red-600"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {showVideo && (
          <video
            ref={videoRef}
            src={videoUrl ?? undefined}
            className="w-full h-full object-cover"
            autoPlay
            muted={false}
            playsInline
            controls={false}
          />
        )}

        {!showLoadingVideo && !showVideo && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg font-bold">A</span>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {isAudioPlaying ? "Amber is speaking" : "Amber is ready"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {!isPlaying && (
          <Button
            onClick={handleSpeak}
            disabled={!text.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Speak
          </Button>
        )}

        {isPlaying && (
          <Button
            onClick={handleStop}
            variant="outline"
            size="sm"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <VolumeX className="h-4 w-4 mr-2" />
            Stop
          </Button>
        )}

        {showVideo && (
          <Button
            onClick={() => videoRef.current?.play()}
            variant="outline"
            size="sm"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Replay Video
          </Button>
        )}
      </div>

      {/* Status Text */}
      {isAudioPlaying && !showVideo && (
        <p className="text-xs text-blue-600 text-center">
          🔊 Audio playing • 🎬 Avatar preparing...
        </p>
      )}

      {showVideo && (
        <p className="text-xs text-green-600 text-center">
          🎭 Amber avatar ready!
        </p>
      )}

      {showLoadingVideo && (
        <p className="text-xs text-orange-600 text-center">
          🎬 Avatar generating... (may take 30-60 seconds)
        </p>
      )}
    </div>
  );
}