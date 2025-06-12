'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Video, Mic, MicOff, VideoOff, Phone } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function VideoCallPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const startCall = () => {
    setIsCallActive(true);
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  if (isCallActive) {
    return (
      <AppLayout>
        <div className="h-screen bg-gray-900 relative">
          {/* AI Teacher Video */}
          <div className="w-full h-full relative">
            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-6xl">👩‍🏫</span>
                </div>
                <h2 className="text-2xl font-semibold mb-2">Emma - AI Teacher</h2>
                <p className="text-white/80">Ready to help you learn!</p>
              </div>
            </div>
            
            {/* User Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                {isVideoOff ? (
                  <VideoOff className="w-8 h-8 text-white/60" />
                ) : (
                  <span className="text-4xl">👤</span>
                )}
              </div>
            </div>
          </div>

          {/* Call Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-md rounded-full px-6 py-4">
              <Button
                size="icon"
                variant={isMuted ? "destructive" : "secondary"}
                onClick={() => setIsMuted(!isMuted)}
                className="w-12 h-12 rounded-full"
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              
              <Button
                size="icon"
                variant="destructive"
                onClick={endCall}
                className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600"
              >
                <Phone className="w-5 h-5" />
              </Button>
              
              <Button
                size="icon"
                variant={isVideoOff ? "destructive" : "secondary"}
                onClick={() => setIsVideoOff(!isVideoOff)}
                className="w-12 h-12 rounded-full"
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Button 
              variant="secondary" 
              size="icon"
              onClick={endCall}
              className="bg-black/50 backdrop-blur-md hover:bg-black/70 text-white border-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Video Call Mode</h1>
        </div>

        {/* Call Setup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-64 bg-gradient-to-br from-blue-600 to-purple-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-5xl">👩‍🏫</span>
                    </div>
                    <h2 className="text-xl font-semibold">Emma - AI Teacher</h2>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Start Video Call
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Have a face-to-face conversation with Emma, your AI language teacher. 
                  Practice speaking naturally and get real-time feedback on your pronunciation and grammar.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4" />
                      <span>HD Video</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mic className="w-4 h-4" />
                      <span>Clear Audio</span>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    onClick={startCall}
                    className="fluentzy-gradient text-white border-0 hover:opacity-90 px-8 py-3"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Start Video Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}