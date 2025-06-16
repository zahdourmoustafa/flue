interface TTSOptions {
  text: string;
  language: "english" | "spanish";
}

export class TextToSpeechService {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private currentAudioSource: AudioBufferSourceNode | null = null;

  constructor() {
    // Initialize AudioContext for instant playback
    if (typeof window !== "undefined") {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
  }

  /**
   * Convert text to speech with instant streaming playback
   * @param options - TTS configuration options
   * @returns Promise that resolves when audio starts playing
   */
  async speak(options: TTSOptions): Promise<void> {
    try {
      console.log("🗣️ Speaking:", {
        text: options.text.substring(0, 50) + "...",
        language: options.language,
      });

      if (!this.audioContext) {
        console.error("❌ AudioContext not available");
        return;
      }

      // Ensure AudioContext is running
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      // Stop any currently playing audio
      this.stopCurrentAudio();

      // Call our API endpoint to generate speech
      const audioData = await this.generateSpeech(options);

      // Play the audio immediately
      await this.playAudioData(audioData);
    } catch (error) {
      console.error("❌ TTS Error:", error);
      throw error;
    }
  }

  /**
   * Generate speech by calling our API endpoint
   */
  private async generateSpeech(options: TTSOptions): Promise<ArrayBuffer> {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: options.text,
        language: options.language,
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || "Failed to generate speech");
    }

    return response.arrayBuffer();
  }

  /**
   * Play audio data using Web Audio API for instant playback
   */
  private async playAudioData(audioData: ArrayBuffer): Promise<void> {
    try {
      if (!this.audioContext) return;

      // Decode audio data
      const audioBuffer = await this.audioContext.decodeAudioData(audioData);

      // Create and configure audio source
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      // Store reference to current audio source
      this.currentAudioSource = source;

      // Play audio immediately
      source.start(0);

      console.log("🔊 Audio playing instantly");

      // Clear reference when audio ends
      source.onended = () => {
        this.currentAudioSource = null;
      };
    } catch (error) {
      console.error("❌ Audio playback error:", error);
    }
  }

  /**
   * Stop any currently playing audio
   */
  public stopAudio(): void {
    this.stopCurrentAudio();
  }

  /**
   * Stop the current audio source
   */
  private stopCurrentAudio(): void {
    if (this.currentAudioSource) {
      try {
        this.currentAudioSource.stop();
      } catch (error) {
        // Audio might already be stopped
      }
      this.currentAudioSource = null;
    }
  }

  /**
   * Preload common phrases for even faster response
   */
  async preloadCommonPhrases(): Promise<void> {
    const commonPhrases = [
      {
        text: "Hello! How can I help you today?",
        language: "english" as const,
      },
      {
        text: "¡Hola! ¿Cómo puedo ayudarte hoy?",
        language: "spanish" as const,
      },
      { text: "Great job!", language: "english" as const },
      { text: "¡Excelente trabajo!", language: "spanish" as const },
    ];

    for (const phrase of commonPhrases) {
      try {
        // Pre-generate audio for instant playback later
        const audioData = await this.generateSpeech({
          text: phrase.text,
          language: phrase.language,
        });

        if (this.audioContext) {
          const audioBuffer = await this.audioContext.decodeAudioData(
            audioData
          );
          this.audioBuffers.set(phrase.text, audioBuffer);
        }
      } catch (error) {
        console.warn(`Failed to preload phrase: ${phrase.text}`, error);
      }
    }

    console.log("✅ Common phrases preloaded for instant playback");
  }

  /**
   * Play preloaded audio if available, otherwise generate new audio
   */
  async speakFast(options: TTSOptions): Promise<void> {
    // Check if we have preloaded audio
    const preloadedAudio = this.audioBuffers.get(options.text);

    if (preloadedAudio && this.audioContext) {
      // Stop any currently playing audio
      this.stopCurrentAudio();

      // Play preloaded audio instantly
      const source = this.audioContext.createBufferSource();
      source.buffer = preloadedAudio;
      source.connect(this.audioContext.destination);

      // Store reference to current audio source
      this.currentAudioSource = source;

      source.start(0);
      console.log("🚀 Playing preloaded audio instantly");

      // Clear reference when audio ends
      source.onended = () => {
        this.currentAudioSource = null;
      };

      return;
    }

    // Fall back to regular TTS
    return this.speak(options);
  }
}

// Export singleton instance
export const ttsService = new TextToSpeechService();
