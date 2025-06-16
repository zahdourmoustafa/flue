"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { LANGUAGES } from "@/types/onboarding";

interface UserData {
  id: string;
  name: string;
  email: string;
  preferredLanguage?: string;
  translationLanguage?: string;
  learningLanguage?: string;
  languageLevel?: string;
  image?: string;
}

interface TargetLanguageCardProps {
  userData: UserData | null;
  onLanguageSelectorOpen: () => void;
}

export const TargetLanguageCard = ({
  userData,
  onLanguageSelectorOpen,
}: TargetLanguageCardProps) => {
  const getLearningLanguage = () => {
    if (!userData?.learningLanguage) return null;
    return LANGUAGES.find((lang) => lang.code === userData.learningLanguage);
  };

  const learningLanguage = getLearningLanguage();

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Target language</h2>
      <Card
        className="p-6 cursor-pointer hover:border-gray-300 transition-colors border border-gray-200"
        onClick={onLanguageSelectorOpen}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {learningLanguage ? (
              <>
                <span className="text-3xl">{learningLanguage.flag}</span>
                <span className="text-lg font-medium text-gray-900">
                  {learningLanguage.name}
                </span>
              </>
            ) : (
              <>
                <span className="text-3xl">🌍</span>
                <span className="text-lg font-medium text-gray-900">
                  No language selected
                </span>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onLanguageSelectorOpen();
            }}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
