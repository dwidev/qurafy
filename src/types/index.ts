import type { LucideIcon } from "lucide-react";

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

export interface PrayerTime {
    name: string;
    time: string;
    active: boolean;
}

export interface QuickStat {
    icon: LucideIcon;
    label: string;
    value: string;
    color: string;
    bg: string;
}

export type ReadingType = "quran" | "memorization" | "khatam";

export interface ReadingData {
    readingType: ReadingType;
    surah: string;
    verse: string;
    arabic: string;
    link: string;
}

export interface RecentActivityItem {
    surah: string;
    verse: string;
    time: string;
}

export interface DonationPreset {
    value: string;
    label: string;
}

export interface PricingFeature {
    text: string;
}
