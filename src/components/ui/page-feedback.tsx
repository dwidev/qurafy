"use client";

type PageFeedbackTone = "error" | "neutral" | "success";

type PageFeedbackAction = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
};

type PageFeedbackProps = {
  title: string;
  message: string;
  tone?: PageFeedbackTone;
  actions?: PageFeedbackAction[];
  className?: string;
};

const toneClassNames: Record<PageFeedbackTone, string> = {
  error: "border-destructive/30 bg-destructive/5",
  neutral: "border-border bg-card",
  success: "border-emerald-200 bg-emerald-50",
};

const messageToneClassNames: Record<PageFeedbackTone, string> = {
  error: "text-muted-foreground",
  neutral: "text-muted-foreground",
  success: "text-emerald-700/80",
};

const titleToneClassNames: Record<PageFeedbackTone, string> = {
  error: "text-foreground",
  neutral: "text-foreground",
  success: "text-emerald-800",
};

export function PageFeedback({
  title,
  message,
  tone = "neutral",
  actions = [],
  className,
}: PageFeedbackProps) {
  return (
    <div className={`mx-auto max-w-3xl flex-1 p-4 pb-24 pt-6 md:p-8 ${className ?? ""}`.trim()}>
      <div className={`space-y-4 rounded-2xl border p-6 ${toneClassNames[tone]}`}>
        <h2 className={`text-lg font-black ${titleToneClassNames[tone]}`}>{title}</h2>
        <p className={`text-sm ${messageToneClassNames[tone]}`}>{message}</p>

        {actions.length ? (
          <div className="flex flex-wrap items-center gap-3">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className={
                  action.variant === "secondary"
                    ? "h-10 rounded-lg border border-border bg-background px-4 text-sm font-bold hover:bg-muted"
                    : tone === "success"
                      ? "h-10 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-700"
                      : "h-10 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                }
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
