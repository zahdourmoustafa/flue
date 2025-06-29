"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface TargetLanguageCardProps {
  userData: UserData | null;
  onTargetLanguageUpdate: (lang: string) => void;
  onLanguageSelectorOpen?: () => void; // Keep for backward compatibility if needed
}

export const TargetLanguageCard = ({
  userData,
  onTargetLanguageUpdate,
}: TargetLanguageCardProps) => {
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
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Target language</h2>
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
  );
};
