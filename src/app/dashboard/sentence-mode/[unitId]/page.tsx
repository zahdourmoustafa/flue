"use client";

import { UnitOverview } from "@/components/sentence-mode";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UnitPageProps {
  params: {
    unitId: string;
  };
}

const UnitPage = ({ params }: UnitPageProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Please sign in to access this unit
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="/dashboard/sentence-mode"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Units
            </Link>
          </Button>
        </div>

        <UnitOverview unitId={params.unitId} userId={user.id} />
      </div>
    </div>
  );
};

export default UnitPage;
