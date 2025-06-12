'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Clock, 
  Users, 
  Play, 
  BookOpen,
  Headphones,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const featuredLessons = [
  {
    id: 1,
    title: 'Daily Conversation Starters',
    description: 'Learn how to start conversations in different situations',
    image: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '15 min',
    level: 'Beginner',
    type: 'Dialogue',
    rating: 4.8,
    students: 1234,
    tags: ['Popular', 'New']
  },
  {
    id: 2,
    title: 'Restaurant Conversations',
    description: 'Master ordering food and dining etiquette',
    image: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '20 min',
    level: 'Intermediate',
    type: 'Roleplay',
    rating: 4.9,
    students: 987,
    tags: ['Trending']
  },
  {
    id: 3,
    title: 'Business Meeting Basics',
    description: 'Professional communication in workplace settings',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: '25 min',
    level: 'Advanced',
    type: 'Professional',
    rating: 4.7,
    students: 654,
    tags: ['Pro']
  }
];

const categories = [
  {
    name: 'Daily Life',
    icon: MessageCircle,
    color: 'from-blue-400 to-blue-600',
    count: 24
  },
  {
    name: 'Travel',
    icon: BookOpen,
    color: 'from-green-400 to-green-600',
    count: 18
  },
  {
    name: 'Business',
    icon: Users,
    color: 'from-purple-400 to-purple-600',
    count: 12
  },
  {
    name: 'Pronunciation',
    icon: Headphones,
    color: 'from-orange-400 to-orange-600',
    count: 30
  }
];

export default function ExplorePage() {
  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Explore</h1>
          <p className="text-gray-600">Discover new learning content and practice scenarios</p>
        </div>

        {/* Daily Pick */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="border-0 fluentzy-gradient text-white overflow-hidden">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="bg-white/20 text-white mb-4">Daily Pick</Badge>
                  <h2 className="text-2xl font-bold mb-4">
                    Master Coffee Shop Conversations
                  </h2>
                  <p className="text-white/90 mb-6">
                    Today's specially curated lesson focuses on ordering coffee, 
                    asking about menu items, and casual conversations with baristas.
                  </p>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">12 min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">4.9</span>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Learning
                  </Button>
                </div>
                <div className="hidden md:block">
                  <img
                    src="https://images.pexels.com/photos/302901/pexels-photo-302901.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Coffee shop"
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.count} lessons
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured Lessons */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Featured Lessons</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative h-48">
                      <img
                        src={lesson.image}
                        alt={lesson.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-4 left-4 flex space-x-2">
                        {lesson.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className={`text-xs ${
                              tag === 'Popular' ? 'bg-blue-500' :
                              tag === 'New' ? 'bg-green-500' :
                              tag === 'Trending' ? 'bg-purple-500' :
                              'bg-orange-500'
                            } text-white`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{lesson.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-current text-yellow-400" />
                            <span>{lesson.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {lesson.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {lesson.level}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {lesson.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {lesson.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>{lesson.students.toLocaleString()}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          Start Lesson
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}