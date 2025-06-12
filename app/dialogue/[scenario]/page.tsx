'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const scenarioData = {
  'ordering-taxi': {
    title: 'Ordering a taxi',
    image: 'https://images.pexels.com/photos/442840/pexels-photo-442840.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Practice with a pre-scripted conversation. Record and read your part of the dialogue out loud.'
  },
  'booking-hotel': {
    title: 'Booking a hotel',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Learn essential hotel booking vocabulary and phrases through interactive dialogue.'
  },
  'at-supermarket': {
    title: 'At a supermarket',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Master grocery shopping conversations and everyday interactions.'
  }
};

interface DialogueScenarioPageProps {
  params: { scenario: string };
}

export default function DialogueScenarioPage({ params }: DialogueScenarioPageProps) {
  const { scenario } = params;
  const data = scenarioData[scenario as keyof typeof scenarioData] || scenarioData['ordering-taxi'];

  return (
    <AppLayout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/dialogue">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Dialogue Mode</h1>
        </div>

        {/* Scenario Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-64">
                <img
                  src={data.image}
                  alt={data.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {data.title}
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {data.description}
                </p>
                
                <Link href={`/dialogue/${scenario}/session`}>
                  <Button 
                    size="lg" 
                    className="fluentzy-gradient text-white border-0 hover:opacity-90 px-8 py-3"
                  >
                    Start
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}