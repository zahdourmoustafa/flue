"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Mic,
  Play,
  Video,
  Phone,
  ChevronRight,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const learningModes = [
  {
    name: "Chat Mode",
    description:
      "Enhance your language skills by chatting with our AI teacher.",
    icon: MessageCircle,
    href: "/dashboard/chat",
    gradient: "fluentzy-chat-gradient",
    popular: true,
  },
  {
    name: "Dialogue Mode",
    description:
      "Practice essential daily vocabulary with pre-scripted conversations.",
    icon: Mic,
    href: "/dashboard/dialogue",
    gradient: "fluentzy-gradient",
  },
  {
    name: "Sentence Mode",
    description: "Build a solid foundation by learning sentence basics.",
    icon: Play,
    href: "/dashboard/sentence-mode",
    gradient: "fluentzy-orange-gradient",
  },
  {
    name: "Video Call",
    description: "Practice speaking through video conversations.",
    icon: Video,
    href: "/dashboard/videocall",
    gradient: "fluentzy-chat-gradient",
  },
  {
    name: "Call Mode",
    description: "Improve pronunciation with voice-only conversations.",
    icon: Phone,
    href: "/dashboard/call-mode",
    gradient: "fluentzy-gradient",
  },
];

const sentenceLessons = [
  {
    id: 1,
    title: "Introducing yourself",
    description: "Learn basic self-introduction phrases",
    image: "/api/placeholder/200/120",
  },
  {
    id: 2,
    title: "Introducing someone else",
    description: "How to introduce others professionally",
    image: "/api/placeholder/200/120",
  },
];

export default function ExplorePage() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Explore</h1>
          <p className="text-gray-600 mt-1">
            Discover new ways to practice and improve
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            <Star className="w-4 h-4 mr-1 text-yellow-500" />
            Suggested for you
          </Badge>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Daily Pick & Characters */}
        <div className="lg:col-span-5 space-y-6">
          {/* Daily Pick */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your daily pick
                </h2>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  <Clock className="w-3 h-3 mr-1" />
                  New
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                Here is your daily pick to improve your language learning skills
                with engaging experience.
              </p>

              {/* Featured Daily Pick */}
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                  <Badge className="mb-3 bg-white/20 text-white hover:bg-white/30">
                    Dialogue Mode
                  </Badge>
                  <h3 className="text-lg font-semibold mb-2">
                    Daily Conversation
                  </h3>
                  <p className="text-sm text-gray-200 mb-4">
                    Practice essential vocabulary with today's featured dialogue
                    scenario
                  </p>
                  <Button
                    size="sm"
                    className="bg-white text-gray-900 hover:bg-gray-100"
                    asChild
                  >
                    <Link href="/dashboard/dialogue">
                      Start Practice
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Dialogue Mode */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Dialogue Mode</CardTitle>
              <p className="text-sm text-gray-600">
                Practice essential daily vocabulary with pre-scripted
                conversations.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700">
                  Today's dialogues
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-amber-800 to-orange-900 flex items-center justify-center cursor-pointer group">
                    <div className="text-center text-white p-3">
                      <Mic className="w-8 h-8 mx-auto mb-2" />
                      <h5 className="font-medium text-sm">House chores</h5>
                    </div>
                  </div>
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-rose-800 to-pink-900 flex items-center justify-center cursor-pointer group">
                    <div className="text-center text-white p-3">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                      <h5 className="font-medium text-sm">Online dating</h5>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Popular Modes */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Popular modes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningModes.map((mode) => (
                <div
                  key={mode.name}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${mode.gradient} flex items-center justify-center`}
                    >
                      <mode.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">
                          {mode.name}
                        </h3>
                        {mode.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {mode.description}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={mode.href}>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sentence Mode */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Sentence Mode</CardTitle>
              <p className="text-sm text-gray-600">
                Build a solid foundation of your language skills by learning
                basics.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700">
                  Today's lessons
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {sentenceLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-violet-800 to-purple-900 flex items-center justify-center cursor-pointer group"
                    >
                      <div className="text-center text-white p-3">
                        <Play className="w-8 h-8 mx-auto mb-2" />
                        <h5 className="font-medium text-sm">{lesson.title}</h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
