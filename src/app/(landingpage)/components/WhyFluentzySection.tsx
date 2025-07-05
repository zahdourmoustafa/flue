"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const fontFamily =
  "Inter,Twemoji Country Flags,ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji";

export const WhyFluentzySection = () => {
  const router = useRouter();

  const handleSignUpClick = () => {
    router.push("/sign-up");
  };

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Why Fluentzy Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
              style={{ fontFamily }}
            >
              01 Why Fluentzy?
            </div>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🎯</span>
            <span className="text-blue-500 font-medium" style={{ fontFamily }}>
              Perfect pronunciation!
            </span>
          </div>
        </motion.div>

        {/* Learn from speaking section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            style={{ fontFamily }}
          >
            Learn from speaking, like a child would.
          </h2>
          <p className="text-xl text-gray-600 mb-4" style={{ fontFamily }}>
            Use the most natural way to learn: your voice.
          </p>
          <p className="text-gray-600 leading-relaxed" style={{ fontFamily }}>
            If you learn from text, your accent will be hard to understand 😕
            But if you learn from speaking, your pronunciation will be like that
            of a native speaker. Don't make the same mistake I did, speak
            clearly from day 1! 💪
          </p>
        </motion.div>

        {/* Practice anytime section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">⏰</span>
            <span className="text-blue-500 font-medium" style={{ fontFamily }}>
              Save time
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            style={{ fontFamily }}
          >
            Practice anytime, anywhere
          </h2>
          <p className="text-xl text-gray-600 mb-4" style={{ fontFamily }}>
            No need to schedule a class – Fluentzy is always here for you!
          </p>
          <p className="text-gray-600 leading-relaxed" style={{ fontFamily }}>
            If you want to become fluent, it's simple: you just need to practice
            a little every day. But you're busy and don't have time to schedule
            a class. So Fluentzy is always here for you when you need it 📱 in
            your pocket or 💻 on your computer.
          </p>
        </motion.div>

        {/* Video meetings section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🎥</span>
            <span className="text-blue-500 font-medium" style={{ fontFamily }}>
              Video meetings
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            style={{ fontFamily }}
          >
            Practice with real conversations
          </h2>
          <p className="text-xl text-gray-600 mb-4" style={{ fontFamily }}>
            Join live video sessions with native speakers and AI tutors.
          </p>
          <p className="text-gray-600 leading-relaxed" style={{ fontFamily }}>
            Get real-time feedback on your pronunciation and conversation skills
            through our interactive video meetings. Practice dialogue mode,
            sentence mode, call mode, and chat mode to master every aspect of
            communication.
          </p>
        </motion.div>

        {/* Cheaper section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">💰</span>
            <span className="text-blue-500 font-medium" style={{ fontFamily }}>
              Save money
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            style={{ fontFamily }}
          >
            12x cheaper than a traditional teacher
          </h2>
          <p className="text-xl text-gray-600 mb-4" style={{ fontFamily }}>
            Practice more for less, learn faster!
          </p>
          <p className="text-gray-600 leading-relaxed" style={{ fontFamily }}>
            Language classes are great, but learning one-on-one with a private
            teacher costs as small fortune 💸. For the price of a single class,
            you can get a whole month of Fluentzy! And you can use all that
            money you saved to travel to the country whose language you're
            learning... ✈️
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-left"
        >
          <button
            onClick={handleSignUpClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 inline-flex items-center gap-2"
            style={{ fontFamily }}
          >
            Learn from speaking, with a teacher in your pocket. Start now →
          </button>
        </motion.div>
      </div>
    </section>
  );
};
