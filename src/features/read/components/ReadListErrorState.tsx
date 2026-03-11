"use client";

import { PageFeedback } from "@/components/ui/page-feedback";

export function ReadListErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <PageFeedback
      title="Could not load Quran list"
      message={message}
      tone="error"
      actions={[{ label: "Retry", onClick: onRetry }]}
    />
  );
}
