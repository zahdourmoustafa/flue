import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export const useStreamChat = (
  userId: string,
  userName: string,
  userImage?: string
) => {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !userName) return;

    const initChat = async () => {
      try {
        // Fetch token from API
        const response = await fetch("/api/stream-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, userName, userImage }),
        });

        if (!response.ok) {
          throw new Error("Failed to get chat token");
        }

        const { token, user } = await response.json();

        const chatClient = StreamChat.getInstance(API_KEY);

        await chatClient.connectUser(user, token);

        setClient(chatClient);
        setIsReady(true);
        setError(null);
      } catch (err) {
        console.error("Failed to connect user:", err);
        setError(
          err instanceof Error ? err.message : "Failed to connect to chat"
        );
        setIsReady(false);
      }
    };

    initChat();

    return () => {
      if (client) {
        client.disconnectUser();
        setClient(null);
        setIsReady(false);
      }
    };
  }, [userId, userName, userImage]);

  return { client, isReady, error };
};
