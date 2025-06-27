"use client";

import { useState, useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { TopicSuggestions } from "./TopicSuggestions";
import { ErrorFeedbackPanel } from "./ErrorFeedbackPanel";
import { TranslationPanel } from "./TranslationPanel";
import { TTSControl } from "./TTSControl";
import { type Message, type ChatSession } from "@/types/chat";
import {
  useChatStart,
  useChatMessage,
  useSuggestAnswer,
} from "@/hooks/useChat";
import { useTranslation } from "@/hooks/useTranslation";
import { useAnotherQuestion } from "@/hooks/useAnotherQuestion";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [feedbackPanelOpen, setFeedbackPanelOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [translationPanelOpen, setTranslationPanelOpen] = useState(false);
  const [selectedTranslationMessage, setSelectedTranslationMessage] =
    useState<Message | null>(null);
  const [currentTranslation, setCurrentTranslation] = useState<string | null>(
    null
  );
  const [conversationHistory, setConversationHistory] = useState<
    ConversationMessage[]
  >([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [prefilledText, setPrefilledText] = useState<string>("");

  // Use React Query for chat initialization
  const {
    data: chatData,
    isLoading: isInitializing,
    error: initError,
    refetch: retryInit,
  } = useChatStart();

  // Use React Query for sending messages
  const {
    mutate: sendMessage,
    isLoading: isSending,
    error: sendError,
  } = useChatMessage();

  // Use React Query for suggesting answers
  const { mutate: suggestAnswer, isLoading: isGeneratingSuggestion } =
    useSuggestAnswer();

  // Use React Query for translation
  const {
    mutate: translateMessage,
    isLoading: isTranslating,
    data: translationData,
    reset: resetTranslation,
    isError: isTranslationError,
  } = useTranslation();

  // Use React Query for another question
  const { mutate: generateAnotherQuestion, isLoading: isGeneratingQuestion } =
    useAnotherQuestion();

  // Use Text-to-Speech hook
  const {
    speakMessage,
    isPlaying: isSpeaking,
    stop: stopSpeaking,
  } = useTextToSpeech();

  const { user } = useAuth();
  const learningLanguage = user?.learningLanguage ?? session?.language ?? "en";

  // Initialize chat when data is received
  useEffect(() => {
    if (chatData) {
      console.log("💫 Initializing chat with data:", chatData);

      const initialAIMessage: Message = {
        id: "1",
        sessionId: chatData.sessionId,
        senderType: "ai",
        originalMessage: chatData.initialMessage,
        correctedMessage: null,
        correctionExplanation: null,
        audioUrl: null,
        hasErrors: false,
        createdAt: new Date(),
      };

      setMessages([initialAIMessage]);
      setSession({
        id: chatData.sessionId,
        userId: chatData.userId,
        language: chatData.learningLanguage,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setConversationHistory([
        { role: "assistant", content: chatData.initialMessage },
      ]);

      const languageName =
        chatData.learningLanguage === "es"
          ? "Spanish"
          : chatData.learningLanguage === "en"
          ? "English"
          : chatData.learningLanguage;

      toast.success(`Welcome! Let's practice ${languageName} together!`);

      // Speak the initial AI message
      speakMessage(chatData.initialMessage, chatData.learningLanguage);
    }
  }, [chatData, speakMessage]);

  const handleSendMessage = async (messageText: string, audioUrl?: string) => {
    if (!messageText.trim() || !session || isSending) return;

    console.log("📤 Handling send message:", messageText);

    // Add user message immediately for better UX
    const userMessage: Message = {
      id: Date.now().toString(),
      sessionId: session.id,
      senderType: "user",
      originalMessage: messageText,
      correctedMessage: null,
      correctionExplanation: null,
      audioUrl: audioUrl || null,
      hasErrors: false,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Update conversation history
    const newConversationHistory = [
      ...conversationHistory,
      { role: "user" as const, content: messageText },
    ];

    // Show typing indicator
    setIsAiTyping(true);

    // Send message using React Query mutation
    sendMessage(
      {
        message: messageText,
        sessionId: session.id,
        conversationHistory: newConversationHistory.slice(-10), // Keep last 10 messages for context
      },
      {
        onSuccess: (response) => {
          console.log("✅ Message sent successfully:", response);

          // Hide typing indicator
          setIsAiTyping(false);

          // Create AI response message
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            sessionId: session.id,
            senderType: "ai",
            originalMessage: response.aiResponse,
            correctedMessage: null,
            correctionExplanation: null,
            audioUrl: null,
            hasErrors: false,
            createdAt: new Date(),
          };

          // Update user message with error information if needed
          const updatedUserMessage = {
            ...userMessage,
            hasErrors: response.hasErrors,
            correctedMessage: response.correctedMessage,
            correctionExplanation: response.explanation,
          };

          // Update messages
          setMessages((prev) =>
            prev
              .map((msg) =>
                msg.id === userMessage.id ? updatedUserMessage : msg
              )
              .concat(aiMessage)
          );

          // Update conversation history
          setConversationHistory([
            ...newConversationHistory,
            { role: "assistant", content: response.aiResponse },
          ]);

          // Speak the AI response instantly
          speakMessage(response.aiResponse, session.language);
        },
        onError: (error) => {
          console.error("❌ Failed to send message:", error);

          // Hide typing indicator
          setIsAiTyping(false);

          // Remove the user message if sending failed
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== userMessage.id)
          );
          toast.error("Failed to send message. Please try again.");
        },
      }
    );
  };

  const handlePlayPronunciation = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch((e) => console.error("Failed to play audio:", e));
  };

  const handleTopicSelect = (topic: string) => {
    if (topic === "Another question") {
      handleAnotherQuestion();
    } else {
      handleSendMessage(topic);
    }
  };

  const handleAnotherQuestion = () => {
    console.log("🔄 Generating another question...");

    if (!session) {
      toast.error("Session not found");
      return;
    }

    setIsAiTyping(true);

    generateAnotherQuestion(
      {
        conversationHistory: conversationHistory.slice(-6), // Last 6 messages for context
      },
      {
        onSuccess: (response) => {
          console.log(
            "✅ Another question generated:",
            response.data.newQuestion
          );

          // Create new AI message
          const aiMessage: Message = {
            id: Date.now().toString(),
            sessionId: session.id,
            senderType: "ai",
            originalMessage: response.data.newQuestion,
            correctedMessage: null,
            correctionExplanation: null,
            audioUrl: null,
            hasErrors: false,
            createdAt: new Date(),
          };

          // Add the new AI message
          setMessages((prev) => [...prev, aiMessage]);

          // Update conversation history
          setConversationHistory((prev) => [
            ...prev,
            { role: "assistant", content: response.data.newQuestion },
          ]);

          setIsAiTyping(false);
          toast.success("Emma has a new question for you!");

          // Speak the new question instantly
          speakMessage(response.data.newQuestion, session.language);
        },
        onError: (error) => {
          console.error("❌ Failed to generate another question:", error);
          setIsAiTyping(false);
          toast.error("Failed to generate a new question. Please try again.");
        },
      }
    );
  };

  const handleTextSuggest = (text: string) => {
    setPrefilledText(text);
  };

  const handleSuggestAnswer = () => {
    // Get the last AI message to suggest an answer for
    const lastAiMessage = messages
      .filter((msg) => msg.senderType === "ai")
      .pop()?.originalMessage;

    if (!lastAiMessage) {
      toast.error("No question to suggest an answer for");
      return;
    }

    console.log("💡 Requesting suggestion for:", lastAiMessage);
    console.log(
      "🔄 isGeneratingSuggestion before call:",
      isGeneratingSuggestion
    );

    suggestAnswer(
      {
        lastAiMessage,
        conversationHistory: conversationHistory.slice(-6), // Last 6 messages for context
      },
      {
        onSuccess: (response) => {
          console.log("✅ Suggestion generated:", response.suggestedAnswer);
          console.log(
            "🔄 isGeneratingSuggestion on success:",
            isGeneratingSuggestion
          );
          setPrefilledText(response.suggestedAnswer);
          toast.success(
            "Suggestion generated! You can edit it before sending."
          );
        },
        onError: (error) => {
          console.log(
            "🔄 isGeneratingSuggestion on error:",
            isGeneratingSuggestion
          );
        },
      }
    );
  };

  const handleErrorIconClick = (message: Message) => {
    setSelectedMessage(message);
    setFeedbackPanelOpen(true);
  };

  const handleRepeatAudio = (messageId: string) => {
    console.log("🔊 Repeating audio for message:", messageId);

    const message = messages.find((msg) => msg.id === messageId);
    if (!message) {
      toast.error("Message not found");
      return;
    }

    if (!session) {
      toast.error("Session not found");
      return;
    }

    // Speak the message using TTS
    speakMessage(message.originalMessage, session.language);
    toast.success("Playing audio...");
  };

  const handleTranslate = (message: Message) => {
    if (!user?.translationLanguage) {
      toast.error("Please set your native language in settings.");
      return;
    }

    resetTranslation();
    setSelectedTranslationMessage(message);
    setTranslationPanelOpen(true);

    translateMessage({
      text: message.originalMessage,
      from:
        message.senderType === "user"
          ? user.learningLanguage ?? "en"
          : session?.language ?? "en",
      to: user.translationLanguage,
    });
  };

  // Loading state
  if (isInitializing) {
    return (
      <div className="flex h-full bg-white relative items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">
            Starting your conversation with Emma...
          </p>
          <p className="text-sm text-gray-500">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // Error state
  if (initError) {
    console.error("🔥 Chat initialization error:", initError);

    return (
      <div className="flex h-full bg-white relative items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to start chat
          </h2>
          <p className="text-gray-600 mb-6">
            {initError.message.includes("Authentication")
              ? "Please make sure you are logged in and try again."
              : initError.message.includes("learning language")
              ? "Please set your learning language in your profile first."
              : "We encountered an issue starting your chat session. This might be due to a network problem or server issue."}
          </p>
          <div className="space-y-3">
            <Button onClick={() => retryInit()} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
          {process.env.NODE_ENV === "development" && (
            <details className="mt-6 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer">
                Error Details (Development Mode)
              </summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
                {initError.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  // Chat interface
  return (
    <div className="flex h-full bg-white relative">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* TTS Control - shows when Emma is speaking */}
          <TTSControl className="mx-4 mt-2" />

          <MessageList
            messages={messages}
            isLoading={isSending}
            isAiTyping={isAiTyping}
            onRetry={handleSendMessage}
            onErrorIconClick={handleErrorIconClick}
            onRepeatAudio={handleRepeatAudio}
            onTranslate={handleTranslate}
            onPlayPronunciation={handlePlayPronunciation}
            isSpeaking={isSpeaking}
            stopSpeaking={stopSpeaking}
          />

          {messages.length === 1 && (
            <TopicSuggestions
              onTopicSelect={handleTopicSelect}
              learningLanguage={learningLanguage}
            />
          )}

          <div className="px-4 pb-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isSending}
              prefilledText={prefilledText}
              onPrefilledTextUsed={() => setPrefilledText("")}
              onSuggestAnswer={handleSuggestAnswer}
              onAnotherQuestion={handleAnotherQuestion}
              isGeneratingSuggestion={isGeneratingSuggestion}
              isGeneratingQuestion={isGeneratingQuestion}
            />
          </div>
        </div>
      </div>

      {/* Error Feedback Panel */}
      <ErrorFeedbackPanel
        isOpen={feedbackPanelOpen}
        message={selectedMessage}
        onClose={() => setFeedbackPanelOpen(false)}
      />

      <TranslationPanel
        isOpen={translationPanelOpen}
        onClose={() => {
          setTranslationPanelOpen(false);
          resetTranslation();
        }}
        message={selectedTranslationMessage}
        translation={translationData?.translatedText ?? null}
        isLoading={isTranslating}
        isError={isTranslationError}
        learningLanguage={learningLanguage}
      />
    </div>
  );
}
