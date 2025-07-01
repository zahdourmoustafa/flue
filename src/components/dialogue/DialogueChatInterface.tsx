"use client";

import { useState, useEffect, SetStateAction } from "react";
import { ChatHeader } from "../chat/ChatHeader";
import { MessageList } from "../chat/MessageList";
import { ErrorFeedbackPanel } from "../chat/ErrorFeedbackPanel";
import { TranslationPanel } from "../chat/TranslationPanel";
import { SpeechPracticeInterface } from "./SpeechPracticeInterface";
import { type Message, type ChatSession } from "@/types/chat";
import { type ChatStartResponse } from "@/types/api";
import { type DialogueScenario } from "@/types/dialogue";
import {
  useDialogueChatStart,
  useDialogueChatMessage,
  useDialogueSuggestAnswer,
} from "@/hooks/useDialogueChat";
import { useTranslation } from "@/hooks/useTranslation";
import { useAnotherQuestion } from "@/hooks/useAnotherQuestion";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, ArrowLeft, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface DialogueChatInterfaceProps {
  scenarioConfig: DialogueScenario;
}

export function DialogueChatInterface({
  scenarioConfig,
}: DialogueChatInterfaceProps) {
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
  const [translationError, setTranslationError] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState<
    ConversationMessage[]
  >([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<string>("");
  const [lastAiMessage, setLastAiMessage] = useState<string>("");
  const [shouldAutoPlaySuggestion, setShouldAutoPlaySuggestion] =
    useState(false);

  // Use React Query for dialogue initialization
  const {
    data: chatData,
    isPending: isInitializing,
    error: initError,
    refetch: retryInit,
  } = useDialogueChatStart(scenarioConfig.id);

  // Use React Query for sending messages
  const {
    mutate: sendMessage,
    isPending: isSending,
    error: sendError,
  } = useDialogueChatMessage();

  // Use React Query for suggesting answers
  const { mutate: suggestAnswer, isPending: isGeneratingSuggestion } =
    useDialogueSuggestAnswer();

  // Use React Query for translation
  const { mutate: translateMessage, isPending: isTranslating } =
    useTranslation();

  // Use React Query for another question
  const { mutate: generateAnotherQuestion, isPending: isGeneratingQuestion } =
    useAnotherQuestion();

  // Use Text-to-Speech hook
  const {
    speakMessage,
    isPlaying: isSpeaking,
    stop: stopSpeaking,
  } = useTextToSpeech();

  const { user } = useAuth();
  const learningLanguage = user?.learningLanguage ?? session?.language ?? "en";

  // Initialize dialogue when data is received
  useEffect(() => {
    if (chatData) {
      console.log("💫 Initializing dialogue with data:", chatData);

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

      const initialHistory: ConversationMessage[] = [
        { role: "assistant", content: chatData.initialMessage },
      ];
      setConversationHistory(initialHistory);
      setLastAiMessage(chatData.initialMessage);

      const languageName =
        chatData.learningLanguage === "es"
          ? "Spanish"
          : chatData.learningLanguage === "en"
          ? "English"
          : chatData.learningLanguage;

      toast.success(
        `Welcome to ${scenarioConfig.title}! Let's practice ${languageName} together!`
      );

      // Auto-generate suggestion for the first response immediately after session is set
      generateSuggestionWithHistory(
        chatData.initialMessage,
        initialHistory as ConversationMessage[]
      );

      // Speak the initial AI message and then set flag to auto-play suggestion
      speakMessage(
        chatData.initialMessage,
        chatData.learningLanguage as "en" | "es",
        () => {
          // Set flag to auto-play suggestion when it becomes available
          setShouldAutoPlaySuggestion(true);
        }
      );
    }
  }, [chatData, speakMessage, scenarioConfig.title]);

  // Auto-play suggestion when it becomes available and flag is set
  useEffect(() => {
    if (shouldAutoPlaySuggestion && currentSuggestion) {
      setTimeout(() => {
        speakMessage(currentSuggestion, learningLanguage as "en" | "es");
        setShouldAutoPlaySuggestion(false);
      }, 200);
    }
  }, [
    currentSuggestion,
    shouldAutoPlaySuggestion,
    speakMessage,
    learningLanguage,
  ]);

  const handleSendMessage = async (messageText: string, audioUrl?: string) => {
    if (!messageText.trim() || !session || isSending) return;

    console.log("📤 Handling send dialogue message:", messageText);

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
        scenarioId: scenarioConfig.id,
        conversationHistory: newConversationHistory.slice(-10), // Keep last 10 messages for context
      },
      {
        onSuccess: (response) => {
          console.log("✅ Dialogue message sent successfully:", response);

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
            explanation: response.explanation,
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
          const updatedHistory = [
            ...newConversationHistory,
            { role: "assistant" as const, content: response.aiResponse },
          ];
          setConversationHistory(updatedHistory);

          // Set the new AI message for suggestion generation
          setLastAiMessage(response.aiResponse);

          // Speak AI response and then auto-play suggestion
          speakMessage(
            response.aiResponse,
            learningLanguage as "en" | "es",
            () => {
              // Set flag to auto-play suggestion when it becomes available
              setShouldAutoPlaySuggestion(true);
            }
          );

          // Auto-generate suggestion for the response
          setTimeout(() => {
            generateSuggestionForLastMessage(response.aiResponse);
          }, 1000);
        },
        onError: (error) => {
          console.error("❌ Failed to send dialogue message:", error);
          // Hide typing indicator
          setIsAiTyping(false);

          // Remove the user message that failed to send
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== userMessage.id)
          );

          toast.error("Failed to send message. Please try again.");
        },
      }
    );
  };

  const generateSuggestionWithHistory = (
    aiMessageText: string,
    history: ConversationMessage[]
  ) => {
    console.log("🎯 Generating suggestion with history:", {
      aiMessageText,
      history,
      scenarioId: scenarioConfig.id,
    });

    suggestAnswer(
      {
        lastAiMessage: aiMessageText,
        scenarioId: scenarioConfig.id,
        conversationHistory: history.slice(-6),
      },
      {
        onSuccess: (response) => {
          console.log("✅ Suggestion generated:", response.suggestedAnswer);
          setCurrentSuggestion(response.suggestedAnswer);
          toast.success("Ready to practice! Say the suggested response.");
        },
        onError: (error) => {
          console.error("❌ Failed to generate suggestion:", error);
          toast.error("Failed to generate suggestion. Please try again.");
        },
      }
    );
  };

  const generateSuggestionForLastMessage = (aiMessageText: string) => {
    if (!session) return;

    generateSuggestionWithHistory(aiMessageText, conversationHistory);
  };

  const handleCorrectResponse = (userInput: string) => {
    // Send the message as if user typed it
    handleSendMessage(userInput);
    // Clear current suggestion while waiting for new AI response
    setCurrentSuggestion("");
  };

  const handleRetryPractice = () => {
    // Generate a new suggestion
    if (lastAiMessage) {
      generateSuggestionForLastMessage(lastAiMessage);
    }
  };

  const handleSuggestAnswer = () => {
    if (lastAiMessage) {
      generateSuggestionForLastMessage(lastAiMessage);
    } else {
      toast.error("No AI message to suggest an answer for");
    }
  };

  const handleErrorIconClick = (message: Message) => {
    setSelectedMessage(message);
    setFeedbackPanelOpen(true);
  };

  const handleRepeatAudio = (messageId: string) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (message && message.originalMessage) {
      speakMessage(message.originalMessage, learningLanguage as "en" | "es");
    }
  };

  const handlePlayPronunciation = (audioUrl: string) => {
    // This function handles pronunciation playback for user messages
    // In dialogue mode, we might not have audio URLs, but we can still implement this
    console.log("🔊 Playing pronunciation for audio URL:", audioUrl);
    // For now, this is a placeholder - you can implement actual audio playback if needed
  };

  const handleTranslate = (message: Message) => {
    if (!message) return;

    // Reset translation error state
    setTranslationError(false);

    // Language mapping for better display names
    const languageMap: Record<string, string> = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
    };

    // Determine source and target languages
    const sourceLang = learningLanguage;
    const targetLang = learningLanguage === "en" ? "es" : "en"; // Default fallback to Spanish/English

    const sourceLanguageName = languageMap[sourceLang] || sourceLang;
    const targetLanguageName = languageMap[targetLang] || targetLang;

    console.log("🌐 Translating message:", {
      messageId: message.id,
      text: message.originalMessage,
      from: sourceLanguageName,
      to: targetLanguageName,
    });

    translateMessage(
      {
        text: message.originalMessage,
        from: sourceLanguageName,
        to: targetLanguageName,
      },
      {
        onSuccess: (response) => {
          console.log("✅ Translation successful:", response);
          setSelectedTranslationMessage(message);
          setCurrentTranslation(response.translatedText); // Fixed: use translatedText instead of response.data.translation
          setTranslationPanelOpen(true);
          setTranslationError(false);
        },
        onError: (error) => {
          console.error("❌ Translation failed:", error);
          setTranslationError(true);
          setSelectedTranslationMessage(message);
          setCurrentTranslation(null);
          setTranslationPanelOpen(true);
          toast.error("Failed to translate message. Please try again.");
        },
      }
    );
  };

  // Error display
  if (initError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Start Dialogue
          </h2>
          <p className="text-gray-600 mb-4">
            There was an error starting the dialogue session.
          </p>
          <div className="space-x-4">
            <Button onClick={() => retryInit()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Link href="/dashboard/dialogue">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Scenarios
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 flex flex-col">
      {/* Scenario Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/dialogue">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {scenarioConfig.title}
              </h1>
              <p className="text-sm text-gray-600">
                Practice with {scenarioConfig.aiPersona.name} -{" "}
                {scenarioConfig.aiPersona.role}
              </p>
            </div>
          </div>

          {/* Scenario Info */}
          <Card className="bg-white/70 border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-blue-600" />
                  <span className="text-gray-700">
                    {scenarioConfig.aiPersona.name}
                  </span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600">
                  {scenarioConfig.difficulty}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600">{scenarioConfig.duration}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <ChatHeader
          isLoading={isInitializing}
          onNewChat={() => retryInit()}
          className="border-0 bg-transparent"
        />

        <MessageList
          messages={messages}
          isLoading={isInitializing}
          isAiTyping={isAiTyping}
          onErrorIconClick={handleErrorIconClick}
          onRepeatAudio={handleRepeatAudio}
          onTranslate={handleTranslate}
          onPlayPronunciation={handlePlayPronunciation}
        />

        <div className="bg-white/50 backdrop-blur-sm">
          <SpeechPracticeInterface
            key={currentSuggestion} // Force re-render when suggestion changes
            aiMessage={lastAiMessage}
            suggestedResponse={currentSuggestion}
            onCorrectResponse={handleCorrectResponse}
            onRetry={handleRetryPractice}
            isGeneratingSuggestion={
              isGeneratingSuggestion || !currentSuggestion
            }
            learningLanguage={learningLanguage}
          />
        </div>

        {/* Context Banner */}
        <div className="p-3 bg-blue-50/80 border-t border-blue-100/50">
          <p className="text-sm text-blue-700 text-center">
            <strong>Scenario:</strong> {scenarioConfig.context}
          </p>
        </div>
      </div>

      {/* Error Feedback Panel */}
      <ErrorFeedbackPanel
        isOpen={feedbackPanelOpen}
        onClose={() => setFeedbackPanelOpen(false)}
        message={selectedMessage}
      />

      {/* Translation Panel */}
      <TranslationPanel
        isOpen={translationPanelOpen}
        onClose={() => setTranslationPanelOpen(false)}
        message={selectedTranslationMessage}
        translation={currentTranslation}
        isLoading={isTranslating}
        isError={translationError}
        learningLanguage={learningLanguage}
        translationLanguage={user?.translationLanguage}
      />
    </div>
  );
}
