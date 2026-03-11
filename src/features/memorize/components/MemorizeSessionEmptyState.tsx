"use client";

import { PageFeedback } from "@/components/ui/page-feedback";

export function MemorizeSessionEmptyState({
  title,
  message,
  actionLabel,
  tone = "neutral",
  onAction,
}: {
  title: string;
  message: string;
  actionLabel: string;
  tone?: "neutral" | "success";
  onAction: () => void;
}) {
  return (
    <PageFeedback
      title={title}
      message={message}
      tone={tone}
      actions={[{ label: actionLabel, onClick: onAction }]}
    />
  );
}
