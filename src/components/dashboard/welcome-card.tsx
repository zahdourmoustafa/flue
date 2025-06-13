"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface WelcomeCardProps {
  userName: string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName }) => {
  return (
    <div>
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />

        <CardContent className="relative p-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-blue-100" />
            <h2 className="text-2xl font-bold">Hello, {userName}!</h2>
          </div>

          <p className="text-blue-50 mb-6 text-base leading-relaxed">
            Ready to level up your language skills today? We have exciting new
            content waiting for you!
          </p>

          <Button
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            <span>Explore Today's Pick</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
