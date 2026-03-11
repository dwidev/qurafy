"use client";

import { cn } from "@/lib/utils";

export function CurrencyInput({
  value,
  onChange,
  accentClassName,
}: {
  value: string;
  onChange: (value: string) => void;
  accentClassName: string;
}) {
  return (
    <div className="group/input relative">
      <div
        className={cn(
          "absolute inset-y-0 left-0 flex items-center pl-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 transition-colors",
          accentClassName,
        )}
      >
        IDR
      </div>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Other amount"
        className="h-14 w-full rounded-2xl border border-transparent bg-secondary/20 pl-16 pr-6 text-sm font-black text-foreground transition-all placeholder:text-muted-foreground/40 focus:bg-background focus:outline-hidden"
      />
    </div>
  );
}
