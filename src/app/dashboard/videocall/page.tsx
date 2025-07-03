"use client";

import React from "react";
import { VideoCallScenariosContent } from "@/components/videocall/videocall-scenarios-content";
import { SubscriptionGuard } from "@/components/subscription/subscription-guard";

export default function VideoCallPage() {
  return (
    <SubscriptionGuard featureName="Video Call">
      <VideoCallScenariosContent />
    </SubscriptionGuard>
  );
}
