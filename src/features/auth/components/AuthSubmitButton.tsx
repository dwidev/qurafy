"use client";

import { ArrowRight } from "lucide-react";

export function AuthSubmitButton({
  label,
  isLoading,
  disabled = false,
}: {
  label: string;
  isLoading: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-xs font-black text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70"
    >
      {isLoading ? (
        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        <>
          {label}
          <ArrowRight className="h-3.5 w-3.5" />
        </>
      )}
    </button>
  );
}
