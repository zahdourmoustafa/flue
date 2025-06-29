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
            &copy; 2025 Fluentzy. All rights reserved. | Privacy Policy | Terms
            of Service | Cookie Policy
          </p>
        </div>
      </div>
    </footer>
  );
};
