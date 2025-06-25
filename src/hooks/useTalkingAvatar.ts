import { useState, useCallback, useRef } from "react";
import { didAvatarService } from "@/services/didAvatarService";
import { useTextToSpeech } from "./useTextToSpeech";

interface TalkingAvatarOptions {
  text: string;
  language: "english" | "spanish";
  presenterId?: string;
}

interface TalkingAvatarState {
  isGenerating: boolean;
  isAudioPlaying: boolean;
  isVideoReady: boolean;
  videoUrl: string | null;
  error: string | null;
}

export const useTalkingAvatar = () => {
  const [state, setState] = useState<TalkingAvatarState>({
    isGenerating: false,
    isAudioPlaying: false,
    isVideoReady: false,
    videoUrl: null,
    error: null,
  });

  const { speakMessage } = useTextToSpeech();
  const currentGenerationRef = useRef<string | null>(null);

  /**
   * Dual approach: Instant ElevenLabs audio + Parallel D-ID avatar generation
   */
  const speakWithAvatar = useCallback(
    async (options: TalkingAvatarOptions) => {
      try {
        const generationId = Date.now().toString();
        currentGenerationRef.current = generationId;

        setState((prev) => ({
          ...prev,
          isGenerating: true,
          isAudioPlaying: true,
          isVideoReady: false,
          error: null,
          videoUrl: null,
        }));

        console.log("🎭 Starting dual audio+avatar generation:", options);

        // 1. IMMEDIATE: Play ElevenLabs audio for instant feedback
        console.log("🔊 Playing immediate ElevenLabs audio...");
        speakMessage(
          options.text,
          options.language === "spanish" ? "es" : "en"
        );

        // 2. PARALLEL: Start D-ID avatar generation (don't await)
        console.log("🎬 Starting D-ID video generation in parallel...");
        didAvatarService
          .createTalkingVideoWithText(
            options.text,
            options.language,
            options.presenterId || "v2_public_amber@Y5K02DLS4m"
          )
          .then((talkId) => {
            console.log(
              "⏳ D-ID video generation started, waiting for completion..."
            );
            return didAvatarService.waitForVideoCompletion(talkId);
          })
          .then((videoUrl) => {
            // Only update if this is still the current generation
            if (currentGenerationRef.current === generationId) {
              console.log("✅ D-ID avatar ready:", videoUrl);
              setState((prev) => ({
                ...prev,
                isGenerating: false,
                isVideoReady: true,
                videoUrl,
              }));
            }
          })
          .catch((error) => {
            if (currentGenerationRef.current === generationId) {
              console.error("❌ D-ID avatar generation failed:", error);
              setState((prev) => ({
                ...prev,
                isGenerating: false,
                error:
                  error instanceof Error
                    ? error.message
                    : "Avatar generation failed",
              }));
            }
          });

        // Return immediately - don't wait for video
        return "audio_playing";
      } catch (error) {
        console.error("❌ Talking avatar error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create talking avatar";

        setState((prev) => ({
          ...prev,
          isGenerating: false,
          isAudioPlaying: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    [speakMessage]
  );

  /**
   * Stop the current avatar video and audio
   */
  const stopAvatar = useCallback(() => {
    currentGenerationRef.current = null;
    setState((prev) => ({
      ...prev,
      isAudioPlaying: false,
      isVideoReady: false,
    }));
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  /**
   * Reset avatar state
   */
  const resetAvatar = useCallback(() => {
    currentGenerationRef.current = null;
    setState({
      isGenerating: false,
      isAudioPlaying: false,
      isVideoReady: false,
      videoUrl: null,
      error: null,
    });
  }, []);

  /**
   * Mark audio as finished playing
   */
  const onAudioEnd = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isAudioPlaying: false,
    }));
  }, []);

  return {
    ...state,
    speakWithAvatar,
    stopAvatar,
    clearError,
    resetAvatar,
    onAudioEnd,
    // Computed states for easier usage
    isPlaying: state.isAudioPlaying || state.isVideoReady,
    showVideo: state.isVideoReady && state.videoUrl,
    showLoadingVideo: state.isGenerating && !state.isVideoReady,
  };
};
