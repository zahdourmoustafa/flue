"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, LucideIcon, Crown, Lock } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface LearningModeCardProps {
  id: string;
  title: string;
  description: string;
  href: string;
  color: string;
  icon: LucideIcon;
  tags: string[];
  badge?: string;
}

export const LearningModeCard: React.FC<LearningModeCardProps> = ({
  id,
  title,
  description,
  href,
  color,
  icon: Icon,
  tags,
  badge,
}) => {
  const {
    hasFeatureAccess,
    requiresPremium,
    startSubscription,
    isCreatingCheckout,
  } = useSubscription();

  const isPremiumFeature = requiresPremium(id);
  const hasAccess = hasFeatureAccess(id);

  const handleButtonClick = (e: React.MouseEvent) => {
    if (isPremiumFeature && !hasAccess) {
      e.preventDefault();
      startSubscription();
    }
  };

  return (
    <div className="h-full">
      <Card
        className={`h-full hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden group hover:scale-105 cursor-pointer ${
          !hasAccess && isPremiumFeature ? "opacity-75" : ""
        }`}
      >
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header Section with Gradient */}
          <div
            className={`relative h-40 bg-gradient-to-br ${color} overflow-hidden`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/5" />
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8" />

            {/* Lock Overlay for Premium Features */}
            {isPremiumFeature && !hasAccess && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
                <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white" />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="relative p-6 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col gap-2">
                  {isPremiumFeature && (
                    <Badge
                      variant="secondary"
                      className="backdrop-blur-sm text-white hover:bg-white/30 border-0 bg-white/20 text-xs"
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      PRO
                    </Badge>
                  )}
                  {badge && badge !== "Premium" && (
                    <Badge
                      variant="secondary"
                      className="backdrop-blur-sm text-white hover:bg-white/30 border-0 bg-white/20"
                    >
                      {badge}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="text-white">
                <h3 className="text-xl font-bold mb-1">{title}</h3>
                <div className="w-12 h-1 bg-white/30 rounded-full" />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 flex-1 flex flex-col">
            <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-1">
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-100"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA Button */}
            {hasAccess ? (
              <Link href={href} className="block">
                <Button
                  className="w-full group-hover:bg-gray-900 group-hover:text-white transition-all duration-300 bg-gray-50 text-gray-700 hover:bg-gray-100 border-0 shadow-sm"
                  variant="outline"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleButtonClick}
                disabled={isCreatingCheckout}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white border-0 shadow-sm"
              >
                {isCreatingCheckout ? (
                  <span>Redirecting...</span>
                ) : (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    <span>Upgrade to Pro</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
