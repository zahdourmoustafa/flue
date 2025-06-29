"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Language, ALL_LANGUAGES } from "@/types/onboarding";
import ReactCountryFlag from "react-country-flag";

interface LanguageSelectionProps {
  onLanguageSelect: (language: Language) => void;
  onBack?: () => void;
  selectedLanguage?: Language | null;
}

interface ExtendedLanguage extends Omit<Language, "countryCode"> {
  countryCode: string;
  learners: string;
}

// Extended language data with learner counts (matching Busuu style)
const LANGUAGE_DATA: ExtendedLanguage[] = [
  {
    code: "en",
    name: "English",
    flag: "🇬🇧",
    countryCode: "GB",
    learners: "26M",
  },
  {
    code: "es",
    name: "Spanish",
    flag: "🇪🇸",
    countryCode: "ES",
    learners: "5M",
  },
  {
    code: "ja",
    name: "Japanese",
    flag: "🇯🇵",
    countryCode: "JP",
    learners: "4M",
  },
  { code: "fr", name: "French", flag: "🇫🇷", countryCode: "FR", learners: "5M" },
  { code: "de", name: "German", flag: "🇩🇪", countryCode: "DE", learners: "4M" },
  {
    code: "ko",
    name: "Korean",
    flag: "🇰🇷",
    countryCode: "KR",
    learners: "100K",
  },
  {
    code: "it",
    name: "Italian",
    flag: "🇮🇹",
    countryCode: "IT",
    learners: "2M",
  },
  { code: "ar", name: "Arabic", flag: "🇦🇪", countryCode: "AE", learners: "1M" },
  {
    code: "ru",
    name: "Russian",
    flag: "🇷🇺",
    countryCode: "RU",
    learners: "2M",
  },
  {
    code: "zh",
    name: "Chinese",
    flag: "🇨🇳",
    countryCode: "CN",
    learners: "900K",
  },
  {
    code: "tr",
    name: "Turkish",
    flag: "🇹🇷",
    countryCode: "TR",
    learners: "1M",
  },
  {
    code: "pt",
    name: "Portuguese",
    flag: "🇵🇹",
    countryCode: "PT",
    learners: "800K",
  },
  { code: "nl", name: "Dutch", flag: "🇳🇱", countryCode: "NL", learners: "30K" },
  {
    code: "pl",
    name: "Polish",
    flag: "🇵🇱",
    countryCode: "PL",
    learners: "500K",
  },
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
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  <ReactCountryFlag
                    countryCode={language.countryCode}
                    svg
                    style={{
                      width: "3rem",
                      height: "2.25rem",
                      borderRadius: "0.375rem",
                    }}
                  />
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
