import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { RouteGuard } from "@/components/layout/route-guard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <RouteGuard requireAuth={true}>
      <AppLayout>{children}</AppLayout>
    </RouteGuard>
  );
}
