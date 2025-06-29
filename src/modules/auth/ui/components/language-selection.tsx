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

// Extended language data with learner counts (matching Busuu style)
const LANGUAGE_DATA = [
  { code: "en", name: "English", countryCode: "GB", learners: "26M" },
  { code: "es", name: "Spanish", countryCode: "ES", learners: "5M" },
  { code: "ja", name: "Japanese", countryCode: "JP", learners: "4M" },
  { code: "fr", name: "French", countryCode: "FR", learners: "5M" },
  { code: "de", name: "German", countryCode: "DE", learners: "4M" },
  { code: "ko", name: "Korean", countryCode: "KR", learners: "100K" },
  { code: "it", name: "Italian", countryCode: "IT", learners: "2M" },
  { code: "ar", name: "Arabic", countryCode: "AE", learners: "1M" },
  { code: "ru", name: "Russian", countryCode: "RU", learners: "2M" },
  { code: "zh", name: "Chinese", countryCode: "CN", learners: "900K" },
  { code: "tr", name: "Turkish", countryCode: "TR", learners: "1M" },
  { code: "pt", name: "Portuguese", countryCode: "PT", learners: "800K" },
  { code: "nl", name: "Dutch", countryCode: "NL", learners: "30K" },
  { code: "pl", name: "Polish", countryCode: "PL", learners: "500K" },
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
