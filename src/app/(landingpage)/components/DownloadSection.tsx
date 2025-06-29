"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Smartphone, Download } from "lucide-react";

export const DownloadSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-center lg:text-left text-white mb-12 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Learn <span className="text-green-400">languages</span>
                <br />
                anytime, anywhere!
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                Download the Fluentzy app now and start your language learning
                journey on the go.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button className="bg-black text-white hover:bg-gray-800 rounded-xl px-6 py-3 flex items-center gap-3">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </Button>

                <Button className="bg-black text-white hover:bg-gray-800 rounded-xl px-6 py-3 flex items-center gap-3">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Mobile app mockup */}
              <div className="relative w-80 h-96 mx-auto">
                <div className="absolute inset-0 bg-white rounded-[2.5rem] p-3 shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-b from-blue-50 to-white rounded-[2rem] overflow-hidden">
                    {/* Status bar */}
                    <div className="flex justify-between items-center p-4 text-xs text-gray-600">
                      <span>9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                        <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                        <div className="w-4 h-2 bg-gray-300 rounded-sm"></div>
                      </div>
                    </div>

                    {/* App content */}
                    <div className="px-4 pb-4">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                          <Smartphone className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          Fluentzy
                        </h3>
                        <p className="text-sm text-gray-600">
                          Learn languages anywhere
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 text-sm">🎯</span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              Daily Goals
                            </div>
                            <div className="text-xs text-gray-500">
                              5 min/day
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 text-sm">🔥</span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              Streak: 7 days
                            </div>
                            <div className="text-xs text-gray-500">
                              Keep it up!
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -left-4 bg-green-400 text-gray-900 px-3 py-2 rounded-full text-sm font-semibold shadow-lg"
                >
                  📱 Mobile Ready
                </motion.div>

                <motion.div
                  animate={{ y: [8, -8, 8] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-4 -right-4 bg-purple-400 text-white px-3 py-2 rounded-full text-sm font-semibold shadow-lg"
                >
                  ⚡ Offline Mode
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
