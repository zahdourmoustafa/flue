"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Lock, Mail, Bell, Trash2 } from "lucide-react";

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onPersonalDetailsClick: () => void;
}

export const ProfilePanel = ({
  isOpen,
  onClose,
  onPersonalDetailsClick,
}: ProfilePanelProps) => {
  const profileOptions = [
    {
      icon: User,
      title: "Personal details",
      description: "Manage your personal details below.",
      action: onPersonalDetailsClick,
    },
    {
      icon: Lock,
      title: "Change password",
      description: "Change your current password.",
      action: () => console.log("Change password"),
    },
    {
      icon: Mail,
      title: "Email notifications",
      description: "Manage your email notifications.",
      action: () => console.log("Email notifications"),
    },
    {
      icon: Bell,
      title: "App notifications",
      description: "Manage your app notifications.",
      action: () => console.log("App notifications"),
    },
    {
      icon: Trash2,
      title: "Delete account",
      description: "This action can not be undone.",
      action: () => console.log("Delete account"),
      isDangerous: true,
    },
  ];

  return (
    <div
      className={`fixed top-0 right-0 h-full w-1/2 bg-white border-l border-gray-200 p-6 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-2"
          aria-label="Go back to account"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      </div>

      {/* Profile Options */}
      <div className="space-y-1">
        {profileOptions.map((option) => (
          <Button
            key={option.title}
            variant="ghost"
            className={`w-full justify-start p-4 h-auto ${
              option.isDangerous
                ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                : ""
            }`}
            onClick={option.action}
          >
            <div className="flex items-center gap-4 w-full">
              <option.icon
                className={`h-5 w-5 ${
                  option.isDangerous ? "text-red-600" : "text-gray-600"
                }`}
              />
              <div className="flex-1 text-left">
                <div className="font-medium">{option.title}</div>
                <div
                  className={`text-sm ${
                    option.isDangerous ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {option.description}
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
