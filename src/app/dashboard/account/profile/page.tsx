"use client";

import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { ProfileSettings } from "@/components/account/profile-settings";

export default function ProfilePage() {
  return (
    <AppLayout>
      <ProfileSettings />
    </AppLayout>
  );
}
