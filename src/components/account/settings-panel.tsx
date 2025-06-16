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

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData | null;
  onInterfaceLanguageUpdate: (lang: string) => void;
  onTranslationLanguageUpdate: (lang: string) => void;
  onTargetLanguageClick: () => void;
}

export const SettingsPanel = ({
  isOpen,
  onClose,
  userData,
  onInterfaceLanguageUpdate,
  onTranslationLanguageUpdate,
  onTargetLanguageClick,
}: SettingsPanelProps) => {
  const getLearningLanguage = () => {
    if (!userData?.learningLanguage) return null;
    return LANGUAGES.find((lang) => lang.code === userData.learningLanguage);
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

      {/* Interface Language */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Choose interface language
        </h3>
        <Card className="p-4 cursor-pointer hover:border-gray-300 transition-colors border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {userData?.preferredLanguage === "es" ? "🇪🇸" : "🇬🇧"}
              </span>
              <span className="font-medium text-gray-900">
                {userData?.preferredLanguage === "es" ? "Spanish" : "English"}
              </span>
            </div>
            <Select
              value={userData?.preferredLanguage || "en"}
              onValueChange={onInterfaceLanguageUpdate}
            >
              <SelectTrigger className="w-32 border-none bg-transparent">
                <Search className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>

      {/* Translation Language */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Choose translation language
        </h3>
        <Card className="p-4 cursor-pointer hover:border-gray-300 transition-colors border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {userData?.translationLanguage === "es" ? "🇪🇸" : "🇬🇧"}
              </span>
              <span className="font-medium text-gray-900">
                {userData?.translationLanguage === "es" ? "Spanish" : "English"}
              </span>
            </div>
            <Select
              value={userData?.translationLanguage || "en"}
              onValueChange={onTranslationLanguageUpdate}
            >
              <SelectTrigger className="w-32 border-none bg-transparent">
                <Search className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>

      {/* Target Language */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Choose target language
        </h3>
        <Card
          className="p-4 cursor-pointer hover:border-gray-300 transition-colors border border-gray-200"
          onClick={onTargetLanguageClick}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {learningLanguage ? (
                <>
                  <span className="text-2xl">{learningLanguage.flag}</span>
                  <span className="font-medium text-gray-900">
                    {learningLanguage.name}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl">🌍</span>
                  <span className="font-medium text-gray-900">
                    No language selected
                  </span>
                </>
              )}
            </div>
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
