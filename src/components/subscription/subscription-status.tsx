"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

export const SubscriptionStatus: React.FC = () => {
  // Always show that all features are free and accessible
  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-semibold text-green-900">
                All Features Free
              </div>
              <div className="text-sm text-green-700">
                Enjoy unlimited access to everything
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Free Access
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
