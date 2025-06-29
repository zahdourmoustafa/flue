"use client";

import { motion } from "framer-motion";
import ReactCountryFlag from "react-country-flag";
import { useRouter } from "next/navigation";

export const LanguageSelection = () => {
  const router = useRouter();

  const handleLanguageSelect = (language: {
    name: string;
    countryCode: string;
    learners: string;
  }) => {
    // Redirect to sign-up page with selected language as query parameter
    router.push(
      `/sign-up?language=${encodeURIComponent(language.name)}&country=${
        language.countryCode
      }`
    );
  };

  const languages = [
    { name: "English", countryCode: "US", learners: "2.5M+" },
    { name: "Spanish", countryCode: "ES", learners: "1.8M+" },
    { name: "French", countryCode: "FR", learners: "1.2M+" },
    { name: "German", countryCode: "DE", learners: "980K+" },
    { name: "Italian", countryCode: "IT", learners: "750K+" },
    { name: "Portuguese", countryCode: "PT", learners: "650K+" },
    { name: "Japanese", countryCode: "JP", learners: "1.1M+" },
    { name: "Korean", countryCode: "KR", learners: "890K+" },
    { name: "Arabic", countryCode: "SA", learners: "420K+" },
    { name: "Russian", countryCode: "RU", learners: "380K+" },
    { name: "Dutch", countryCode: "NL", learners: "290K+" },
    { name: "Polish", countryCode: "PL", learners: "240K+" },
    { name: "Turkish", countryCode: "TR", learners: "320K+" },
    { name: "Chinese", countryCode: "CN", learners: "1.5M+" },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            I want to learn...
          </h2>
          <p className="text-lg text-gray-600">
            Choose from our most popular languages
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 max-w-6xl mx-auto">
          {languages.map((language, index) => (
            <motion.div
              key={language.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLanguageSelect(language)}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 group hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="mb-3 flex justify-center">
                <ReactCountryFlag
                  countryCode={language.countryCode}
                  svg
                  style={{
                    width: "3rem",
                    height: "2.25rem",
                    borderRadius: "0.5rem",
                    objectFit: "cover",
                  }}
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {language.name}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {language.learners}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Can't find your language? We offer 50+ languages in total.
          </p>
          <button
            onClick={() => router.push("/sign-up")}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            View all languages →
          </button>
        </motion.div>
      </div>
    </section>
  );
};
