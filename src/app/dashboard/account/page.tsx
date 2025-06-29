"use client";

import React, { useEffect, useState } from "react";
import { AccountSettings } from "@/components/account/account-settings";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionDebugInfo } from "@/lib/auth-client";

export default function AccountPage() {
  const { user, clearSession } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Get debug info on component mount
    const fetchDebugInfo = async () => {
      const info = await getSessionDebugInfo();
      setDebugInfo(info);
    };
    fetchDebugInfo();
  }, []);

  const handleClearSession = async () => {
    if (
      confirm(
        "Are you sure you want to clear your session? You will be logged out."
      )
    ) {
      await clearSession();
      window.location.href = "/";
    }
  };

  return (
    <div className="space-y-6">
      {/* Debug info - remove this after fixing */}
      {process.env.NODE_ENV === "development" && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-orange-700">
              Current User: {user?.email || "None"}
            </p>
            <p className="text-sm text-orange-700">
              User ID: {user?.id || "None"}
            </p>
            <p className="text-sm text-orange-700">
              Auth Base URL: {debugInfo?.baseURL || "Loading..."}
            </p>
            <p className="text-sm text-orange-700">
              Environment:{" "}
              {typeof window !== "undefined"
                ? window.location.hostname === "localhost"
                  ? "Development"
                  : "Production"
                : "Server"}
            </p>
            <Button
              onClick={handleClearSession}
              variant="outline"
              size="sm"
              className="text-orange-700 border-orange-300"
            >
              Clear Session (Debug)
            </Button>
          </CardContent>
        </Card>
      )}

      <AccountSettings />
    </div>
  );
}
