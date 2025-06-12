'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  MessageCircle, 
  Video, 
  Mic, 
  Play,
  ArrowRight,
  Clock,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const learningModes = [
  {
    id: 'chat',
    title: 'Chat',
    description: 'Enhance your language skills by chatting with our AI teacher.',
    href: '/chat',
    color: 'from-yellow-400 to-orange-500',
    icon: MessageCircle,
    tags: ['#Writing', '#Reading']
  },
  {
    id: 'call',
    title: 'Call Mode',
    description: 'Audio-only conversation to boost your speaking proficiency.',
    href: '/video-call',
    color: 'from-red-400 to-pink-500',
    icon: Video,
    tags: ['#Speaking', '#Listening'],
    badge: 'New'
  },
  {
    id: 'sentence',
    title: 'Sentence Mode',
    description: 'Build a solid foundation of your language skills by learning basics.',
    href: '/sentence',
    color: 'from-blue-400 to-purple-500',
    icon: Play,
    tags: ['#Speaking', '#Pronunciation'],
    badge: 'New'
  },
  {
    id: 'dialogue',
    title: 'Dialogue Mode',
    description: 'Practice essential daily vocabulary with pre-scripted conversations.',
    href: '/dialogue',
    color: 'from-green-400 to-blue-500',
    icon: Mic,
    tags: ['#Speaking', '#Pronunciation'],
    badge: 'New'
  }
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Learning Modes</h1>
          <p className="text-gray-600">Choose how you want to practice today</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Learning Modes */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {learningModes.map((mode, index) => (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 overflow-hidden group">
                    <CardContent className="p-0">
                      <div className={`h-32 bg-gradient-to-br ${mode.color} relative`}>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute top-4 left-4">
                          <mode.icon className="w-8 h-8 text-white" />
                        </div>
                        {mode.badge && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                              {mode.badge}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {mode.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {mode.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {mode.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link href={mode.href}>
                          <Button 
                            className="w-full group-hover:bg-gray-900 transition-colors"
                            variant="outline"
                          >
                            Start Learning
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Welcome Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="fluentzy-gradient text-white border-0">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">Hello, MOUSTAFA!</h2>
                  <p className="text-white/90 text-sm mb-4">
                    Have you tried our Explore tab? We have a daily pick ready for you.
                  </p>
                  <Button 
                    variant="secondary" 
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    See your daily pick
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="border-0 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Level 1</h3>
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Your current level.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Minutes left till the next level:</span>
                        <span className="font-medium">5 minutes</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">Keep on learning!</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-medium">1</span>
                      <div className="flex-1 mx-3">
                        <div className="h-2 bg-blue-200 rounded-full">
                          <div className="h-2 bg-blue-600 rounded-full w-3/4"></div>
                        </div>
                      </div>
                      <span className="w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center font-medium">2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-0 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Stats</h3>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-6">Your personal learning data.</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">0 minutes</div>
                        <div className="text-xs text-gray-500">Total learning time.</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">0 achievements</div>
                        <div className="text-xs text-gray-500">Badges earned.</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}