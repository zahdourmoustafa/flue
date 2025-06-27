"use client";

import { CheckCircle, AlertCircle, Clock, Wifi } from "lucide-react";

interface CallStatusProps {
  state: "ringing" | "connecting" | "connected" | "ended";
  duration: number;
  isConnected: boolean;
  error?: string;
}

export const CallStatus = ({
  state,
  duration,
  isConnected,
  error,
}: CallStatusProps) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getStatusIcon = () => {
    switch (state) {
      case "ringing":
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
      case "connecting":
        return <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "ended":
        return <AlertCircle className="w-4 h-4 text-slate-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (state) {
      case "ringing":
        return "Calling Emma...";
      case "connecting":
        return "Establishing connection...";
      case "connected":
        return `Connected - ${formatDuration(duration)}`;
      case "ended":
        return "Call completed";
      default:
        return "";
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 text-red-500">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">Connection error</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
      {getStatusIcon()}
      <span className="text-sm font-medium">{getStatusText()}</span>
    </div>
  );
};
