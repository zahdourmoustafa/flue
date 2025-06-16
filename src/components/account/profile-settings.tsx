"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Lock, Mail, Bell, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

export const ProfileSettings = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user: userData, loading } = useAuth();

  const handleDeleteAccount = () => {
    // TODO: Implement delete account functionality
    toast({
      title: "Feature coming soon",
      description: "Account deletion will be available in a future update.",
    });
  };

  const profileOptions = [
    {
      icon: User,
      title: "Personal details",
      description: "Manage your personal details below.",
      href: "/dashboard/account/profile/personal-details",
      onClick: () => router.push("/dashboard/account/profile/personal-details"),
    },
    {
      icon: Lock,
      title: "Change password",
      description: "Change your current password.",
      href: "/dashboard/account/profile/change-password",
      onClick: () => router.push("/dashboard/account/profile/change-password"),
    },
    {
      icon: Mail,
      title: "Email notifications",
      description: "Manage your email notifications.",
      href: "/dashboard/account/profile/email-notifications",
      onClick: () =>
        router.push("/dashboard/account/profile/email-notifications"),
    },
    {
      icon: Bell,
      title: "App notifications",
      description: "Manage your app notifications.",
      href: "/dashboard/account/profile/app-notifications",
      onClick: () =>
        router.push("/dashboard/account/profile/app-notifications"),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/account")}
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
            className="w-full justify-start p-4 h-auto"
            onClick={option.onClick}
          >
            <div className="flex items-center gap-4 w-full">
              <option.icon className="h-5 w-5 text-gray-600" />
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{option.title}</div>
                <div className="text-sm text-gray-500">
                  {option.description}
                </div>
              </div>
            </div>
          </Button>
        ))}

        {/* Delete Account */}
        <Button
          variant="ghost"
          className="w-full justify-start p-4 h-auto text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleDeleteAccount}
        >
          <div className="flex items-center gap-4 w-full">
            <Trash2 className="h-5 w-5" />
            <div className="flex-1 text-left">
              <div className="font-medium">Delete account</div>
              <div className="text-sm text-red-500">
                This action can not be undone.
              </div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};
