"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  preferredLanguage?: string;
  translationLanguage?: string;
  learningLanguage?: string;
  languageLevel?: string;
  image?: string;
}

interface PersonalDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData | null;
}

export const PersonalDetailsPanel = ({
  isOpen,
  onClose,
  userData,
}: PersonalDetailsPanelProps) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-1/2 bg-white border-l border-gray-200 p-6 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ zIndex: 60 }}
    >
      {/* Personal Details Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-2"
          aria-label="Go back to profile"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Personal details</h1>
      </div>

      {/* User Information */}
      <div className="space-y-6">
        {/* Username Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <div className="p-4 bg-gray-50 rounded-md border">
            <span className="text-gray-900 font-medium">
              {userData?.name || "Not set"}
            </span>
          </div>
        </div>

        {/* Email Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="p-4 bg-gray-50 rounded-md border">
            <span className="text-gray-900 font-medium">
              {userData?.email || "Not set"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
