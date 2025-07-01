"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Search } from "lucide-react";
import { ALL_LANGUAGES } from "@/types/onboarding";
import ReactCountryFlag from "react-country-flag";

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

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData | null;
  onTranslationLanguageUpdate: (lang: string) => void;
  onTargetLanguageUpdate: (lang: string) => void;
  onTargetLanguageClick?: () => void; // Keep for backward compatibility if needed
}

export const SettingsPanel = ({
  isOpen,
  onClose,
  userData,
  onTranslationLanguageUpdate,
  onTargetLanguageUpdate,
}: SettingsPanelProps) => {
  const getLearningLanguage = () => {
    if (!userData?.learningLanguage) return null;
    return ALL_LANGUAGES.find(
      (lang) => lang.code === userData.learningLanguage
    );
  };

  const getLanguageFlag = (langCode: string) => {
    const lang = ALL_LANGUAGES.find((l) => l.code === langCode);
    return lang?.countryCode || "GB";
  };

  const getLanguageName = (langCode: string) => {
    const lang = ALL_LANGUAGES.find((l) => l.code === langCode);
    return lang?.name || "Select a language";
  };

  const learningLanguage = getLearningLanguage();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-1/2 bg-white border-l border-gray-200 p-6 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Settings Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-2"
          aria-label="Go back to account"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Translation Language */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Choose translation language
        </h3>
        <Select
          value={userData?.translationLanguage || "en"}
          onValueChange={onTranslationLanguageUpdate}
        >
          <SelectTrigger className="w-full p-4 h-auto border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <ReactCountryFlag
                  countryCode={getLanguageFlag(
                    userData?.translationLanguage || "en"
                  )}
                  svg
                  style={{
                    width: "2em",
                    height: "1.5em",
                  }}
                  title={getLanguageName(userData?.translationLanguage || "en")}
                />
                <span className="text-sm font-medium">
                  {getLanguageName(userData?.translationLanguage || "en")}
                </span>
              </div>
            </div>
          </SelectTrigger>
          <SelectContent>
            {ALL_LANGUAGES.map((language) => (
              <SelectItem key={language.code} value={language.code}>
                <div className="flex items-center gap-2">
                  <ReactCountryFlag
                    countryCode={language.countryCode || "GB"}
                    svg
                    style={{ width: "1.2em", height: "0.9em" }}
                  />
                  <span>{language.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Target Language */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Choose target language
        </h3>
        <Select
          value={userData?.learningLanguage || ""}
          onValueChange={onTargetLanguageUpdate}
        >
          <SelectTrigger className="w-full p-4 h-auto border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                {learningLanguage ? (
                  <ReactCountryFlag
                    countryCode={learningLanguage.countryCode || "GB"}
                    svg
                    style={{
                      width: "2em",
                      height: "1.5em",
                    }}
                    title={learningLanguage.name}
                  />
                ) : (
                  <span className="text-2xl">🌍</span>
                )}
                <span className="text-sm font-medium">
                  {learningLanguage?.name || "Select a language"}
                </span>
              </div>
            </div>
          </SelectTrigger>
          <SelectContent>
            {ALL_LANGUAGES.map((language) => (
              <SelectItem key={language.code} value={language.code}>
                <div className="flex items-center gap-2">
                  <ReactCountryFlag
                    countryCode={language.countryCode || "GB"}
                    svg
                    style={{ width: "1.2em", height: "0.9em" }}
                  />
                  <span>{language.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
