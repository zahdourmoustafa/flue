"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CallInterface } from "@/components/call-mode/CallInterface";
import { useAuth } from "@/contexts/auth-context";

const CallModePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    setIsAuthorized(true);
  }, [user, router]);

  if (!isAuthorized || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CallInterface user={user} />
    </div>
  );
};

export default CallModePage;
