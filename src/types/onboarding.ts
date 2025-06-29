export type Language = {
  code: string;
  name: string;
  flag: string;
  countryCode?: string;
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
  { code: "en", name: "English", flag: "🇬🇧", countryCode: "GB" },
  { code: "es", name: "Spanish", flag: "🇪🇸", countryCode: "ES" },
];

// Full language list for future expansion
export const ALL_LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇬🇧", countryCode: "GB" },
  { code: "es", name: "Spanish", flag: "🇪🇸", countryCode: "ES" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", countryCode: "JP" },
  { code: "fr", name: "French", flag: "🇫🇷", countryCode: "FR" },
  { code: "de", name: "German", flag: "🇩🇪", countryCode: "DE" },
  { code: "ko", name: "Korean", flag: "🇰🇷", countryCode: "KR" },
  { code: "it", name: "Italian", flag: "🇮🇹", countryCode: "IT" },
  { code: "ar", name: "Arabic", flag: "🇦🇪", countryCode: "AE" },
  { code: "ru", name: "Russian", flag: "🇷🇺", countryCode: "RU" },
  { code: "zh", name: "Chinese", flag: "🇨🇳", countryCode: "CN" },
  { code: "tr", name: "Turkish", flag: "🇹🇷", countryCode: "TR" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹", countryCode: "PT" },
  { code: "nl", name: "Dutch", flag: "🇳🇱", countryCode: "NL" },
  { code: "pl", name: "Polish", flag: "🇵🇱", countryCode: "PL" },
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
