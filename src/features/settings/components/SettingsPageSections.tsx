"use client";

import Link from "next/link";
import {
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Globe,
  HelpCircle,
  History,
  Lock,
  Mail,
  Palette,
  Settings,
  Smartphone,
  Sparkles,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import type {
  AppearanceSettings,
  NotificationSettings,
  ReadingSettings,
  SettingsAccountData,
  SettingsBillingSummary,
  SettingsSubscriptionSummary,
  SettingsSecuritySession,
  SettingsTab,
} from "@/features/settings/types";

const settingsTabs: Array<{ id: SettingsTab; label: string; icon: typeof Smartphone }> = [
  { id: "general", label: "General", icon: Smartphone },
  { id: "account", label: "Account", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "reading", label: "Reading Prefs", icon: BookOpen },
  { id: "security", label: "Security", icon: Lock },
  { id: "subscription", label: "Subscription", icon: Sparkles },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const dailyGoalOptions = [
  { value: "build-consistency", label: "Build a daily reading habit" },
  { value: "memorize-juz-amma", label: "Memorize Juz Amma" },
  { value: "finish-khatam", label: "Complete a khatam plan" },
  { value: "learn-tafsir", label: "Understand tafsir deeper" },
] as const;

const arabicPreviewScale = [
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "text-5xl",
  "text-6xl",
  "text-7xl",
] as const;

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="space-y-1">
        <h3 className="text-xl font-bold">{title}</h3>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}

function SettingsToggle({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative h-6.5 w-12 rounded-full transition-all ${checked ? "bg-primary" : "bg-secondary"}`}
      aria-pressed={checked}
    >
      <div className={`absolute top-1 h-4.5 w-4.5 rounded-full bg-white transition-all ${checked ? "left-6.5" : "left-1"}`} />
    </button>
  );
}

function SectionActions({
  isSaving,
  isDisabled,
  label = "Save Changes",
}: {
  isSaving: boolean;
  isDisabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="submit"
      disabled={isSaving || isDisabled}
      className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
    >
      {isSaving ? "Saving..." : label}
    </button>
  );
}

function StatusText({
  errorMessage,
  successMessage,
}: {
  errorMessage?: string | null;
  successMessage?: string | null;
}) {
  if (errorMessage) {
    return <p className="text-sm font-medium text-destructive">{errorMessage}</p>;
  }

  if (successMessage) {
    return <p className="text-sm font-medium text-emerald-600">{successMessage}</p>;
  }

  return null;
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        disabled={disabled}
        className={`h-11 w-full rounded-xl border border-border px-4 text-sm font-medium outline-none transition-all ${disabled ? "bg-secondary/50 text-muted-foreground" : "bg-transparent focus:border-primary"
          }`}
      />
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatBillingCycleLabel(cycle: "monthly" | "yearly" | null) {
  if (!cycle) {
    return "None";
  }

  return `${cycle[0].toUpperCase()}${cycle.slice(1)}`;
}

function getDeviceLabel(session: SettingsSecuritySession) {
  if (!session.userAgent) {
    return "Unknown device";
  }

  if (session.userAgent.includes("iPhone")) {
    return "iPhone";
  }

  if (session.userAgent.includes("Android")) {
    return "Android";
  }

  if (session.userAgent.includes("Mac")) {
    return "Mac";
  }

  if (session.userAgent.includes("Windows")) {
    return "Windows";
  }

  return "Browser session";
}

export function SettingsHeader() {
  return (
    <div>
      <h1 className="flex items-center gap-2.5 text-3xl font-black tracking-tight">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </span>
        Settings
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your account, device preferences, subscription, billing, and security.</p>
    </div>
  );
}

export function SettingsSidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}) {
  return (
    <div className="space-y-2">
      {settingsTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${activeTab === tab.id
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
        >
          <tab.icon className="h-4 w-4" />
          {tab.label}
        </button>
      ))}
      <LogoutButton
        showLabel
        className="w-full rounded-b-[1.25rem] p-4 text-sm font-bold text-destructive transition-colors hover:bg-muted/50"
        iconClassName="h-4 w-4"
      />
    </div>
  );
}

export function GeneralSettingsSection({
  appVersion,
  cacheSizeLabel,
  onClearCache,
  cacheMessage,
}: {
  appVersion: string;
  cacheSizeLabel: string;
  onClearCache: () => void;
  cacheMessage: string | null;
}) {
  return (
    <div className="space-y-6">
      <SettingsCard title="App Info" description="Device-level settings and cache state for this browser.">
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <p className="text-sm font-bold">Version</p>
            <p className="text-xs text-muted-foreground">v{appVersion}</p>
          </div>
          <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            Current
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <p className="text-sm font-bold">Workspace Storage</p>
            <p className="text-xs text-muted-foreground">Local cache: {cacheSizeLabel}</p>
          </div>
          <button type="button" onClick={onClearCache} className="text-xs font-bold text-primary hover:underline">
            Clear Cache
          </button>
        </div>
        <StatusText successMessage={cacheMessage} />
      </SettingsCard>

      <SettingsCard title="Support & Shortcuts" description="Quick links to the areas users actually use today.">
        <div className="space-y-2">
          {[
            { label: "Supporter Plans", icon: Sparkles, href: "/donate" },
            { label: "Pure Sadaqah", icon: Globe, href: "/sadaqah" },
            { label: "Complete Profile", icon: User, href: "/complete-profile" },
            { label: "Back to Dashboard", icon: HelpCircle, href: "/app" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex w-full items-center justify-between rounded-xl p-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-muted-foreground" />
                {item.label}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
            </Link>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}

export function AccountSettingsSection({
  form,
  onChange,
  onSubmit,
  isSaving,
  isDirty,
  errorMessage,
  successMessage,
  onOpenDeleteDialog,
  onCloseDeleteDialog,
  onConfirmDeleteAccount,
  isDeleteDialogOpen,
  deleteConfirmation,
  onDeleteConfirmationChange,
  isDeleting,
  deleteErrorMessage,
}: {
  form: SettingsAccountData;
  onChange: <K extends keyof SettingsAccountData>(key: K, value: SettingsAccountData[K]) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSaving: boolean;
  isDirty: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  onOpenDeleteDialog: () => void;
  onCloseDeleteDialog: () => void;
  onConfirmDeleteAccount: () => void;
  isDeleteDialogOpen: boolean;
  deleteConfirmation: string;
  onDeleteConfirmationChange: (value: string) => void;
  isDeleting: boolean;
  deleteErrorMessage: string | null;
}) {
  return (
    <div className="space-y-6">
      <SettingsCard title="Personal Information" description="Update the profile and account details tied to your Qurafy account.">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <InputField label="Full Name" value={form.fullName} onChange={(value) => onChange("fullName", value)} />
            <InputField label="Email Address" value={form.email} type="email" disabled />
            <InputField label="Username" value={form.username} onChange={(value) => onChange("username", value)} />
            <InputField label="Location" value={form.location} onChange={(value) => onChange("location", value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Main Goal</label>
            <select
              value={form.dailyGoal}
              onChange={(event) => onChange("dailyGoal", event.target.value as SettingsAccountData["dailyGoal"])}
              className="h-11 w-full rounded-xl border border-border bg-transparent px-4 text-sm font-medium outline-none transition-all focus:border-primary"
            >
              {dailyGoalOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bio</label>
            <textarea
              value={form.bio}
              onChange={(event) => onChange("bio", event.target.value)}
              className="min-h-32 w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-sm font-medium outline-none transition-all focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5 text-sm text-muted-foreground">
              <p>Member since {formatDate(form.memberSince)}</p>
              <p>{form.emailVerified ? "Email verified" : "Email not verified yet"}</p>
            </div>
            <SectionActions isSaving={isSaving} isDisabled={!isDirty} label="Save Account" />
          </div>

          <StatusText errorMessage={errorMessage} successMessage={successMessage} />
        </form>
      </SettingsCard>

      <SettingsCard title="Danger Zone" description="Account deletion is permanent and removes your profile, progress, and session history.">
        <div className="space-y-4">
          <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm leading-relaxed text-destructive">
            Deleting your account will permanently delete your profile data, reading progress, memorization data, and active sessions.
          </p>
          <button
            type="button"
            onClick={onOpenDeleteDialog}
            disabled={isDeleting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-destructive px-5 text-sm font-bold text-white transition-all hover:bg-destructive/90 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
        </div>
      </SettingsCard>

      {isDeleteDialogOpen ? (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onCloseDeleteDialog} />
          <div className="relative z-201 w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Delete account?</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  This permanently deletes your profile, progress, memorization data, and active sessions.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Type DELETE to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(event) => onDeleteConfirmationChange(event.target.value)}
                placeholder="DELETE"
                className="h-11 w-full rounded-2xl border border-destructive/30 bg-destructive/5 px-4 text-sm font-medium outline-none transition-all focus:border-destructive"
              />
            </div>

            {deleteErrorMessage ? <p className="mt-4 text-sm font-medium text-destructive">{deleteErrorMessage}</p> : null}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onCloseDeleteDialog}
                disabled={isDeleting}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-border px-5 text-sm font-bold transition-all hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmDeleteAccount}
                disabled={isDeleting || deleteConfirmation !== "DELETE"}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-destructive px-5 text-sm font-bold text-white transition-all hover:bg-destructive/90 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function NotificationSettingsSection({
  notifications,
  onToggle,
  onSubmit,
  isSaving,
  isDirty,
  errorMessage,
  successMessage,
}: {
  notifications: NotificationSettings;
  onToggle: (key: keyof NotificationSettings) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSaving: boolean;
  isDirty: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}) {
  return (
    <SettingsCard title="Notification Prefs" description="Control what Qurafy should remind you about.">
      <form onSubmit={onSubmit} className="space-y-6">
        {[
          { id: "readingReminders", label: "Reading Reminders", desc: "Get reminded if you have not read for a while." },
          { id: "hifzRepetitions", label: "Hifz Repetitions", desc: "Alerts for your scheduled memorization reviews." },
          { id: "khatamDaily", label: "Daily Khatam Update", desc: "Know when it is time for your daily juz target." },
          { id: "marketing", label: "Community & Updates", desc: "Product updates, new features, and support campaigns." },
        ].map((item) => (
          <label key={item.id} className="flex cursor-pointer items-start justify-between gap-6">
            <div className="space-y-0.5">
              <p className="text-sm font-bold">{item.label}</p>
              <p className="max-w-sm text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <div className="pt-1">
              <SettingsToggle
                checked={notifications[item.id as keyof NotificationSettings]}
                onToggle={() => onToggle(item.id as keyof NotificationSettings)}
              />
            </div>
          </label>
        ))}

        <div className="flex items-center justify-between gap-3">
          <StatusText errorMessage={errorMessage} successMessage={successMessage} />
          <SectionActions isSaving={isSaving} isDisabled={!isDirty} />
        </div>
      </form>
    </SettingsCard>
  );
}

export function AppearanceSettingsSection({
  appearance,
  onThemeChange,
  onSubmit,
  isSaving,
  isDirty,
  errorMessage,
  successMessage,
}: {
  appearance: AppearanceSettings;
  onThemeChange: (theme: AppearanceSettings["theme"]) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSaving: boolean;
  isDirty: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}) {
  return (
    <SettingsCard title="App Look & Feel" description="Customize the website interface theme.">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Theme</p>
          <div className="grid grid-cols-3 gap-4">
            {["light", "dark", "system"].map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => onThemeChange(theme as AppearanceSettings["theme"])}
                className={`flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all ${appearance.theme === theme ? "border-primary bg-primary/5 text-primary" : "border-border bg-card hover:bg-muted"
                  }`}
              >
                <Palette className="h-5 w-5" />
                <span className="text-xs font-bold capitalize">{theme}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <StatusText errorMessage={errorMessage} successMessage={successMessage} />
          <SectionActions isSaving={isSaving} isDisabled={!isDirty} />
        </div>
      </form>
    </SettingsCard>
  );
}

export function ReadingSettingsSection({
  reading,
  onModeChange,
  onToggleTranslation,
  onToggleTransliteration,
  onArabicSizeChange,
  onSubmit,
  isSaving,
  isDirty,
  errorMessage,
  successMessage,
}: {
  reading: ReadingSettings;
  onModeChange: (mode: ReadingSettings["mode"]) => void;
  onToggleTranslation: () => void;
  onToggleTransliteration: () => void;
  onArabicSizeChange: (value: number) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSaving: boolean;
  isDirty: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}) {
  const arabicScaleClass = arabicPreviewScale[reading.arabicSize - 1] ?? arabicPreviewScale[3];

  return (
    <SettingsCard title="Reading Preferences" description="Match the reader defaults to how you actually study.">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">Live Reader Preview</p>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
              {reading.mode === "mushaf" ? "Mushaf" : "Verse"}
            </span>
          </div>

          {reading.mode === "verse" ? (
            <div className="rounded-2xl border border-border/70 bg-background p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  1
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verse View</span>
              </div>

              <p className={`text-right font-serif font-bold leading-[2.3] text-foreground/90 ${arabicScaleClass}`} dir="rtl">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>

              {reading.showTransliteration ? (
                <p className="mt-4 text-sm font-medium tracking-wide text-primary/80">
                  Bismillahir Rahmanir Rahim
                </p>
              ) : null}

              {reading.showTranslation ? (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  In the name of Allah, the Entirely Merciful, the Especially Merciful.
                </p>
              ) : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-border/70 bg-background p-5 shadow-sm">
              <div className="text-right font-serif font-bold leading-[2.5] text-foreground/90" dir="rtl">
                <span className={arabicScaleClass}>
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </span>{" "}
                <span className="relative mx-1 inline-flex translate-y-2 items-center justify-center">
                  <span className="absolute inset-0 flex translate-y-[-8px] items-center justify-center text-[0.45em] text-muted-foreground">
                    ١
                  </span>
                  <span className="text-[0.8em] text-primary/70">۝</span>
                </span>{" "}
                <span className={arabicScaleClass}>
                  ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ
                </span>{" "}
                <span className="relative mx-1 inline-flex translate-y-2 items-center justify-center">
                  <span className="absolute inset-0 flex translate-y-[-8px] items-center justify-center text-[0.45em] text-muted-foreground">
                    ٢
                  </span>
                  <span className="text-[0.8em] text-primary/70">۝</span>
                </span>
              </div>

              {reading.showTranslation || reading.showTransliteration ? (
                <div className="mt-6 space-y-2 border-t border-border/50 pt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Translation Block</p>
                  {reading.showTransliteration ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-primary/80">1. Bismillahir Rahmanir Rahim</p>
                      <p className="text-sm font-medium text-primary/80">2. Alhamdu lillahi rabbil &#39;alamin</p>
                    </div>
                  ) : null}
                  {reading.showTranslation ? (
                    <div className="space-y-1">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        1. In the name of Allah, the Entirely Merciful, the Especially Merciful.
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        2. All praise is due to Allah, Lord of the worlds.
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Default Reader Mode</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "verse", label: "Verse View" },
              { value: "mushaf", label: "Mushaf View" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onModeChange(option.value as ReadingSettings["mode"])}
                className={`rounded-2xl border p-4 text-sm font-bold transition-all ${reading.mode === option.value ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">Arabic Font Size</p>
            <span className="text-xs font-bold text-muted-foreground">{reading.arabicSize}/7</span>
          </div>
          <input
            type="range"
            min={1}
            max={7}
            value={reading.arabicSize}
            onChange={(event) => onArabicSizeChange(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
          />
        </div>

        <div className="space-y-4">
          <label className="flex items-start justify-between gap-6">
            <div className="space-y-0.5">
              <p className="text-sm font-bold">Show Translation</p>
              <p className="text-xs text-muted-foreground">Display the English translation in the reader.</p>
            </div>
            <SettingsToggle checked={reading.showTranslation} onToggle={onToggleTranslation} />
          </label>
          <label className="flex items-start justify-between gap-6">
            <div className="space-y-0.5">
              <p className="text-sm font-bold">Show Transliteration</p>
              <p className="text-xs text-muted-foreground">Display the Latin transliteration below the Arabic text.</p>
            </div>
            <SettingsToggle checked={reading.showTransliteration} onToggle={onToggleTransliteration} />
          </label>
        </div>

        <div className="flex items-center justify-between gap-3">
          <StatusText errorMessage={errorMessage} successMessage={successMessage} />
          <SectionActions isSaving={isSaving} isDisabled={!isDirty} />
        </div>
      </form>
    </SettingsCard>
  );
}

export function SecuritySettingsSection({
  email,
  emailVerified,
  sessions,
  onSendPasswordReset,
  onLogoutAll,
  isSendingPasswordReset,
  isLoggingOutAll,
  passwordResetMessage,
  errorMessage,
}: {
  email: string;
  emailVerified: boolean;
  sessions: SettingsSecuritySession[];
  onSendPasswordReset: () => void;
  onLogoutAll: () => void;
  isSendingPasswordReset: boolean;
  isLoggingOutAll: boolean;
  passwordResetMessage: string | null;
  errorMessage: string | null;
}) {
  return (
    <div className="space-y-6">
      <SettingsCard title="Password & Verification" description="Use the existing auth flow to secure your account.">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-muted/20 p-4">
            <div className="space-y-1">
              <p className="text-sm font-bold">Password Reset</p>
              <p className="text-xs text-muted-foreground">
                Send a reset link to <span className="font-semibold text-foreground">{email}</span>.
              </p>
            </div>
            <button
              type="button"
              onClick={onSendPasswordReset}
              disabled={isSendingPasswordReset}
              className="inline-flex h-10 items-center justify-center rounded-full border border-border px-4 text-xs font-bold transition-all hover:bg-muted disabled:opacity-50"
            >
              {isSendingPasswordReset ? "Sending..." : "Send Reset Link"}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/20 p-4">
            <div className="space-y-1">
              <p className="text-sm font-bold">Email Verification</p>
              <p className="text-xs text-muted-foreground">Current status for your sign-in email.</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${emailVerified ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-700"
                }`}
            >
              {emailVerified ? "Verified" : "Pending"}
            </span>
          </div>

          <StatusText errorMessage={errorMessage} successMessage={passwordResetMessage} />
        </div>
      </SettingsCard>

      <SettingsCard title="Active Sessions" description="Recent devices that accessed your account. Logging out all sessions signs you out here too.">
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No active sessions found.
            </div>
          ) : (
            sessions.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-muted/10 p-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold">{getDeviceLabel(item)}</p>
                    {item.isCurrent ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary">
                        Current
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last seen {formatDate(item.lastSeenAt)}{item.ipAddress ? ` • ${item.ipAddress}` : ""}
                  </p>
                  {item.userAgent ? <p className="text-xs text-muted-foreground/80">{item.userAgent}</p> : null}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Expires {formatDate(item.expiresAt)}
                </div>
              </div>
            ))
          )}

          <button
            type="button"
            onClick={onLogoutAll}
            disabled={isLoggingOutAll}
            className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-bold transition-all hover:bg-muted disabled:opacity-50"
          >
            {isLoggingOutAll ? "Signing out..." : "Log Out All Devices"}
          </button>
        </div>
      </SettingsCard>
    </div>
  );
}

export function BillingSettingsSection({ billing }: { billing: SettingsBillingSummary }) {
  return (
    <div className="space-y-6">
      <SettingsCard title="Support Summary" description="Your supporter and donation activity appears here when payments are recorded.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-muted/10 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Confirmed Support</p>
            <p className="mt-2 text-2xl font-black">{formatCurrency(billing.totalConfirmedAmount)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/10 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Successful Payments</p>
            <p className="mt-2 text-2xl font-black">{billing.totalConfirmedCount}</p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/10 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Supporter Status</p>
            <p className="mt-2 text-2xl font-black">{billing.activeSupporter ? "Active" : "Inactive"}</p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Billing History" description="Recent supporter and donation records associated with your account.">
        {billing.donations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-8 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold">No billing records yet</h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Start a supporter plan or give pure sadaqah to see your contribution history here.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/donate"
                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Open Supporter Plans
              </Link>
              <Link
                href="/sadaqah"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-bold transition-all hover:bg-muted"
              >
                Give Sadaqah
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {billing.donations.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/10 p-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold">{formatCurrency(item.amount)}</p>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {item.type === "recurring" ? `${item.billingCycle ?? "Recurring"} supporter` : "One-time donation"}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${item.status === "confirmed"
                          ? "bg-emerald-50 text-emerald-600"
                          : item.status === "failed"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-amber-50 text-amber-700"
                        }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Created {formatDate(item.createdAt)}</p>
                </div>
                <Link
                  href={item.type === "recurring" ? "/donate" : "/sadaqah"}
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                >
                  Manage
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </SettingsCard>
    </div>
  );
}

export function SubscriptionSettingsSection({
  subscription,
}: {
  subscription: SettingsSubscriptionSummary;
}) {
  const isPro = subscription.planType === "pro" && subscription.status === "active";
  const isPendingRequest = subscription.status === "pending";
  const billingCycleLabel = formatBillingCycleLabel(subscription.billingCycle);
  const nextRenewalLabel = subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : null;
  const freeBenefits = [
    "Read the Quran with translation and transliteration controls.",
    "Track your khatam progress and keep your daily reading habit visible.",
    "Run memorization sessions and keep your personal learning rhythm.",
    "Use settings, profile, and device preferences across your account.",
  ];
  const proBenefits = [
    "Everything in Free, plus full supporter status across your account.",
    "Monthly or yearly Pro access through the Qurafy supporter plan.",
    "Priority access to deeper productivity and supporter-only upgrades as they launch.",
    "Your plan directly helps sustain Qurafy while keeping core Quran access free.",
  ];

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Current Plan"
        description="Your subscription status is based on the active supporter plan attached to this account."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-muted/10 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Plan</p>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-2xl font-black">{isPro ? "Pro" : "Free"}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${isPro ? "bg-amber-500/15 text-amber-700" : "bg-secondary text-muted-foreground"
                  }`}
              >
                {isPro ? "Supporter" : "Starter"}
              </span>
              {isPro ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${subscription.billingCycle === "yearly"
                      ? "bg-amber-500 text-white"
                      : "bg-rose-500 text-white"
                    }`}
                >
                  {billingCycleLabel}
                </span>
              ) : null}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-muted/10 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</p>
            <p className="mt-2 text-2xl font-black">
              {subscription.status === "inactive"
                ? "Not Active"
                : `${subscription.status[0].toUpperCase()}${subscription.status.slice(1)}`}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/10 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {isPro ? "Renews" : "Billing Cycle"}
            </p>
            <p className="mt-2 text-2xl font-black">{isPro ? nextRenewalLabel ?? "N/A" : billingCycleLabel}</p>
          </div>
        </div>

        <div
          className={`rounded-3xl border px-5 py-4 ${isPro
              ? "border-amber-500/20 bg-amber-500/5"
              : "border-emerald-500/20 bg-emerald-500/5"
            }`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold">
                {isPro
                  ? "Your account currently has active Pro supporter access."
                  : isPendingRequest
                    ? "Your supporter plan request is waiting for bank transfer approval."
                  : "Your account is on the Free plan and keeps core Quran features unlocked."}
              </p>
              <p className="text-sm text-muted-foreground">
                {isPro
                  ? `Your ${billingCycleLabel.toLowerCase()} supporter plan is active${nextRenewalLabel ? ` through ${nextRenewalLabel}` : ""}.`
                  : isPendingRequest
                    ? "Complete the transfer and wait for admin confirmation. Pro access starts only after approval."
                  : "Free users can still read, track progress, memorize, and personalize their experience without a subscription."}
              </p>
            </div>
            <Link
              href={isPendingRequest && subscription.transactionId ? `/transfer?tx=${subscription.transactionId}` : "/donate"}
              className={`inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-bold transition-all ${isPro
                  ? "border border-amber-500/30 text-amber-700 hover:bg-amber-500/10"
                  : isPendingRequest
                    ? "border border-amber-500/30 text-amber-700 hover:bg-amber-500/10"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
            >
              {isPro ? "Manage Supporter Plan" : isPendingRequest ? "View Transfer Info" : "Upgrade to Pro"}
            </Link>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title={isPro ? "Your Pro Benefits" : "What You Get on Free"}
        description={
          isPro
            ? "Your supporter plan keeps the full free experience and adds Pro supporter benefits."
            : "Free users still get the essential Qurafy experience without payment friction."
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          {(isPro ? proBenefits : freeBenefits).map((benefit) => (
            <div key={benefit} className="flex gap-3 rounded-2xl border border-border bg-muted/10 p-4">
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${isPro ? "bg-amber-500/10 text-amber-700" : "bg-emerald-500/10 text-emerald-700"
                  }`}
              >
                {isPro ? <Star className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              </div>
              <p className="text-sm font-medium leading-relaxed">{benefit}</p>
            </div>
          ))}
        </div>
      </SettingsCard>

      {!isPro ? (
        <SettingsCard
          title="Why Pro Exists"
          description="Qurafy keeps the core Quran journey free. Pro is positioned as a supporter upgrade, not a paywall on the essentials."
        >
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Upgrading to Pro helps fund product development, hosting, and maintenance while preserving free access for everyone.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/donate"
                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
              >
                See Supporter Plans
              </Link>
              <Link
                href="/sadaqah"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-bold transition-all hover:bg-muted"
              >
                Give Pure Sadaqah
              </Link>
            </div>
          </div>
        </SettingsCard>
      ) : null}
    </div>
  );
}
