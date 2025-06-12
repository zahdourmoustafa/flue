'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Volume2, 
  Settings, 
  Mic, 
  RotateCcw,
  Languages,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const dialogueMessages = [
  {
    id: 1,
    sender: 'ai',
    name: 'Taxi driver',
    message: 'Hola, buenos días. ¿Necesita un taxi?',
    translation: 'Hello, good morning. Do you need a taxi?',
    avatar: '👨‍✈️'
  },
  {
    id: 2,
    sender: 'user',
    message: 'Sí, por favor. ¿Está disponible?',
    translation: 'Yes, please. Are you available?',
    isResponse: true
  },
  {
    id: 3,
    sender: 'ai',
    name: 'Taxi driver',
    message: 'Sí, claro. ¿A dónde desea ir?',
    translation: 'Yes, of course. Where would you like to go?',
    avatar: '👨‍✈️'
  },
  {
    id: 4,
    sender: 'user',
    message: 'Voy al aeropuerto, por favor.',
    translation: 'I\'m going to the airport, please.',
    isResponse: true
  }
];

interface DialogueSessionPageProps {
  params: { scenario: string };
}

export default function DialogueSessionPage({ params }: DialogueSessionPageProps) {
  const { scenario } = params;
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [userResponses, setUserResponses] = useState<{[key: number]: 'correct' | 'incorrect' | null}>({});
  const [showRetryPrompt, setShowRetryPrompt] = useState(false);

  const currentMessage = dialogueMessages[currentMessageIndex];
  const isUserTurn = currentMessage?.sender === 'user';

  const handlePlayAudio = () => {
    // Simulate audio playback
    console.log('Playing audio for:', currentMessage.message);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate recording for 2 seconds
    setTimeout(() => {
      setIsRecording(false);
      // Simulate pronunciation check (random result for demo)
      const isCorrect = Math.random() > 0.3;
      setUserResponses(prev => ({
        ...prev,
        [currentMessageIndex]: isCorrect ? 'correct' : 'incorrect'
      }));
      
      if (!isCorrect) {
        setShowRetryPrompt(true);
      } else {
        // Move to next message after success
        setTimeout(() => {
          if (currentMessageIndex < dialogueMessages.length - 1) {
            setCurrentMessageIndex(prev => prev + 1);
          }
        }, 1500);
      }
    }, 2000);
  };

  const handleRetry = () => {
    setShowRetryPrompt(false);
    setUserResponses(prev => ({
      ...prev,
      [currentMessageIndex]: null
    }));
  };

  const handleSkip = () => {
    setShowRetryPrompt(false);
    if (currentMessageIndex < dialogueMessages.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/dialogue/${scenario}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    👨‍✈️
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-900">Taxi driver</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">Online</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Volume2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {dialogueMessages.slice(0, currentMessageIndex + 1).map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' ? (
                  <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-gray-100">
                        {message.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Card className="border-0 bg-gray-100">
                        <CardContent className="p-4">
                          <p className="text-gray-900 font-medium mb-1">
                            {message.message}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handlePlayAudio}
                              className="h-6 px-2 text-xs"
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Repeat
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                            >
                              <Languages className="w-3 h-3 mr-1" />
                              Translate
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-xs lg:max-w-md">
                    {index === currentMessageIndex && !userResponses[index] ? (
                      // Current user turn - show response prompt
                      <Card className="border-2 border-blue-500 bg-blue-50">
                        <CardContent className="p-4">
                          <p className="text-blue-900 font-medium mb-2">
                            {message.message}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-blue-700 mb-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Repeat
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                            >
                              <Languages className="w-3 h-3 mr-1" />
                              Translate
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-green-700"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Pronunciation
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      // Completed user response
                      <Card className={`border-0 ${
                        userResponses[index] === 'correct' ? 'bg-green-100' : 
                        userResponses[index] === 'incorrect' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium ${
                              userResponses[index] === 'correct' ? 'text-green-900' : 
                              userResponses[index] === 'incorrect' ? 'text-red-900' : 'text-blue-900'
                            }`}>
                              {message.message}
                            </p>
                            {userResponses[index] === 'correct' && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                            {userResponses[index] === 'incorrect' && (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            {isUserTurn && !userResponses[currentMessageIndex] && (
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  className={`w-16 h-16 rounded-full ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'fluentzy-gradient hover:opacity-90'
                  } text-white border-0`}
                >
                  <Mic className="w-6 h-6" />
                </Button>
              </div>
            )}
            
            {currentMessageIndex >= dialogueMessages.length - 1 && userResponses[currentMessageIndex] && (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Great job! Dialogue completed!
                </h3>
                <Link href="/dialogue">
                  <Button className="fluentzy-gradient text-white border-0 hover:opacity-90">
                    Back to Dialogues
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Retry Prompt Modal */}
        <AnimatePresence>
          {showRetryPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full text-center"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Try again, read it out loud:
                </h3>
                <p className="text-red-600 font-medium mb-6">
                  {currentMessage.message}
                </p>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handleRetry}
                    className="flex-1"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleSkip}
                    className="flex-1"
                  >
                    Skip
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}