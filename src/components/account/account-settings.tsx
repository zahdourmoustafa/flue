"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ALL_LANGUAGES } from "@/types/onboarding";
import { LanguageSelector } from "./language-selector";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

// Import the new components
import { ProfilePanel } from "./profile-panel";
import { SettingsPanel } from "./settings-panel";
import { PersonalDetailsPanel } from "./personal-details-panel";
import { TargetLanguageCard } from "./target-language-card";
import { AccountMenu } from "./account-menu";

export const AccountSettings = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user: userData, loading, updateUser } = useAuth();

  // Panel state management
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [isUpdatingLanguage, setIsUpdatingLanguage] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPersonalDetailsOpen, setIsPersonalDetailsOpen] = useState(false);

  // Event handlers
  const handleLogout = async () => {
    try {
      // Clear auth client session
      await authClient.signOut();

      // Clear localStorage cache
      if (typeof window !== "undefined") {
        localStorage.removeItem("fluentzy_user_session");
        localStorage.removeItem("fluentzy_user_stats");
        sessionStorage.clear();

        // Clear any auth cookies
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
          if (name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          }
        });
      }

      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLanguageSelect = async (languageCode: string) => {
    if (!userData?.id) return;

    setIsUpdatingLanguage(true);
    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.id,
          learningLanguage: languageCode,
          languageLevel: userData.languageLevel,
        }),
      });

      if (response.ok) {
        updateUser({ learningLanguage: languageCode });
        setIsLanguageSelectorOpen(false);
        toast({
          title: "Language updated",
          description: `Your target language has been changed to ${
            ALL_LANGUAGES.find((l) => l.code === languageCode)?.name ||
            languageCode
          }.`,
        });
      } else {
        throw new Error("Failed to update language");
      }
    } catch (error) {
      console.error("Error updating language:", error);
      toast({
        title: "Error",
        description: "Failed to update your target language. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingLanguage(false);
    }
  };

  const handleInterfaceLanguageUpdate = async (languageCode: string) => {
    if (!userData?.id) return;

    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.id,
          preferredLanguage: languageCode,
        }),
      });

      if (response.ok) {
        updateUser({ preferredLanguage: languageCode });
        toast({
          title: "Interface language updated",
          description: `Interface language changed to ${
            languageCode === "en" ? "English" : "Spanish"
          }.`,
        });
      }
    } catch (error) {
      console.error("Error updating interface language:", error);
      toast({
        title: "Error",
        description: "Failed to update interface language.",
        variant: "destructive",
      });
    }
  };

  const handleTranslationLanguageUpdate = async (languageCode: string) => {
    if (!userData?.id) return;

    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.id,
          translationLanguage: languageCode,
        }),
      });

      if (response.ok) {
        updateUser({ translationLanguage: languageCode });
        toast({
          title: "Translation language updated",
          description: `Translation language changed to ${
            languageCode === "en" ? "English" : "Spanish"
          }.`,
        });
      }
    } catch (error) {
      console.error("Error updating translation language:", error);
      toast({
        title: "Error",
        description: "Failed to update translation language.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white relative">
      {/* Main Account Settings */}
      <div
        className={`p-6 transition-all duration-300 ease-in-out ${
          isProfileOpen || isSettingsOpen ? "w-1/2" : "w-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Account</h1>
        </div>

        {/* Target Language Card */}
        <TargetLanguageCard
          userData={userData}
          onTargetLanguageUpdate={handleLanguageSelect}
        />

        {/* Account Menu */}
        <AccountMenu
          onProfileClick={() => setIsProfileOpen(true)}
          onSettingsClick={() => setIsSettingsOpen(true)}
          onLogout={handleLogout}
        />

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 space-y-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <button className="hover:text-gray-700">Privacy Policy</button>
            <button className="hover:text-gray-700">
              Terms and Conditions
            </button>
            <button className="hover:text-gray-700">
              End User License Agreement
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Customer support:</span>
            <a
              href="mailto:support@fluentzy.ai"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              support@fluentzy.ai
            </a>
          </div>
        </div>
      </div>

      {/* Profile Panel */}
      <ProfilePanel
        isOpen={isProfileOpen && !isPersonalDetailsOpen}
        onClose={() => setIsProfileOpen(false)}
        onPersonalDetailsClick={() => setIsPersonalDetailsOpen(true)}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userData={userData}
        onInterfaceLanguageUpdate={handleInterfaceLanguageUpdate}
        onTranslationLanguageUpdate={handleTranslationLanguageUpdate}
        onTargetLanguageUpdate={handleLanguageSelect}
        onTargetLanguageClick={() => setIsLanguageSelectorOpen(true)}
      />

      {/* Personal Details Panel */}
      <PersonalDetailsPanel
        isOpen={isPersonalDetailsOpen}
        onClose={() => setIsPersonalDetailsOpen(false)}
        userData={userData}
      />

      {/* Language Selector Modal */}
      <LanguageSelector
        isOpen={isLanguageSelectorOpen}
        onClose={() => setIsLanguageSelectorOpen(false)}
        currentLanguage={userData?.learningLanguage}
        onLanguageSelect={handleLanguageSelect}
        isLoading={isUpdatingLanguage}
      />
    </div>
  );
};
