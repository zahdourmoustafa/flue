interface DIDTalkRequest {
  source_url: string; // D-ID presenter ID
  script: {
    type: "audio";
    audio_url: string; // ElevenLabs audio URL
  };
  config?: {
    fluent?: boolean;
    pad_audio?: number;
    stitch?: boolean;
  };
}

interface DIDTalkResponse {
  id: string;
  object: "talk";
  created_at: string;
  status: "created" | "started" | "done" | "error";
  result_url?: string;
  error?: {
    kind: string;
    description: string;
  };
}

export class DIDavatarService {
  private baseUrl = "https://api.d-id.com";

  /**
   * Create a talking avatar video using D-ID presenter and text input
   */
  async createTalkingVideoWithText(
    text: string,
    language: "english" | "spanish",
    presenterId: string = "v2_public_amber@Y5K02DLS4m"
  ): Promise<string> {
    try {
      console.log("🎬 Creating D-ID talking video with text:", {
        presenterId,
        text: text.substring(0, 50) + "...",
      });

      const response = await fetch("/api/did-avatar/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          presenterId,
          text,
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to create talking video");
      }

      const data = await response.json();
      return data.talkId;
    } catch (error) {
      console.error("❌ D-ID video creation error:", error);
      throw error;
    }
  }

  /**
   * Create a talking avatar video using D-ID presenter and ElevenLabs audio
   */
  async createTalkingVideo(
    audioUrl: string,
    presenterId: string = "v2_public_amber@Y5K02DLS4m"
  ): Promise<string> {
    try {
      console.log("🎬 Creating D-ID talking video:", { presenterId, audioUrl });

      const response = await fetch("/api/did-avatar/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          presenterId,
          audioUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to create talking video");
      }

      const data = await response.json();
      return data.talkId;
    } catch (error) {
      console.error("❌ D-ID video creation error:", error);
      throw error;
    }
  }

  /**
   * Get the status and result of a talking video
   */
  async getTalkingVideo(talkId: string): Promise<DIDTalkResponse> {
    try {
      const response = await fetch(`/api/did-avatar/status/${talkId}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to get video status");
      }

      return response.json();
    } catch (error) {
      console.error("❌ D-ID status check error:", error);
      throw error;
    }
  }

  /**
   * Poll for video completion with exponential backoff
   */
  async waitForVideoCompletion(
    talkId: string,
    maxAttempts: number = 30
  ): Promise<string> {
    let attempts = 0;
    let delay = 1000; // Start with 1 second

    while (attempts < maxAttempts) {
      try {
        const status = await this.getTalkingVideo(talkId);

        if (status.status === "done" && status.result_url) {
          console.log("✅ D-ID video completed:", status.result_url);
          return status.result_url;
        }

        if (status.status === "error") {
          throw new Error(
            status.error?.description || "Video generation failed"
          );
        }

        // Video still processing, wait and retry
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Exponential backoff up to 5 seconds
        delay = Math.min(delay * 1.2, 5000);
        attempts++;

        console.log(`⏳ D-ID video processing... (${attempts}/${maxAttempts})`);
      } catch (error) {
        console.error("❌ Error polling video status:", error);
        throw error;
      }
    }

    throw new Error("Video generation timed out");
  }

  /**
   * Delete a talking video
   */
  async deleteTalkingVideo(talkId: string): Promise<void> {
    try {
      await fetch(`/api/did-avatar/delete/${talkId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.warn("⚠️ Failed to delete D-ID video:", error);
    }
  }
}

export const didAvatarService = new DIDavatarService();
