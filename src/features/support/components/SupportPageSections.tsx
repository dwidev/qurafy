"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DonationPreset } from "@/types";

export function SupportShell({
  accent,
  className,
  children,
}: {
  accent: "rose" | "emerald";
  className?: string;
  children: React.ReactNode;
}) {
  const glowClass =
    accent === "rose"
      ? {
          top: "bg-rose-500/5",
          bottom: "bg-rose-500/5",
          selection: "selection:bg-rose-500/10",
        }
      : {
          top: "bg-emerald-500/10",
          bottom: "bg-emerald-500/10",
          selection: "selection:bg-emerald-500/10",
        };

  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-6",
        glowClass.selection,
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className={cn("absolute left-[15%] top-[10%] h-64 w-64 rounded-full blur-[120px]", glowClass.top)} />
        <div className={cn("absolute bottom-[10%] right-[15%] h-64 w-64 rounded-full blur-[120px]", glowClass.bottom)} />
      </div>
      {children}
    </div>
  );
}

export function SupportBackLink() {
  return (
    <Link
      href="/"
      className="group absolute left-8 top-8 z-20 flex items-center gap-2 text-muted-foreground transition-all hover:text-foreground"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background shadow-sm transition-all hover:shadow-md">
        <ChevronLeft className="h-4 w-4" />
      </div>
      <span className="-translate-x-2 text-[10px] font-black uppercase tracking-widest opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
        Exit
      </span>
    </Link>
  );
}

export function SupportHeader({
  icon: Icon,
  iconClassName,
  title,
  description,
}: {
  icon: LucideIcon;
  iconClassName: string;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <div className="text-center space-y-4">
      <div className="inline-flex flex-col items-center gap-6">
        <div className="relative group">
          <div className="absolute -inset-4 rounded-full bg-white/0 blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-border bg-card shadow-sm">
            <Icon className={iconClassName} />
          </div>
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-black tracking-tight text-foreground">{title}</h1>
          <div className="text-[14px] font-medium leading-relaxed text-muted-foreground">{description}</div>
        </div>
      </div>
    </div>
  );
}

export function PresetButtonGrid({
  presets,
  selectedValue,
  customValue,
  onSelect,
}: {
  presets: DonationPreset[];
  selectedValue: string;
  customValue: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {presets.map((preset) => (
        <button
          key={preset.value}
          type="button"
          onClick={() => onSelect(preset.value)}
          className={cn(
            "flex h-14 items-center justify-center gap-1.5 rounded-2xl border-2 text-sm font-black transition-all duration-300",
            selectedValue === preset.value && !customValue
              ? "border-foreground bg-foreground text-background shadow-lg shadow-foreground/10"
              : "border-border/50 bg-background text-muted-foreground hover:border-foreground/10",
          )}
        >
          <span className="text-[9px] font-bold opacity-40">IDR</span>
          {preset.label}
        </button>
      ))}
    </div>
  );
}

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

export function SupportFooter({
  href,
  icon: Icon,
  iconClassName,
  title,
  linkLabel,
  brandText,
}: {
  href: string;
  icon: LucideIcon;
  iconClassName: string;
  title: string;
  linkLabel: string;
  brandText: string;
}) {
  return (
    <div className="space-y-6 text-center">
      <Link
        href={href}
        className="group/link inline-flex items-center gap-2.5 text-[11px] font-bold text-muted-foreground/60 transition-all hover:text-foreground"
      >
        <Icon className={iconClassName} />
        {title}
        <span className="ml-1 text-[10px] font-extrabold underline decoration-current/30 underline-offset-4 transition-all group-hover/link:decoration-current">
          {linkLabel}
        </span>
      </Link>

      <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/20">
        <div className="h-px w-8 bg-current" />
        {brandText}
        <div className="h-px w-8 bg-current" />
      </div>
    </div>
  );
}
