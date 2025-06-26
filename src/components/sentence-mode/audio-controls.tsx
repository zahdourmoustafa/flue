"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AudioRecordingState } from "@/types/sentence-mode";
import { Mic, Square, Play, RotateCcw, Loader2 } from "lucide-react";

interface AudioControlsProps {
  onRecordingComplete: (transcript: string) => void;
  onListen: () => void;
  isRecording: boolean;
  isPlaying: boolean;
}

export const AudioControls = ({
  onRecordingComplete,
  onListen,
  isPlaying,
}: AudioControlsProps) => {
  const [recordingState, setRecordingState] = useState<AudioRecordingState>({
    isRecording: false,
    audioBlob: null,
    duration: 0,
    error: null,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const processRecording = async (audioBlob: Blob) => {
    console.log("🎤 Processing recording...");

    // Step 1: Speech-to-text using Eleven Labs
    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      const sttResponse = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });

      if (!sttResponse.ok) {
        throw new Error("Speech-to-text failed");
      }

      const { transcription } = await sttResponse.json();
      console.log("📝 Transcription:", transcription);

      // Pass the transcription to the parent component
      onRecordingComplete(transcription);
    } catch (error) {
      console.error("Error in processRecording:", error);
      setRecordingState((prev) => ({
        ...prev,
        error: "Failed to process audio. Please try again.",
      }));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        setRecordingState((prev) => ({
          ...prev,
          audioBlob,
          isRecording: false,
        }));

        // Process the recording with real speech-to-text and pronunciation analysis
        setIsProcessing(true);
        try {
          await processRecording(audioBlob);
        } catch (error) {
          console.error("Failed to process recording:", error);
          setRecordingState((prev) => ({
            ...prev,
            error: "Failed to process your recording. Please try again.",
          }));
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setRecordingState((prev) => ({
        ...prev,
        isRecording: true,
        duration: 0,
        error: null,
      }));

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingState((prev) => ({
          ...prev,
          duration: prev.duration + 1,
        }));
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setRecordingState((prev) => ({
        ...prev,
        error: "Failed to access microphone. Please check permissions.",
      }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const resetRecording = () => {
    setRecordingState({
      isRecording: false,
      audioBlob: null,
      duration: 0,
      error: null,
    });
  };

  const playRecording = () => {
    if (recordingState.audioBlob) {
      const audio = new Audio(URL.createObjectURL(recordingState.audioBlob));
      audio.play();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      {recordingState.error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400">
            {recordingState.error}
          </p>
        </div>
      )}

      <div className="flex items-center justify-center">
        {!recordingState.isRecording && !recordingState.audioBlob ? (
          <div className="flex items-center gap-4">
            <Button
              onClick={onListen}
              disabled={isPlaying}
              size="lg"
              variant="outline"
            >
              <Mic className="h-5 w-5 mr-2" />
              Listen
            </Button>
            <Button
              onClick={startRecording}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Mic className="h-5 w-5 mr-2" />
              Record
            </Button>
          </div>
        ) : recordingState.isRecording ? (
          <Button
            onClick={stopRecording}
            size="lg"
            variant="destructive"
            className="w-32 h-32 rounded-full"
          >
            <div className="flex flex-col items-center gap-2">
              <Square className="h-8 w-8" />
              <span className="text-sm font-medium">Stop</span>
            </div>
          </Button>
        ) : (
          <div className="flex items-center gap-4">
            <Button onClick={playRecording} variant="outline" size="lg">
              <Play className="h-5 w-5 mr-2" />
              Play Recording
            </Button>
            <Button onClick={resetRecording} variant="outline" size="lg">
              <RotateCcw className="h-5 w-5 mr-2" />
              Record Again
            </Button>
          </div>
        )}
      </div>

      {recordingState.isRecording && (
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-red-600 dark:text-red-400">
            {formatDuration(recordingState.duration)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Recording... Speak clearly into your microphone
          </p>
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="text-center">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            🎯 Analyzing your pronunciation...
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Converting speech to text and checking accuracy
          </p>
        </div>
      )}

      {recordingState.audioBlob &&
        !recordingState.isRecording &&
        !isProcessing && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Recording completed ({formatDuration(recordingState.duration)})
            </p>
          </div>
        )}
    </div>
  );
};
