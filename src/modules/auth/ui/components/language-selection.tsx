"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Language, ALL_LANGUAGES } from "@/types/onboarding";

interface LanguageSelectionProps {
  onLanguageSelect: (language: Language) => void;
  onBack?: () => void;
  selectedLanguage?: Language | null;
}

// Extended language data with learner counts (matching Busuu style)
const LANGUAGE_DATA = [
  { ...ALL_LANGUAGES.find((l) => l.code === "en")!, learners: "26M" },
  { ...ALL_LANGUAGES.find((l) => l.code === "es")!, learners: "5M" },
  { ...ALL_LANGUAGES.find((l) => l.code === "ja")!, learners: "4M" },
  { ...ALL_LANGUAGES.find((l) => l.code === "fr")!, learners: "5M" },
  { ...ALL_LANGUAGES.find((l) => l.code === "de")!, learners: "4M" },
  { ...ALL_LANGUAGES.find((l) => l.code === "ko")!, learners: "100K" },
  { ...ALL_LANGUAGES.find((l) => l.code === "it")!, learners: "2M" },
  { ...ALL_LANGUAGES.find((l) => l.code === "ar")!, learners: "1M" },
  { code: "ru", name: "Russian", flag: "🇷🇺", learners: "2M" },
  { ...ALL_LANGUAGES.find((l) => l.code === "zh")!, learners: "900K" },
  { code: "tr", name: "Turkish", flag: "🇹🇷", learners: "1M" },
  { ...ALL_LANGUAGES.find((l) => l.code === "pt")!, learners: "800K" },
  { ...ALL_LANGUAGES.find((l) => l.code === "nl")!, learners: "30K" },
  { code: "pl", name: "Polish", flag: "🇵🇱", learners: "500K" },
];

export const LanguageSelection = ({
  onLanguageSelect,
  onBack,
  selectedLanguage,
}: LanguageSelectionProps) => {
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);

  const handleLanguageClick = (language: Language) => {
    onLanguageSelect(language);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-gray-900">
          What would you like to learn?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {LANGUAGE_DATA.map((language) => (
            <button
              key={language.code}
              className={`bg-white rounded-lg border border-gray-200 p-6 text-center transition-all duration-200 hover:shadow-lg hover:border-blue-300 ${
                selectedLanguage?.code === language.code
                  ? "border-blue-500 shadow-lg"
                  : ""
              }`}
              onClick={() => handleLanguageClick(language)}
              onMouseEnter={() => setHoveredLanguage(language.code)}
              onMouseLeave={() => setHoveredLanguage(null)}
              aria-label={`Select ${language.name}`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                  <span className="text-4xl">{language.flag}</span>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {language.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {language.learners} learners
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedLanguage && (
          <div className="text-center">
            <Button
              onClick={() => onLanguageSelect(selectedLanguage)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              Continue with {selectedLanguage.name}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
