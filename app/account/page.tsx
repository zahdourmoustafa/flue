'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Settings, 
  Bell, 
  Globe, 
  Shield,
  CreditCard,
  LogOut,
  Edit3
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccountPage() {
  return (
    <AppLayout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Account</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">
                    M
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Moustafa Ahmed
                </h2>
                <p className="text-gray-600 mb-4">Level 2 - Intermediate Beginner</p>
                <Button variant="outline" size="sm" className="mb-4">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Member since</span>
                    <span className="font-medium">Jan 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total XP</span>
                    <span className="font-medium">1,240</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current streak</span>
                    <span className="font-medium">12 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Moustafa" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Ahmed" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="moustafa@example.com" />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Learning Preferences */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span>Learning Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="targetLanguage">Target Language</Label>
                    <Input id="targetLanguage" defaultValue="Spanish" />
                  </div>
                  <div>
                    <Label htmlFor="dailyGoal">Daily Goal (minutes)</Label>
                    <Input id="dailyGoal" type="number" defaultValue="30" />
                  </div>
                  <div>
                    <Label htmlFor="proficiencyLevel">Current Proficiency</Label>
                    <Input id="proficiencyLevel" defaultValue="Intermediate Beginner" />
                  </div>
                  <Button>Update Preferences</Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start h-12">
                      <Bell className="w-5 h-5 mr-3" />
                      Notifications
                    </Button>
                    <Button variant="outline" className="justify-start h-12">
                      <Globe className="w-5 h-5 mr-3" />
                      Language Settings
                    </Button>
                    <Button variant="outline" className="justify-start h-12">
                      <Shield className="w-5 h-5 mr-3" />
                      Privacy & Security
                    </Button>
                    <Button variant="outline" className="justify-start h-12">
                      <CreditCard className="w-5 h-5 mr-3" />
                      Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-0 shadow-sm border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Account Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                      <LogOut className="w-5 h-5 mr-3" />
                      Sign Out
                    </Button>
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