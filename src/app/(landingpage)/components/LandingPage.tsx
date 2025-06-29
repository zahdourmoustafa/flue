"use client";

import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { LanguageSelection } from "./LanguageSelection";
import { FeaturesSection } from "./FeaturesSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { DownloadSection } from "./DownloadSection";
import { Footer } from "./Footer";

export const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <LanguageSelection />
      <FeaturesSection />
      <TestimonialsSection />
      <DownloadSection />
      <Footer />
    </div>
  );
};
