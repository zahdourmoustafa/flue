"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { RealtimeClient } from "@openai/realtime-api-beta";

interface UseRealtimeCallProps {
  user: {
    id: string;
    name: string;
    learningLanguage?: string;
    languageLevel?: string;
  };
  onCallStart?: () => void;
  onCallEnd?: () => void;
}

interface UseRealtimeCallReturn {
  isConnected: boolean;
  isUserSpeaking: boolean;
  isAISpeaking: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  toggleMute: () => void;
}

export const useRealtimeCall = ({
  user,
  onCallStart,
  onCallEnd,
}: UseRealtimeCallProps): UseRealtimeCallReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const clientRef = useRef<RealtimeClient | null>(null);
  const isConnectingRef = useRef(false);
  const sessionReadyRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioChunksRef = useRef<Int16Array[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  // Get language-specific instructions
  const getLanguageInstructions = useCallback(
    (language: string, userName: string, level?: string) => {
      const levelText = level ? `${level} level` : "intermediate level";

      const baseInstructions = {
        es: `Eres Emma, una profesora senior de español. Habla SOLO en español. 
           Conduces una lección de conversación por voz con ${userName}, que está en nivel ${levelText}.
           
           COMPORTAMIENTO PRINCIPAL:
           - Mantén las respuestas bajo 20 palabras cuando sea posible
           - Corrige suavemente errores de pronunciación y gramática
           - Haz preguntas de seguimiento para fomentar la conversación
           - Proporciona refuerzo positivo
           - Adapta a su nivel de competencia
           
           ESTILO DE CORRECCIÓN:
           - "En realidad, se pronuncia así: [pronunciación correcta]"
           - "¡Bien! Solo una pequeña nota: decimos [corrección] en lugar de eso"
           - "¡Pronunciación perfecta! Ahora intenta esta frase..."
           
           FLUJO DE CONVERSACIÓN:
           - Comienza saludando usando su nombre: "¡Hola ${userName}! ¿Cómo estás?"
           - Pregunta sobre su día/intereses
           - Introduce vocabulario nuevo de forma natural
           - Corrige errores sin romper el flujo
           - Termina con ánimo y próximos pasos`,

        spanish: `Eres Emma, una profesora senior de español. Habla SOLO en español. 
           Conduces una lección de conversación por voz con ${userName}, que está en nivel ${levelText}.
           
           COMPORTAMIENTO PRINCIPAL:
           - Mantén las respuestas bajo 20 palabras cuando sea posible
           - Corrige suavemente errores de pronunciación y gramática
           - Haz preguntas de seguimiento para fomentar la conversación
           - Proporciona refuerzo positivo
           - Adapta a su nivel de competencia
           
           ESTILO DE CORRECCIÓN:
           - "En realidad, se pronuncia así: [pronunciación correcta]"
           - "¡Bien! Solo una pequeña nota: decimos [corrección] en lugar de eso"
           - "¡Pronunciación perfecta! Ahora intenta esta frase..."
           
           FLUJO DE CONVERSACIÓN:
           - Comienza saludando usando su nombre: "¡Hola ${userName}! ¿Cómo estás?"
           - Pregunta sobre su día/intereses
           - Introduce vocabulario nuevo de forma natural
           - Corrige errores sin romper el flujo
           - Termina con ánimo y próximos pasos`,

        en: `You are Emma, a senior English teacher. Speak ONLY in English.
           You are conducting a voice conversation lesson with ${userName}, who is at ${levelText}.
           
           CORE BEHAVIOR:
           - Keep responses under 20 words when possible
           - Gently correct pronunciation and grammar mistakes
           - Ask follow-up questions to encourage conversation
           - Provide positive reinforcement
           - Adapt to their proficiency level
           
           CORRECTION STYLE:
           - "Actually, it's pronounced like this: [correct pronunciation]"
           - "Good! Just a small note: we say [correction] instead"
           - "Perfect pronunciation! Now try this phrase..."
           
           CONVERSATION FLOW:
           - Start with greeting using their name: "Hi ${userName}! How are you doing?"
           - Ask about their day/interests
           - Introduce new vocabulary naturally
           - Correct mistakes without breaking flow
           - End with encouragement and next steps`,

        english: `You are Emma, a senior English teacher. Speak ONLY in English.
           You are conducting a voice conversation lesson with ${userName}, who is at ${levelText}.
           
           CORE BEHAVIOR:
           - Keep responses under 20 words when possible
           - Gently correct pronunciation and grammar mistakes
           - Ask follow-up questions to encourage conversation
           - Provide positive reinforcement
           - Adapt to their proficiency level
           
           CORRECTION STYLE:
           - "Actually, it's pronounced like this: [correct pronunciation]"
           - "Good! Just a small note: we say [correction] instead"
           - "Perfect pronunciation! Now try this phrase..."
           
           CONVERSATION FLOW:
           - Start with greeting using their name: "Hi ${userName}! How are you doing?"
           - Ask about their day/interests
           - Introduce new vocabulary naturally
           - Correct mistakes without breaking flow
           - End with encouragement and next steps`,

        fr: `Tu es Emma, une professeure de français expérimentée. Parle SEULEMENT en français.
           Tu conduis une leçon de conversation vocale avec ${userName}, qui est au niveau ${levelText}.
           
           COMPORTEMENT PRINCIPAL:
           - Garde les réponses sous 20 mots quand possible
           - Corrige doucement les erreurs de prononciation et de grammaire
           - Pose des questions de suivi pour encourager la conversation
           - Fournis un renforcement positif
           - Adapte-toi à leur niveau de compétence
           
           STYLE DE CORRECTION:
           - "En fait, ça se prononce comme ça: [prononciation correcte]"
           - "Bien! Juste une petite note: on dit [correction] plutôt"
           - "Prononciation parfaite! Maintenant essaie cette phrase..."
           
           FLUX DE CONVERSATION:
           - Commence en saluant avec leur nom: "Salut ${userName}! Comment ça va?"
           - Demande sur leur journée/intérêts
           - Introduis du nouveau vocabulaire naturellement
           - Corrige les erreurs sans casser le flux
           - Termine avec des encouragements et prochaines étapes`,

        french: `Tu es Emma, une professeure de français expérimentée. Parle SEULEMENT en français.
           Tu conduis une leçon de conversation vocale avec ${userName}, qui est au niveau ${levelText}.
           
           COMPORTEMENT PRINCIPAL:
           - Garde les réponses sous 20 mots quand possible
           - Corrige doucement les erreurs de prononciation et de grammaire
           - Pose des questions de suivi pour encourager la conversation
           - Fournis un renforcement positif
           - Adapte-toi à leur niveau de compétence
           
           STYLE DE CORRECTION:
           - "En fait, ça se prononce comme ça: [prononciation correcte]"
           - "Bien! Juste une petite note: on dit [correction] plutôt"
           - "Prononciation parfaite! Maintenant essaie cette phrase..."
           
           FLUX DE CONVERSATION:
           - Commence en saluant avec leur nom: "Salut ${userName}! Comment ça va?"
           - Demande sur leur journée/intérêts
           - Introduis du nouveau vocabulaire naturellement
           - Corrige les erreurs sans casser le flux
           - Termine avec des encouragements et prochaines étapes`,
      };

      return (
        baseInstructions[
          language.toLowerCase() as keyof typeof baseInstructions
        ] || baseInstructions.en
      );
    },
    []
  );

  // Audio playback function
  const playAudioChunks = useCallback(async (audioData: Int16Array) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const audioContext = audioContextRef.current;

      // Convert Int16Array to Float32Array
      const float32Data = new Float32Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        float32Data[i] = audioData[i] / 32768.0; // Convert from 16-bit to float
      }

      // Create audio buffer
      const audioBuffer = audioContext.createBuffer(
        1,
        float32Data.length,
        24000
      ); // 24kHz sample rate
      audioBuffer.getChannelData(0).set(float32Data);

      // Create source and play
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }, []);

  const connect = useCallback(async () => {
    if (isConnectingRef.current || clientRef.current) return;

    try {
      isConnectingRef.current = true;
      sessionReadyRef.current = false;
      setError(null);

      // Debug user data
      console.log("User data for call:", user);
      console.log("User name:", user.name);
      console.log("Learning language:", user.learningLanguage);
      console.log("Language level:", user.languageLevel);

      // Validate that we have a learning language
      if (!user.learningLanguage) {
        setError(
          "Learning language not set. Please configure your language settings first."
        );
        return;
      }

      // Request microphone permission and setup audio capture
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        mediaStreamRef.current = stream;

        // Create audio context with browser's default sample rate
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        console.log("Audio context sample rate:", audioContext.sampleRate);

        // Create audio source from microphone
        const source = audioContext.createMediaStreamSource(stream);

        // Create script processor to capture audio data
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (event) => {
          if (!sessionReadyRef.current || !clientRef.current) return;

          const inputBuffer = event.inputBuffer;
          const inputData = inputBuffer.getChannelData(0);

          // Check if there's actual audio activity (not just silence)
          const hasAudio = inputData.some((sample) => Math.abs(sample) > 0.01);

          if (hasAudio) {
            console.log(
              "Sending audio data to API, audio level:",
              Math.max(...Array.from(inputData).map(Math.abs))
            );
          }

          // Resample to 24kHz if needed (OpenAI requires 24kHz)
          let processedData = inputData;
          if (audioContext.sampleRate !== 24000) {
            // Simple resampling - for production, use a proper resampling library
            const ratio = 24000 / audioContext.sampleRate;
            const resampledLength = Math.floor(inputData.length * ratio);
            const resampled = new Float32Array(resampledLength);

            for (let i = 0; i < resampledLength; i++) {
              const sourceIndex = i / ratio;
              const index = Math.floor(sourceIndex);
              const fraction = sourceIndex - index;

              if (index + 1 < inputData.length) {
                resampled[i] =
                  inputData[index] * (1 - fraction) +
                  inputData[index + 1] * fraction;
              } else {
                resampled[i] = inputData[index] || 0;
              }
            }
            processedData = resampled;
          }

          // Convert Float32Array to Int16Array (required by OpenAI API)
          const int16Data = new Int16Array(processedData.length);
          for (let i = 0; i < processedData.length; i++) {
            // Convert from [-1, 1] to [-32768, 32767]
            int16Data[i] = Math.max(
              -32768,
              Math.min(32767, processedData[i] * 32768)
            );
          }

          // Send audio data to OpenAI Realtime API
          try {
            clientRef.current.appendInputAudio(int16Data);
          } catch (err) {
            console.error("Failed to send audio data:", err);
          }
        };

        // Connect audio processing chain
        source.connect(processor);
        processor.connect(audioContext.destination);

        console.log("Microphone audio capture setup successfully");
      } catch (micError) {
        console.error("Microphone error:", micError);
        setError(
          "Microphone access denied. Please allow microphone access to use call mode."
        );
        return;
      }

      // Create new client instance with direct API key
      clientRef.current = new RealtimeClient({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowAPIKeyInBrowser: true,
      });

      const client = clientRef.current;

      // Configure session
      const language = user.learningLanguage || "en";
      const userName = user.name || "there"; // Fallback if name is empty
      const instructions = getLanguageInstructions(
        language,
        userName,
        user.languageLevel
      );

      // Set up event listeners BEFORE connecting
      client.on("error", (event: any) => {
        console.error("Realtime error:", event);
        setError("Connection error occurred");
        setIsConnected(false);
        sessionReadyRef.current = false;
      });

      client.on("conversation.updated", (event: any) => {
        const { item, delta } = event;

        if (item?.type === "message" && item?.role === "assistant") {
          if (item?.status === "in_progress") {
            setIsAISpeaking(true);
            setIsUserSpeaking(false);
          } else if (item?.status === "completed") {
            setIsAISpeaking(false);
          }
        }

        // Handle delta audio for real-time speaking detection and playback
        if (delta?.audio) {
          setIsAISpeaking(true);
          // Collect audio chunks
          audioChunksRef.current.push(new Int16Array(delta.audio));
        }
      });

      client.on("conversation.interrupted", () => {
        setIsAISpeaking(false);
        setIsUserSpeaking(true);
      });

      client.on("input_audio_buffer.speech_started", () => {
        setIsUserSpeaking(true);
        setIsAISpeaking(false);
        console.log("User started speaking");
      });

      client.on("input_audio_buffer.speech_stopped", () => {
        setIsUserSpeaking(false);
        console.log("User stopped speaking");
      });

      // Handle connection and session events
      client.on(
        "realtime.event",
        ({ source, event }: { source: string; event: any }) => {
          console.log("Realtime event:", source, event.type);

          // Log all voice activity detection events
          if (
            event.type.includes("input_audio_buffer") ||
            event.type.includes("speech")
          ) {
            console.log("Voice activity event:", event.type, event);
          }

          if (source === "server" && event.type === "session.created") {
            console.log("Session created, ready to start conversation");
            sessionReadyRef.current = true;
            setIsConnected(true);
            onCallStart?.();

            // Start the conversation by having the AI greet the user
            setTimeout(() => {
              if (sessionReadyRef.current && clientRef.current) {
                try {
                  console.log("Triggering AI's initial greeting.");
                  clientRef.current.createResponse();
                } catch (err) {
                  console.error("Failed to trigger initial greeting:", err);
                }
              }
            }, 500);
          }

          // Log session update confirmation
          if (source === "server" && event.type === "session.updated") {
            console.log("Session updated with config:", event.session);
          }

          // Play collected audio when response is complete
          if (source === "server" && event.type === "response.audio.done") {
            if (audioChunksRef.current.length > 0) {
              // Combine all audio chunks
              const totalLength = audioChunksRef.current.reduce(
                (sum, chunk) => sum + chunk.length,
                0
              );
              const combinedAudio = new Int16Array(totalLength);
              let offset = 0;

              for (const chunk of audioChunksRef.current) {
                combinedAudio.set(chunk, offset);
                offset += chunk.length;
              }

              // Play the combined audio
              playAudioChunks(combinedAudio);

              // Clear chunks for next response
              audioChunksRef.current = [];
            }
          }
        }
      );

      // Configure session with updated instructions that tell AI to greet first
      const getGreetingMessage = (lang: string, name: string) => {
        const greetings: Record<string, string> = {
          es: `¡Hola ${name}! ¿Cómo estás?`,
          spanish: `¡Hola ${name}! ¿Cómo estás?`,
          en: `Hi ${name}! How are you doing?`,
          english: `Hi ${name}! How are you doing?`,
          fr: `Salut ${name}! Comment ça va?`,
          french: `Salut ${name}! Comment ça va?`,
        };
        return greetings[lang.toLowerCase()] || greetings.en;
      };

      const greetingMessage = getGreetingMessage(language, userName);

      console.log("Language detected:", language);
      console.log("Greeting message that will be used:", greetingMessage);

      const greetingInstructions = `${instructions}

IMPORTANT: You MUST start the conversation. Your first message must be ONLY: "${greetingMessage}"`;

      client.updateSession({
        instructions: greetingInstructions,
        voice: "alloy",
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
        },
        input_audio_transcription: { model: "whisper-1" },
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        temperature: 0.7,
        max_response_output_tokens: 150,
      });

      // Connect to API
      await client.connect();
    } catch (err) {
      console.error("Failed to connect:", err);
      setError(
        "Failed to connect to voice service. Please check your connection."
      );
      setIsConnected(false);
      sessionReadyRef.current = false;
    } finally {
      isConnectingRef.current = false;
    }
  }, [user, getLanguageInstructions, onCallStart, playAudioChunks]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      try {
        clientRef.current.disconnect();
        clientRef.current = null;
      } catch (err) {
        console.error("Error disconnecting:", err);
      }
    }

    // Clean up media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Clean up audio processor
    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
        processorRef.current = null;
      } catch (err) {
        console.error("Error disconnecting processor:", err);
      }
    }

    // Clean up audio context
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
        audioContextRef.current = null;
      } catch (err) {
        console.error("Error closing audio context:", err);
      }
    }

    // Clear audio chunks
    audioChunksRef.current = [];

    setIsConnected(false);
    setIsUserSpeaking(false);
    setIsAISpeaking(false);
    setError(null);
    sessionReadyRef.current = false;
    onCallEnd?.();
  }, [onCallEnd]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
    // TODO: Implement actual muting when available in the API
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  return {
    isConnected,
    isUserSpeaking,
    isAISpeaking,
    error,
    connect,
    disconnect,
    toggleMute,
  };
};
