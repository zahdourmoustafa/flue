"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";
import { Language, LANGUAGES } from "@/types/onboarding";

interface LanguageSelectionProps {
  onLanguageSelect: (language: Language) => void;
  onBack?: () => void;
  selectedLanguage?: Language | null;
}

export const LanguageSelection = ({
  onLanguageSelect,
  onBack,
  selectedLanguage,
}: LanguageSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLanguages = LANGUAGES.filter((language) =>
    language.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageClick = (language: Language) => {
    onLanguageSelect(language);
  };

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="p-0">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold">
                Which language do you want to learn?
              </h1>
            </div>
          </div>

          <div className="space-y-6">
            {/* Main Language Grid */}
            <div className="grid grid-cols-4 gap-4">
              {filteredLanguages.slice(0, 16).map((language) => (
                <Button
                  key={language.code}
                  variant="outline"
                  className={`h-20 flex-col gap-2 hover:bg-accent ${
                    selectedLanguage?.code === language.code
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => handleLanguageClick(language)}
                  aria-label={`Select ${language.name}`}
                >
                  <span className="text-2xl">{language.flag}</span>
                  <span className="text-xs font-medium">{language.name}</span>
                </Button>
              ))}
            </div>

            {/* Search for Other Languages */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Other languages"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search for other languages"
                />
              </div>

              {searchTerm && filteredLanguages.length > 16 && (
                <div className="grid grid-cols-4 gap-2">
                  {filteredLanguages.slice(16).map((language) => (
                    <Button
                      key={language.code}
                      variant="outline"
                      className={`h-16 flex-col gap-1 text-xs hover:bg-accent ${
                        selectedLanguage?.code === language.code
                          ? "border-blue-500 bg-blue-50"
                          : ""
                      }`}
                      onClick={() => handleLanguageClick(language)}
                      aria-label={`Select ${language.name}`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span className="font-medium">{language.name}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!selectedLanguage}
              onClick={() =>
                selectedLanguage && onLanguageSelect(selectedLanguage)
              }
              aria-label="Continue with selected language"
            >
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
