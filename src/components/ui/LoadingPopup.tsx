"use client";

type LoadingPopupProps = {
  show: boolean;
  message?: string;
};

export function LoadingPopup({
  show,
  message = "Processing...",
}: LoadingPopupProps) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/35 backdrop-blur-[2px]"
      aria-live="polite"
      role="status"
    >
      <div className="min-w-[180px] rounded-2xl border border-border bg-card/95 px-5 py-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          <p className="text-xs font-bold text-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
