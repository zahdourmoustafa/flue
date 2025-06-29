"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { ALL_LANGUAGES } from "@/types/onboarding";

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: string;
  onLanguageSelect: (languageCode: string) => void;
  isLoading?: boolean;
}

export const LanguageSelector = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageSelect,
  isLoading = false,
}: LanguageSelectorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleLanguageClick = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleConfirm = () => {
    if (selectedLanguage) {
      onLanguageSelect(selectedLanguage);
    }
  };

  const getCurrentLanguageName = () => {
    const lang = ALL_LANGUAGES.find((l) => l.code === currentLanguage);
    return lang?.name || "Unknown";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Choose your target language
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Currently learning:</span>
            {currentLanguage && (
              <div className="flex items-center gap-2">
                <ReactCountryFlag
                  countryCode={
                    ALL_LANGUAGES.find((l) => l.code === currentLanguage)
                      ?.countryCode || "GB"
                  }
                  svg
                  style={{ width: "1.2em", height: "0.9em" }}
                />
                <strong>{getCurrentLanguageName()}</strong>
              </div>
            )}
            {!currentLanguage && <strong>None selected</strong>}
          </div>

          <div className="space-y-2">
            {ALL_LANGUAGES.map((language) => (
              <Card
                key={language.code}
                className={`p-4 cursor-pointer transition-all border-2 ${
                  selectedLanguage === language.code
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleLanguageClick(language.code)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ReactCountryFlag
                      countryCode={language.countryCode || "GB"}
                      svg
                      style={{
                        width: "2em",
                        height: "1.5em",
                      }}
                    />
                    <span className="font-medium text-gray-900">
                      {language.name}
                    </span>
                  </div>
                  {selectedLanguage === language.code && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1"
            disabled={
              !selectedLanguage ||
              selectedLanguage === currentLanguage ||
              isLoading
            }
          >
            {isLoading ? "Updating..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
