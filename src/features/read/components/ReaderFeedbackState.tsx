"use client";

type ReaderFeedbackStateProps = {
  title: string;
  message: string;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
};

export function ReaderFeedbackState({
  title,
  message,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}: ReaderFeedbackStateProps) {
  return (
    <div className="mx-auto max-w-3xl flex-1 p-4 pb-24 pt-6 md:p-8">
      <div className="space-y-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="text-lg font-black">{title}</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="h-10 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            {primaryActionLabel}
          </button>
          {secondaryActionLabel && onSecondaryAction ? (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="h-10 rounded-lg border border-border bg-background px-4 text-sm font-bold hover:bg-muted"
            >
              {secondaryActionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
