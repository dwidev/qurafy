"use client";

import {
  Bell,
  BookOpen,
  ChevronRight,
  CreditCard,
  Globe,
  HelpCircle,
  History,
  Lock,
  Palette,
  Settings,
  Shield,
  Smartphone,
  User,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";

export type SettingsTab = "general" | "account" | "appearance" | "notifications" | "reading" | "security" | "billing";

export type NotificationSettings = {
  readingReminders: boolean;
  hifzRepetitions: boolean;
  khatamDaily: boolean;
  marketing: boolean;
};

export type AppearanceSettings = {
  theme: "light" | "dark" | "system";
  mushafMode: boolean;
  fontSize: number;
};

const settingsTabs: Array<{ id: SettingsTab; label: string; icon: typeof Smartphone }> = [
  { id: "general", label: "General", icon: Smartphone },
  { id: "account", label: "Account", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "reading", label: "Reading Prefs", icon: BookOpen },
  { id: "security", label: "Security", icon: Lock },
  { id: "billing", label: "Billing", icon: CreditCard },
];

function SettingsCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
      <h3 className="text-xl font-bold">{title}</h3>
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
    >
      <div className={`absolute top-1 h-4.5 w-4.5 rounded-full bg-white transition-all ${checked ? "left-6.5" : "left-1"}`} />
    </button>
  );
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
      <p className="mt-1 text-sm text-muted-foreground">Manage your account and app preferences.</p>
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
          className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
            activeTab === tab.id
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

export function GeneralSettingsSection() {
  return (
    <div className="space-y-6">
      <SettingsCard title="App Info">
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <p className="text-sm font-bold">Version</p>
            <p className="text-xs text-muted-foreground">v2.4.0 (Stable)</p>
          </div>
          <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            Up to date
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <p className="text-sm font-bold">Workspace Storage</p>
            <p className="text-xs text-muted-foreground">Local cache: 14.2 MB</p>
          </div>
          <button type="button" className="text-xs font-bold text-primary hover:underline">
            Clear Cache
          </button>
        </div>
      </SettingsCard>

      <SettingsCard title="Support">
        <div className="space-y-2">
          {[
            { label: "Help Center & FAQs", icon: HelpCircle },
            { label: "Give Feedback", icon: Globe },
            { label: "Terms of Service", icon: Shield },
            { label: "Privacy Policy", icon: Shield },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex w-full items-center justify-between rounded-xl p-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-muted-foreground" />
                {item.label}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
            </button>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}

export function AccountSettingsSection() {
  return (
    <div className="space-y-6">
      <SettingsCard title="Personal Information">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
            <input
              type="text"
              defaultValue="Ahmad Faris"
              className="h-11 w-full rounded-xl border border-border bg-transparent px-4 text-sm font-medium outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
            <input
              type="email"
              defaultValue="faris@qurafy.io"
              disabled
              className="h-11 w-full rounded-xl border border-border bg-secondary/50 px-4 text-sm font-medium outline-none"
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Danger Zone">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Permanently delete your account and all your reading progress. This action cannot be undone.
        </p>
        <button
          type="button"
          className="rounded-full bg-destructive/10 px-6 py-3 text-sm font-bold text-destructive transition-all hover:bg-destructive hover:text-white"
        >
          Delete Account
        </button>
      </SettingsCard>
    </div>
  );
}

export function NotificationSettingsSection({
  notifications,
  onToggle,
}: {
  notifications: NotificationSettings;
  onToggle: (key: keyof NotificationSettings) => void;
}) {
  return (
    <SettingsCard title="Notification Prefs">
      <div className="space-y-6">
        {[
          { id: "readingReminders", label: "Reading Reminders", desc: "Get reminded if you haven't read for a while." },
          { id: "hifzRepetitions", label: "Hifz Repetitions", desc: "Alerts for your scheduled hifz reviews." },
          { id: "khatamDaily", label: "Daily Khatam Update", desc: "Notification when it's time for your daily juz." },
          { id: "marketing", label: "Community & Updates", desc: "Stay informed about new app features." },
        ].map((item) => (
          <label key={item.id} className="flex cursor-pointer items-start justify-between">
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
      </div>
    </SettingsCard>
  );
}

export function AppearanceSettingsSection({
  appearance,
  onThemeChange,
  onToggleMushafMode,
}: {
  appearance: AppearanceSettings;
  onThemeChange: (theme: AppearanceSettings["theme"]) => void;
  onToggleMushafMode: () => void;
}) {
  return (
    <SettingsCard title="App Look & Feel">
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Theme</p>
        <div className="grid grid-cols-3 gap-4">
          {["light", "dark", "system"].map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => onThemeChange(theme as AppearanceSettings["theme"])}
              className={`flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all ${
                appearance.theme === theme ? "border-primary bg-primary/5 text-primary" : "border-border bg-card hover:bg-muted"
              }`}
            >
              <Palette className="h-5 w-5" />
              <span className="text-xs font-bold capitalize">{theme}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Arabic Reading Mode</p>
          <button type="button" onClick={onToggleMushafMode} className="text-xs font-bold text-primary">
            Change to {appearance.mushafMode ? "Verse" : "Mushaf"}
          </button>
        </div>
        <div className="flex items-center justify-center rounded-2xl border border-border bg-muted/30 p-6 text-center">
          <div className="space-y-2">
            <p className="text-2xl font-bold font-serif" dir="rtl">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <p className="text-xs text-muted-foreground">Preview of current font size ({appearance.fontSize}/7)</p>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}

export function PlaceholderSettingsSection({ activeTab }: { activeTab: SettingsTab }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-8 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <History className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold capitalize">{activeTab} coming soon</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Our engineers are working hard to bring this feature to you as soon as possible.
      </p>
    </div>
  );
}
