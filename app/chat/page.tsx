'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Volume2, 
  MoreVertical, 
  Mic,
  RotateCcw,
  Languages,
  Info,
  X
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

const chatMessages = [
  {
    id: 1,
    sender: 'ai',
    message: '¡Hola! Soy Emma, tu profesora personal de idiomas con IA. Pregúntame lo que quieras o haz clic en un tema abajo:',
    translation: 'Hello! I\'m Emma, your personal AI language teacher. Ask me anything or click on a topic below:',
    timestamp: '10:30 AM'
  }
];

const quickReplies = [
  'Divertido',
  'Interesante', 
  'Tú decides'
];

export default function ChatPage() {
  const [messages, setMessages] = useState(chatMessages);
  const [inputValue, setInputValue] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'user' as const,
      message: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai' as const,
        message: '¡Excelente! Esa es una buena respuesta. ¿Te gustaría practicar más conversación?',
        translation: 'Excellent! That\'s a good response. Would you like to practice more conversation?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickReply = (reply: string) => {
    const newMessage = {
      id: messages.length + 1,
      sender: 'user' as const,
      message: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-green-100 text-green-700">
                    👩‍🏫
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-900">Emma</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">AI Teacher</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Volume2 className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowInfo(true)}
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' ? (
                  <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-green-100 text-green-700">
                        👩‍🏫
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Card className="border-0 bg-gray-100">
                        <CardContent className="p-4">
                          <p className="text-gray-900 mb-1">
                            {message.message}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
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
                          </div>
                        </CardContent>
                      </Card>
                      <p className="text-xs text-gray-500 mt-1 ml-1">
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-xs lg:max-w-md">
                    <Card className="border-0 fluentzy-chat-gradient text-white">
                      <CardContent className="p-4">
                        <p>{message.message}</p>
                      </CardContent>
                    </Card>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {message.timestamp}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Quick Replies */}
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex justify-center space-x-3"
              >
                {quickReplies.map((reply) => (
                  <Button
                    key={reply}
                    variant="outline"
                    onClick={() => handleQuickReply(reply)}
                    className="rounded-full hover:bg-blue-50 hover:border-blue-300"
                  >
                    {reply}
                  </Button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex items-center space-x-3">
            <div className="flex-1 flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Aa"
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
            </div>
            <Button
              size="icon"
              className="fluentzy-gradient text-white border-0 hover:opacity-90 rounded-full"
            >
              <Mic className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Info Modal */}
        {showInfo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Information</h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowInfo(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Get feedback on messages</h4>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm">AI</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    AI will assess your messages and give you personalized feedback.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}