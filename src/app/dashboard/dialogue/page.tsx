"use client";

import React from "react";
import { DialogueScenariosContent } from "@/components/dialogue/dialogue-scenarios-content";
import { SubscriptionGuard } from "@/components/subscription/subscription-guard";

export default function DialoguePage() {
  return (
    <SubscriptionGuard featureId="dialogue">
      <DialogueScenariosContent />
    </SubscriptionGuard>
  );
}
