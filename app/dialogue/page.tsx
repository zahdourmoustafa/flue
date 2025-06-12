'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, X } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

const dialogueScenarios = [
  {
    id: 'ordering-taxi',
    title: 'Ordering a taxi',
    image: 'https://images.pexels.com/photos/442840/pexels-photo-442840.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'Basics',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'booking-hotel',
    title: 'Booking a hotel',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'Basics',
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 'at-supermarket',
    title: 'At a supermarket',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'Basics',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'buying-clothes',
    title: 'Buying clothes',
    image: 'https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'Basics',
    color: 'from-red-400 to-orange-500'
  },
  {
    id: 'ordering-restaurant',
    title: 'Ordering food in a restaurant',
    image: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'Basics',
    color: 'from-green-400 to-blue-500'
  },
  {
    id: 'coffee-shop',
    title: 'Coffee shop',
    image: 'https://images.pexels.com/photos/302901/pexels-photo-302901.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'Basics',
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 'bank-account',
    title: 'Opening a bank account',
    image: 'https://images.pexels.com/photos/259132/pexels-photo-259132.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'Basics',
    color: 'from-emerald-400 to-blue-500'
  },
  {
    id: 'renting-apartment',
    title: 'Renting an apartment',
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'Basics',
    color: 'from-indigo-400 to-purple-500'
  }
];

export default function DialoguePage() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Dialogue Mode</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowInfo(true)}
          >
            <Info className="w-5 h-5" />
          </Button>
        </div>

        {/* Scenarios Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dialogueScenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/dialogue/${scenario.id}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 overflow-hidden group cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative h-48">
                      <img
                        src={scenario.image}
                        alt={scenario.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                          {scenario.level}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          New
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {scenario.title}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
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