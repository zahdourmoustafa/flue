"use client";

import { Button } from "@/components/ui/button";
import { User, Settings, Sliders, CreditCard, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface AccountMenuProps {
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onLogout: () => void;
}

export const AccountMenu = ({
  onProfileClick,
  onSettingsClick,
  onLogout,
}: AccountMenuProps) => {
  const router = useRouter();

  const accountSettings = [
    {
      icon: User,
      title: "Profile",
      description: "Manage your profile details.",
      action: onProfileClick,
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Manage your account settings.",
      action: onSettingsClick,
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Account settings</h2>
      <div className="space-y-1">
        {accountSettings.map((item) => (
          <Button
            key={item.title}
            variant="ghost"
            className="w-full justify-start p-4 h-auto"
            onClick={() =>
              item.action ? item.action() : router.push(item.href!)
            }
          >
            <div className="flex items-center gap-4 w-full">
              <item.icon className="h-5 w-5 text-gray-600" />
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-500">{item.description}</div>
              </div>
            </div>
          </Button>
        ))}

        {/* Log out */}
        <Button
          variant="ghost"
          className="w-full justify-start p-4 h-auto text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <div className="flex items-center gap-4 w-full">
            <LogOut className="h-5 w-5" />
            <div className="flex-1 text-left">
              <div className="font-medium">Log out</div>
              <div className="text-sm text-red-500">
                Log out from this profile.
              </div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};
