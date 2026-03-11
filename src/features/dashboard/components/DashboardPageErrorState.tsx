"use client";

import { PageFeedback } from "@/components/ui/page-feedback";

export function DashboardPageErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <PageFeedback
      title="Could not load dashboard"
      message={message}
      tone="error"
      actions={[{ label: "Retry", onClick: onRetry }]}
    />
  );
}
