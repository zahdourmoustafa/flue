"use client";

import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PersonalDetailsPage() {
  const router = useRouter();

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-6 min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/account/profile")}
            className="p-2"
            aria-label="Go back to profile"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Personal details</h1>
        </div>

        {/* Placeholder Content */}
        <div className="text-center py-12">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Coming Soon
          </h2>
          <p className="text-gray-600">
            Personal details management will be available in a future update.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
