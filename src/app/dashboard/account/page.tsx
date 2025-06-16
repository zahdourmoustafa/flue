"use client";

import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { AccountSettings } from "@/components/account/account-settings";

export default function AccountPage() {
  return (
    <AppLayout>
      <AccountSettings />
    </AppLayout>
  );
}
