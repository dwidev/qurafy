"use client";

import type { LucideIcon } from "lucide-react";

export function AuthInputField({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  trailing,
}: {
  icon: LucideIcon;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/50 transition-colors group-focus-within:text-primary">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        disabled={disabled}
        className={`h-10 w-full rounded-lg border border-border bg-secondary/30 pl-10 text-xs font-bold transition-all placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-card focus:outline-hidden ${
          trailing ? "pr-10" : "pr-3.5"
        }`}
      />
      {trailing ? <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">{trailing}</div> : null}
    </div>
  );
}
