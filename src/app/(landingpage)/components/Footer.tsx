"use client";

import React from "react";
import { Zap } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Fluentzy</span>
          </div>

          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2025 Fluentzy. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
