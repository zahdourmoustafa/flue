"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { ALL_LANGUAGES } from "@/types/onboarding";
import { validateOnboardingData } from "@/lib/utils";
import ReactCountryFlag from "react-country-flag";
import { useRouter } from "next/navigation";

interface WelcomeCardProps {
  userName: string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName }) => {
  const { user } = useAuth();
  const router = useRouter();

  const getLearningLanguageInfo = () => {
    if (!user?.learningLanguage) return null;

    const language = ALL_LANGUAGES.find(
      (lang) => lang.code === user.learningLanguage
    );
    return language;
  };

  const learningLanguage = getLearningLanguageInfo();
  const validation = user
    ? validateOnboardingData(user)
    : { isValid: true, issues: [] };

  // Show language setup prompt if onboarding data is missing
  if (!validation.isValid && user) {
    return (
      <div>
        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white border-0 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent" />

          <CardContent className="relative p-8">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-6 h-6 text-orange-100" />
              <h2 className="text-2xl font-bold">Complete Your Setup</h2>
            </div>

            <p className="text-orange-50 mb-6 text-base leading-relaxed">
              We need to set up your target language to personalize your
              learning experience.
            </p>

            <Button
              variant="secondary"
              onClick={() => router.push("/dashboard/account")}
              className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <span>Set Target Language</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

          {learningLanguage && (
            <div className="flex items-center gap-2 mb-4">
              <ReactCountryFlag
                countryCode={learningLanguage.countryCode || "GB"}
                svg
                style={{
                  width: "1.5em",
                  height: "1.125em",
                  borderRadius: "0.25rem",
                }}
              />
              <span className="text-blue-50 font-medium">
                Learning {learningLanguage.name}
              </span>
            </div>
          )}

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
