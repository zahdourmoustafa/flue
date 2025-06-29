"use client";

import { Zap, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  const footerSections = [
    {
      title: "Learn languages online",
      links: [
        "Learn English online",
        "Learn Spanish online",
        "Learn French online",
        "Learn Italian online",
        "Learn German online",
        "Learn Portuguese online",
        "Learn Russian online",
        "Learn Polish online",
        "Learn Turkish online",
        "Learn Arabic online",
        "Learn Japanese online",
        "Learn Chinese online",
      ],
    },
    {
      title: "Fluentzy Business",
      links: [
        "Team training",
        "Enterprise solutions",
        "Custom content",
        "Analytics dashboard",
        "API access",
      ],
    },
    {
      title: "About us",
      links: ["Mission", "Team", "Press", "Careers", "Affiliate program"],
    },
    {
      title: "Download",
      links: ["iOS app", "Android app", "Huawei app"],
    },
    {
      title: "Download support",
      links: ["Help Center", "Community forum", "Contact us", "System status"],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-lg text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App store buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 pb-8 border-b border-gray-700">
          <Link
            href="#"
            className="flex items-center gap-3 bg-black hover:bg-gray-800 transition-colors rounded-lg px-4 py-3 max-w-fit"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="text-left">
              <div className="text-xs text-gray-400">Download on the</div>
              <div className="font-semibold">App Store</div>
            </div>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 bg-black hover:bg-gray-800 transition-colors rounded-lg px-4 py-3 max-w-fit"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <div className="text-left">
              <div className="text-xs text-gray-400">Get it on</div>
              <div className="font-semibold">Google Play</div>
            </div>
          </Link>
        </div>

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Fluentzy</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Facebook className="w-6 h-6" />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="w-6 h-6" />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram className="w-6 h-6" />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Youtube className="w-6 h-6" />
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>
            &copy; 2024 Fluentzy. All rights reserved. | Privacy Policy | Terms
            of Service | Cookie Policy
          </p>
        </div>
      </div>
    </footer>
  );
};
