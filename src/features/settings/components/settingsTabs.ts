"use client";

import {
  Bell,
  BookOpen,
  CreditCard,
  Lock,
  Palette,
  Smartphone,
  User,
} from "lucide-react";
import type { SettingsTab } from "@/features/settings/components/settings-types";

export const settingsTabs: Array<{ id: SettingsTab; label: string; icon: typeof Smartphone }> = [
  { id: "general", label: "General", icon: Smartphone },
  { id: "account", label: "Account", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "reading", label: "Reading Prefs", icon: BookOpen },
  { id: "security", label: "Security", icon: Lock },
  { id: "billing", label: "Billing", icon: CreditCard },
];
