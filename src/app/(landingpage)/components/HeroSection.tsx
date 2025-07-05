"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";

export const HeroSection = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLanguageSelect = (language: string) => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/sign-up");
    }
  };

  const languages = [
    { code: "mx", name: "Spanish (Mexico)", flag: "🇲🇽" },
    { code: "es", name: "Spanish (Spain)", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "more", name: "More", flag: "🌐" },
  ];

  return (
    <section className="min-h-screen bg-[#F9F6F1] overflow-hidden">
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Column - Language Selection */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1
                className="text-4xl lg:text-5xl leading-tight mb-12 tracking-tight"
                style={{
                  fontFamily: "Feature Text LC, serif",
                  fontWeight: 400,
                  color: "rgb(21, 21, 21)",
                  letterSpacing: "-0.02em",
                  fontSize: "3rem",
                  lineHeight: "3.5rem",
                }}
              >
                The Most{" "}
                <span
                  className="italic"
                  style={{
                    background: "linear-gradient(to right, #a855f7, #3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Efficient
                </span>{" "}
                Way
                <br />
                to Learn a{" "}
                <span
                  className="italic"
                  style={{
                    background: "linear-gradient(to right, #a855f7, #3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Language
                </span>
              </h1>

              {/* Language Selection Grid */}
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {languages.map((language, index) => (
                  <motion.button
                    key={language.code}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onClick={() => handleLanguageSelect(language.code)}
                    className="bg-white rounded-xl p-4 shadow-sm border border-[#EAEAEA] hover:shadow-md transition-all duration-300 flex items-center gap-3 text-left group"
                  >
                    <span className="text-2xl">{language.flag}</span>
                    <span className="text-[#2D2D2D] font-medium text-sm">
                      {language.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Image */}
          <div className="relative h-[600px] lg:h-[700px] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <Image
                src="/img.webp"
                alt="Fluentzy app interface"
                width={400}
                height={500}
                className="w-full h-auto object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
