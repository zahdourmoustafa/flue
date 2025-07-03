"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DialogueScenarioCard } from "./dialogue-scenario-card";
import { dialogueScenarios } from "@/lib/dialogue-config";
import { SubscriptionGuard } from "../subscription/subscription-guard";

export const DialogueScenariosContent = () => {
  const beginnerScenarios = dialogueScenarios.filter(
    (s) => s.difficulty === "Beginner"
  );
  const intermediateScenarios = dialogueScenarios.filter(
    (s) => s.difficulty === "Intermediate"
  );
  const advancedScenarios = dialogueScenarios.filter(
    (s) => s.difficulty === "Advanced"
  );

  return (
    <SubscriptionGuard featureName="Dialogue Scenarios">
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Dialogue Practice
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Scenarios
              </span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl">
              Master real-world conversations through interactive dialogue
              scenarios. Practice specific situations from ordering coffee to
              business negotiations with AI role-playing partners.
            </p>
          </div>
        </div>

        {/* Beginner Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                Beginner Level
              </h2>
            <span className="text-sm text-gray-500 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              {beginnerScenarios.length} scenarios
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {beginnerScenarios.map((scenario) => (
              <DialogueScenarioCard key={scenario.id} {...scenario} />
            ))}
          </div>
        </div>

        {/* Intermediate Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              Intermediate Level
            </h2>
            <span className="text-sm text-gray-500 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
              {intermediateScenarios.length} scenarios
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {intermediateScenarios.map((scenario) => (
              <DialogueScenarioCard key={scenario.id} {...scenario} />
            ))}
          </div>
        </div>

        {/* Advanced Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                Advanced Level
              </h2>
            <span className="text-sm text-gray-500 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              {advancedScenarios.length} scenarios
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {advancedScenarios.map((scenario) => (
              <DialogueScenarioCard key={scenario.id} {...scenario} />
            ))}
          </div>
        </div>

        {/* Bottom Info Section */}
        <div className="mt-16 p-8 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-3xl border border-blue-100/50">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              💬 How Dialogue Practice Works
            </h3>
            <p className="text-gray-600 text-lg mb-6 max-w-3xl mx-auto">
                Each scenario places you in a specific real-world situation
                where you'll chat with an AI that plays a role (waiter, taxi
                driver, hotel receptionist, etc.). Practice natural
                conversations and get instant feedback on your language use.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎭</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Role Playing
                </h4>
                <p className="text-gray-600 text-sm">
                  AI adapts to specific scenarios and plays authentic roles
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✏️</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Real-time Correction
                </h4>
                <p className="text-gray-600 text-sm">
                  Get instant feedback on grammar, vocabulary, and style
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📈</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Progressive Learning
                </h4>
                <p className="text-gray-600 text-sm">
                  Start with basics and advance to complex conversations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </SubscriptionGuard>
  );
};
