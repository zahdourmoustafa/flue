"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Camera } from "lucide-react";
import Link from "next/link";

export const PopularModesSection = () => {
  const modes = [
    {
      id: "chat",
      title: "Chat",
      description:
        "Enhance your language skills by chatting with our AI teacher.",
      icon: MessageCircle,
      href: "/dashboard/chat",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      darkBgColor: "dark:bg-blue-950/20",
    },
    {
      id: "photo",
      title: "Photo Mode",
      description: "Describe images and get real-time feedback.",
      icon: Camera,
      href: "/dashboard/photo-mode",
      color: "text-green-600",
      bgColor: "bg-green-50",
      darkBgColor: "dark:bg-green-950/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Popular modes
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Try these learning modes
        </p>
      </div>

      <div className="space-y-4">
        {modes.map((mode) => (
          <Link key={mode.id} href={mode.href}>
            <Card className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-xl ${mode.bgColor} ${mode.darkBgColor}`}
                    >
                      <mode.icon className={`w-6 h-6 ${mode.color}`} />
                    </div>
                    <h3 className="font-bold text-lg">{mode.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {mode.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
