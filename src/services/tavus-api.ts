import {
  CreateConversationRequest,
  TavusConversation,
} from "@/types/video-call";

const TAVUS_API_BASE_URL = "https://tavusapi.com/v2";

class TavusAPIService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.TAVUS_API_KEY || "";
    if (!this.apiKey) {
      throw new Error("TAVUS_API_KEY environment variable is required");
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${TAVUS_API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new Error(
        `Tavus API Error: ${response.status} - ${
          errorData.message || response.statusText
        }`
      );
    }

    // Handle empty responses or non-JSON responses
    const contentType = response.headers.get("content-type");
    const responseText = await response.text();

    if (!responseText.trim()) {
      // Return a default success response for empty responses
      return { success: true } as T;
    }

    if (contentType && contentType.includes("application/json")) {
      try {
        return JSON.parse(responseText);
      } catch (error) {
        console.error("Failed to parse JSON response:", responseText);
        return { success: true } as T;
      }
    }

    // For non-JSON responses, return success if status is ok
    return { success: true } as T;
  }

  async createConversation(
    request: CreateConversationRequest
  ): Promise<TavusConversation> {
    return this.makeRequest<TavusConversation>("/conversations", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getConversation(conversationId: string): Promise<TavusConversation> {
    return this.makeRequest<TavusConversation>(
      `/conversations/${conversationId}`
    );
  }

  async endConversation(conversationId: string): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>(
      `/conversations/${conversationId}/end`,
      {
        method: "POST",
      }
    );
  }

  async deleteConversation(
    conversationId: string
  ): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>(
      `/conversations/${conversationId}`,
      {
        method: "DELETE",
      }
    );
  }

  /**
   * Fetches conversations. Optionally filter by status (e.g. "active", "ended").
   * The Tavus API returns the array under a `data` key.
   */
  async listConversations(
    status?: "active" | "ended"
  ): Promise<TavusConversation[]> {
    const endpoint = status
      ? `/conversations?status=${status}`
      : "/conversations";
    const response = await this.makeRequest<{ data: TavusConversation[] }>(
      endpoint
    );
    return response.data ?? [];
  }
}

// Singleton instance
export const tavusAPI = new TavusAPIService();
