"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Info } from "lucide-react";
import { Language, LanguageLevel, LANGUAGE_LEVELS } from "@/types/onboarding";

interface LanguageLevelSelectionProps {
  selectedLanguage: Language;
  onLevelSelect: (level: LanguageLevel) => void;
  onBack: () => void;
  selectedLevel?: LanguageLevel | null;
}

export const LanguageLevelSelection = ({
  selectedLanguage,
  onLevelSelect,
  onBack,
  selectedLevel,
}: LanguageLevelSelectionProps) => {
  const handleLevelClick = (level: LanguageLevel) => {
    onLevelSelect(level);
  };

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="p-0">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              aria-label="Go back to language selection"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold">
                What is your {selectedLanguage.name} level?
              </h1>
              <p className="text-muted-foreground mt-2">
                We will personalize conversations based on your language level.
              </p>
            </div>
            <Button variant="ghost" size="sm" aria-label="More information">
              <Info className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {LANGUAGE_LEVELS.map((level) => (
              <Button
                key={level.code}
                variant="outline"
                className={`w-full p-6 h-auto flex items-center justify-between text-left hover:bg-accent ${
                  selectedLevel?.code === level.code
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }`}
                onClick={() => handleLevelClick(level)}
                aria-label={`Select ${level.name} level`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-full ml-1"></div>
                        <div className="w-1 h-1 bg-blue-300 rounded-full ml-1"></div>
                      </div>
                      <span className="font-semibold text-base">
                        {level.name}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {level.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-muted-foreground">
                    {level.cefr}
                  </span>
                </div>
              </Button>
            ))}

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6"
              disabled={!selectedLevel}
              onClick={() => selectedLevel && onLevelSelect(selectedLevel)}
              aria-label="Continue with selected level"
            >
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
