"use client";

import { PageFeedback } from "@/components/ui/page-feedback";

export function MemorizeSessionErrorState({
  message,
  onRetry,
  onBack,
}: {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <PageFeedback
      title="Could not load memorization session"
      message={message}
      tone="error"
      actions={[
        { label: "Retry", onClick: onRetry },
        { label: "Back", onClick: onBack, variant: "secondary" },
      ]}
    />
  );
}
