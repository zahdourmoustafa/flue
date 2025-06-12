'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  Calendar,
  BarChart3,
  Flame
} from 'lucide-react';
import { motion } from 'framer-motion';

const statsData = [
  {
    title: 'Total Learning Time',
    value: '24h 30m',
    change: '+2h this week',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    title: 'Conversations Completed',
    value: '47',
    change: '+8 this week',
    icon: Target,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    title: 'Current Streak',
    value: '12 days',
    change: 'Personal best!',
    icon: Flame,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    title: 'Achievements',
    value: '15',
    change: '+3 this month',
    icon: Award,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }
];

const weeklyProgress = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 30 },
  { day: 'Wed', minutes: 60 },
  { day: 'Thu', minutes: 25 },
  { day: 'Fri', minutes: 40 },
  { day: 'Sat', minutes: 35 },
  { day: 'Sun', minutes: 50 }
];

const achievements = [
  {
    title: 'First Conversation',
    description: 'Completed your first AI conversation',
    icon: '🎉',
    date: '2 weeks ago',
    earned: true
  },
  {
    title: 'Week Warrior',
    description: 'Practice 7 days in a row',
    icon: '⚡',
    date: '1 week ago',
    earned: true
  },
  {
    title: 'Pronunciation Pro',
    description: 'Get 10 perfect pronunciation scores',
    icon: '🎯',
    date: 'In progress',
    earned: false,
    progress: 70
  },
  {
    title: 'Conversation Master',
    description: 'Complete 100 conversations',
    icon: '👑',
    date: 'Locked',
    earned: false,
    progress: 47
  }
];

export default function ProgressPage() {
  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Your Progress</h1>
          <p className="text-gray-600">Track your language learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-xs text-green-600 font-medium">
                      {stat.change}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>This Week's Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyProgress.map((day, index) => (
                    <div key={day.day} className="flex items-center space-x-4">
                      <div className="w-12 text-sm text-gray-600 font-medium">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-900">
                            {day.minutes} minutes
                          </span>
                        </div>
                        <Progress 
                          value={(day.minutes / 60) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Level */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-0 shadow-sm mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span>Current Level</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">Level 2</div>
                  <p className="text-sm text-gray-600">Intermediate Beginner</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress to Level 3</span>
                      <span className="font-medium">340/500 XP</span>
                    </div>
                    <Progress value={68} className="h-3" />
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    160 XP needed for next level
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Goal */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span>Monthly Goal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1">18/25</div>
                  <p className="text-sm text-gray-600">Days practiced</p>
                </div>
                
                <Progress value={72} className="h-3 mb-3" />
                
                <div className="text-xs text-gray-500 text-center">
                  7 more days to reach your goal!
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={achievement.title}
                    className={`p-4 rounded-lg border ${
                      achievement.earned 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`text-2xl ${!achievement.earned && 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${
                          achievement.earned ? 'text-green-900' : 'text-gray-700'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm ${
                          achievement.earned ? 'text-green-700' : 'text-gray-600'
                        } mb-2`}>
                          {achievement.description}
                        </p>
                        {achievement.progress && !achievement.earned && (
                          <div className="mb-2">
                            <Progress value={achievement.progress} className="h-1" />
                            <p className="text-xs text-gray-500 mt-1">
                              {achievement.progress}% complete
                            </p>
                          </div>
                        )}
                        <p className={`text-xs ${
                          achievement.earned ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {achievement.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}