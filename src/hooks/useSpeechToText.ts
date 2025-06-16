"use client";

import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

export function useSpeechToText(
  onTranscriptionComplete: (text: string, audioUrl: string) => void
) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsTranscribing(true);
        toast.info("Processing your voice message...");
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        const formData = new FormData();
        formData.append("audio", audioBlob);

        try {
          const response = await fetch("/api/speech-to-text", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to transcribe audio.");
          }

          const data = await response.json();
          onTranscriptionComplete(data.transcription, audioUrl);
          toast.success("Voice message sent!");
        } catch (error) {
          console.error("Transcription error:", error);
          toast.error(
            error instanceof Error
              ? error.message
              : "An unknown error occurred."
          );
        } finally {
          setIsTranscribing(false);
          // Clean up the stream
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started... Click the button again to stop.");
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error(
        "Could not start recording. Please ensure microphone access is allowed."
      );
    }
  }, [isRecording, onTranscriptionComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      mediaRecorderRef.current.onstop = null; // Prevent onstop from firing
      setIsRecording(false);
      toast.info("Recording canceled.");
    }
  }, [isRecording]);

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
