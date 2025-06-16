"use client";

import { useState } from "react";
import { LanguageSelection } from "./language-selection";
import { LanguageLevelSelection } from "./language-level-selection";
import { ProgressIndicator } from "./progress-indicator";
import { SignUpView } from "../views/sign-up-view";
import { Language, LanguageLevel, OnboardingData } from "@/types/onboarding";

type OnboardingStep = "language" | "level" | "signup";

interface OnboardingProps {
  initialData?: Partial<OnboardingData>;
}

export const Onboarding = ({ initialData }: OnboardingProps) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("language");
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    selectedLanguage: initialData?.selectedLanguage || null,
    selectedLevel: initialData?.selectedLevel || null,
  });

  const totalSteps = 3;
  const getStepNumber = (step: OnboardingStep): number => {
    switch (step) {
      case "language":
        return 1;
      case "level":
        return 2;
      case "signup":
        return 3;
      default:
        return 1;
    }
  };

  const handleLanguageSelect = (language: Language) => {
    setOnboardingData((prev) => ({ ...prev, selectedLanguage: language }));
    setCurrentStep("level");
  };

  const handleLevelSelect = (level: LanguageLevel) => {
    setOnboardingData((prev) => ({ ...prev, selectedLevel: level }));
    setCurrentStep("signup");
  };

  const handleBackToLanguage = () => {
    setCurrentStep("language");
  };

  const handleBackToLevel = () => {
    setCurrentStep("level");
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "language":
        return (
          <LanguageSelection
            onLanguageSelect={handleLanguageSelect}
            selectedLanguage={onboardingData.selectedLanguage}
          />
        );

      case "level":
        if (!onboardingData.selectedLanguage) {
          setCurrentStep("language");
          return null;
        }
        return (
          <LanguageLevelSelection
            selectedLanguage={onboardingData.selectedLanguage}
            onLevelSelect={handleLevelSelect}
            onBack={handleBackToLanguage}
            selectedLevel={onboardingData.selectedLevel}
          />
        );

      case "signup":
        if (!onboardingData.selectedLanguage || !onboardingData.selectedLevel) {
          setCurrentStep("language");
          return null;
        }
        return (
          <SignUpView
            onboardingData={onboardingData}
            onBack={handleBackToLevel}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ProgressIndicator
        currentStep={getStepNumber(currentStep)}
        totalSteps={totalSteps}
      />
      {renderCurrentStep()}
    </div>
  );
};
