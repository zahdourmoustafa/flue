"use client";

export function VoiceWaveform() {
  return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className="flex items-end justify-center w-full h-6 space-x-1">
        <div className="w-1 bg-blue-500 rounded-full animate-waveform delay-75"></div>
        <div className="w-1 bg-blue-500 rounded-full animate-waveform"></div>
        <div className="w-1 bg-blue-500 rounded-full animate-waveform delay-300"></div>
        <div className="w-1 bg-blue-500 rounded-full animate-waveform delay-150"></div>
        <div className="w-1 bg-blue-500 rounded-full animate-waveform delay-75"></div>
        <div className="w-1 bg-blue-500 rounded-full animate-waveform delay-200"></div>
        <div className="w-1 bg-blue-500 rounded-full animate-waveform"></div>
      </div>
    </div>
  );
}

// Add keyframes to globals.css for the animation:
/*
@keyframes waveform {
  0%, 100% { height: 0.25rem; }
  50% { height: 1.5rem; }
}
.animate-waveform {
  animation: waveform 1.2s ease-in-out infinite;
}
*/
