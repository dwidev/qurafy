"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BookOpen, Eye, EyeOff, Sparkles } from "lucide-react";

export function AuthPageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-[360px] space-y-7">{children}</div>
    </div>
  );
}

export function AuthBrand() {
  return (
    <Link href="/" className="group inline-flex flex-col items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
        <BookOpen className="h-5 w-5" />
      </div>
      <h1 className="text-xl font-black tracking-tighter">Qurafy.io</h1>
    </Link>
  );
}

export function AuthIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center space-y-4">
      <AuthBrand />
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function GoogleSignInButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-card text-xs font-black transition-all hover:bg-muted disabled:opacity-70"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      Continue with Google
    </button>
  );
}

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
    <div className="relative group">
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
        className={`h-10 w-full rounded-lg border border-border bg-secondary/30 pl-10 text-xs font-bold transition-all placeholder:text-muted-foreground/50 focus:outline-hidden focus:border-primary/50 focus:bg-card ${
          trailing ? "pr-10" : "pr-3.5"
        }`}
      />
      {trailing ? <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">{trailing}</div> : null}
    </div>
  );
}

export function PasswordVisibilityButton({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-muted-foreground/50 transition-colors hover:text-foreground"
    >
      {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
    </button>
  );
}

export function AuthStatusMessages({
  errorMessage,
  successMessage,
}: {
  errorMessage?: string | null;
  successMessage?: string | null;
}) {
  return (
    <>
      {errorMessage ? <p className="text-xs font-semibold text-destructive">{errorMessage}</p> : null}
      {successMessage ? <p className="text-xs font-semibold text-emerald-600">{successMessage}</p> : null}
    </>
  );
}

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

export function AuthFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 pt-1 text-center">
      {children}
      <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground opacity-30">
        <Sparkles className="h-2.5 w-2.5" />
        Digital Islamic Excellence
      </div>
    </div>
  );
}
