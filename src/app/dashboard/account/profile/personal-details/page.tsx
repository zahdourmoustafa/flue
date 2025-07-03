"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Languages, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ALL_LANGUAGES } from "@/types/onboarding";
import { LanguageSelector } from "@/components/account/language-selector";
import { useToast } from "@/hooks/use-toast";
import ReactCountryFlag from "react-country-flag";

export default function PersonalDetailsPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getCurrentLanguageName = () => {
    if (!user?.learningLanguage) return "Not set";
    const language = ALL_LANGUAGES.find(
      (lang) => lang.code === user.learningLanguage
    );
    return language?.name || "Unknown";
  };

  const getCurrentLanguageFlag = () => {
    if (!user?.learningLanguage) return "GB";
    const language = ALL_LANGUAGES.find(
      (lang) => lang.code === user.learningLanguage
    );
    return language?.countryCode || "GB";
  };

  const handleLanguageSelect = async (languageCode: string) => {
    if (!user?.id) return;

    setIsUpdating(true);
    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          learningLanguage: languageCode,
        }),
      });

      if (response.ok) {
        updateUser({ learningLanguage: languageCode });
        setIsLanguageSelectorOpen(false);
        const languageName =
          ALL_LANGUAGES.find((l) => l.code === languageCode)?.name ||
          languageCode;
        toast({
          title: "Target language updated",
          description: `Your target language has been changed to ${languageName}.`,
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
      setIsUpdating(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-6 min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/account/profile")}
            className="p-2"
            aria-label="Go back to profile"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Personal details</h1>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <CardTitle>Basic Information</CardTitle>
              </div>
              <CardDescription>
                Your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={user?.name || ""}
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-blue-600" />
                <CardTitle>Learning Preferences</CardTitle>
              </div>
              <CardDescription>
                Manage your target language and learning settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Target Language</Label>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsLanguageSelectorOpen(true)}
                    disabled={isUpdating}
                    className="w-full justify-start"
                  >
                    <div className="flex items-center gap-3">
                      <ReactCountryFlag
                        countryCode={getCurrentLanguageFlag()}
                        svg
                        style={{
                          width: "1.5em",
                          height: "1.125em",
                        }}
                      />
                      <span>{getCurrentLanguageName()}</span>
                    </div>
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  The language you selected during onboarding
                </p>
              </div>

              {user?.languageLevel && (
                <div>
                  <Label>Language Level</Label>
                  <Input
                    value={
                      user.languageLevel.charAt(0).toUpperCase() +
                      user.languageLevel.slice(1)
                    }
                    disabled
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <CardTitle>Account Settings</CardTitle>
              </div>
              <CardDescription>
                Account creation and verification status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Account Status</Label>
                <Input
                  value={
                    user?.emailVerified ? "Verified" : "Pending verification"
                  }
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Member Since</Label>
                <Input
                  value={
                    user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"
                  }
                  disabled
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Language Selector Modal */}
        <LanguageSelector
          isOpen={isLanguageSelectorOpen}
          onClose={() => setIsLanguageSelectorOpen(false)}
          currentLanguage={user?.learningLanguage}
          onLanguageSelect={handleLanguageSelect}
          isLoading={isUpdating}
        />
      </div>
    </AppLayout>
  );
}
