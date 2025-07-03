"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { ALL_LANGUAGES } from "@/types/onboarding";
import ReactCountryFlag from "react-country-flag";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  const { user: userData, updateUser } = useAuth();
  const { toast } = useToast();

  const handleLanguageUpdate = async (
    type: "learningLanguage" | "translationLanguage",
    languageCode: string
  ) => {
    if (!userData?.id) return;

    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.id,
          [type]: languageCode,
        }),
      });

      if (response.ok) {
        updateUser({ [type]: languageCode });
        const languageName =
          ALL_LANGUAGES.find((l) => l.code === languageCode)?.name ||
          languageCode;
        toast({
          title: `${
            type === "learningLanguage" ? "Target" : "Translation"
          } language updated`,
          description: `Language changed to ${languageName}.`,
        });
      } else {
        throw new Error(`Failed to update ${type}`);
      }
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to update your ${type}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const getLanguageFlag = (langCode: string | undefined) => {
    if (!langCode) return "GB";
    const lang = ALL_LANGUAGES.find((l) => l.code === langCode);
    return lang?.countryCode || "GB";
  };

  const getLanguageName = (langCode: string | undefined) => {
    if (!langCode) return "Select a language";
    const lang = ALL_LANGUAGES.find((l) => l.code === langCode);
    return lang?.name || "Select a language";
  };

  return (
    <div className="h-full w-full p-6">
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
          onValueChange={(value) =>
            handleLanguageUpdate("translationLanguage", value)
          }
        >
          <SelectTrigger className="w-full p-4 h-auto border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <ReactCountryFlag
                  countryCode={getLanguageFlag(userData?.translationLanguage)}
                  svg
                  style={{
                    width: "2em",
                    height: "1.5em",
                  }}
                  title={getLanguageName(userData?.translationLanguage)}
                />
                <span className="text-sm font-medium">
                  {getLanguageName(userData?.translationLanguage)}
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
          onValueChange={(value) =>
            handleLanguageUpdate("learningLanguage", value)
          }
        >
          <SelectTrigger className="w-full p-4 h-auto border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <ReactCountryFlag
                  countryCode={getLanguageFlag(userData?.learningLanguage)}
                  svg
                  style={{
                    width: "2em",
                    height: "1.5em",
                  }}
                  title={getLanguageName(userData?.learningLanguage)}
                />
                <span className="text-sm font-medium">
                  {getLanguageName(userData?.learningLanguage)}
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
