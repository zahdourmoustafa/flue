"use client";

import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { WhyFluentzySection } from "./WhyFluentzySection";
import { LanguageSelection } from "./LanguageSelection";
import { TestimonialsSection } from "./TestimonialsSection";
import { Footer } from "./Footer";

export const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <WhyFluentzySection />
      <LanguageSelection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};
