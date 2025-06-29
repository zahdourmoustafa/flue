"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-white/5 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>

      {/* Badge in top-right corner of red zone */}
      <div className="absolute top-8 right-8 z-20">
        <Image
          src="/badge.png"
          alt="Badge"
          width={100}
          height={100}

        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Learn <br />
                <span className="relative">
                  languages
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3"
                    viewBox="0 0 300 12"
                    fill="none"
                  >
                    <path
                      d="M2 6C50 2 100 10 150 6C200 2 250 10 298 6"
                      stroke="#FFF"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                  </svg>
                </span>
                <br />
                for real life
              </h1>

              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                Master practical conversation skills with AI-powered lessons
                that adapt to your learning style and pace.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 rounded-full px-8 py-4 text-lg font-semibold"
                  onClick={() => router.push("/sign-up")}
                >
                  Start for free
                </Button>
              </div>

              <div className="flex items-center gap-2 text-blue-100">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span>Trusted by 5M+ learners worldwide</span>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Phone mockup image */}
              <div className="relative w-80 h-96 mx-auto">
                <Image
                  src="/img.webp"
                  alt="Fluentzy app interface showing chat conversation"
                  width={320}
                  height={384}
                  className="w-full h-full object-contain drop-shadow-2xl"
                  priority
                />

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-3 py-2 rounded-full text-sm font-semibold shadow-lg"
                >
                  🎯 95% Success Rate
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-green-400 text-gray-900 px-3 py-2 rounded-full text-sm font-semibold shadow-lg"
                >
                  🚀 Learn 3x Faster
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
