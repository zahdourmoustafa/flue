export type Language = {
  code: string;
  name: string;
  flag: string;
};

export type LanguageLevel = {
  code: string;
  name: string;
  description: string;
  cefr: string;
};

export type OnboardingData = {
  selectedLanguage: Language | null;
  selectedLevel: LanguageLevel | null;
};

// MVP: Only English and Spanish for now
export const LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
];

// Full language list for future expansion
export const ALL_LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇦🇪" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "el", name: "Greek", flag: "🇬🇷" },
  { code: "he", name: "Hebrew", flag: "🇮🇱" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
];

export const LANGUAGE_LEVELS: LanguageLevel[] = [
  {
    code: "A1",
    name: "Absolute beginner",
    description: "I'm just starting to learn this language",
    cefr: "A1",
  },
  {
    code: "A2",
    name: "Beginner",
    description: "I can understand basic phrases and expressions",
    cefr: "A2",
  },
  {
    code: "B1-B2",
    name: "Intermediate",
    description: "I can handle everyday conversations",
    cefr: "B1-B2",
  },
  {
    code: "C1-C2",
    name: "Advanced",
    description: "I'm fluent and can discuss complex topics",
    cefr: "C1-C2",
  },
];
