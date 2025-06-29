"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
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
    <Card>
      <CardHeader>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-900 w-fit"
          aria-label="Go back to language selection"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            What is your {selectedLanguage.name} level?
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            We will personalize conversations based on your language level.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-8">
          {LANGUAGE_LEVELS.map((level, index) => (
            <button
              key={level.code}
              className={`w-full bg-white rounded-lg border border-gray-200 p-6 text-left transition-all duration-200 hover:shadow-md hover:border-blue-300 ${
                selectedLevel?.code === level.code
                  ? "border-blue-500 shadow-md"
                  : ""
              }`}
              onClick={() => handleLevelClick(level)}
              aria-label={`Select ${level.name} level`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {level.name}
                  </h3>
                  <p className="text-gray-600 mt-1">{level.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {level.cefr}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedLevel && (
          <div className="text-center">
            <Button
              onClick={() => onLevelSelect(selectedLevel)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              Continue with {selectedLevel.name}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
