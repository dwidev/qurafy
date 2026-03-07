import {
    Flame,
    Clock,
    BookOpen,
    TrendingUp,
} from "lucide-react";
import type { PrayerTime, QuickStat, ReadingData, RecentActivityItem, DonationPreset } from "@/types";

// ── Dashboard ────────────────────────────────────────────

export const prayerTimes: PrayerTime[] = [
    { name: "Fajr", time: "04:42", active: false },
    { name: "Dhuhr", time: "12:05", active: true },
    { name: "Asr", time: "15:20", active: false },
    { name: "Maghrib", time: "18:12", active: false },
    { name: "Isha", time: "19:25", active: false },
];

export const quickStats = (isNewUser: boolean): QuickStat[] => [
    { icon: Flame, label: "Current Streak", value: isNewUser ? "0 Days" : "16 Days", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
    { icon: Clock, label: "Time Read", value: isNewUser ? "0h 0m" : "14h 20m", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { icon: BookOpen, label: "Verses Read", value: isNewUser ? "0" : "1,240", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
    { icon: TrendingUp, label: "Weekly Goal", value: isNewUser ? "0%" : "80%", color: "text-primary", bg: "bg-primary/10" },
];

export const readingQuranData: ReadingData = {
    surah: "Surah Al-Kahf",
    verse: "Verse 10 — The Cave",
    arabic: "إِذْ أَوَى ٱلْفِتْيَةُ إِلَى ٱلْكَهْفِ فَقَالُوا۟ رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةً",
    link: "/app/read",
};

export const khatamProgressData: ReadingData = {
    surah: "Surah Ya-Sin",
    verse: "Verse 40 — The Sun & Moon",
    arabic: "لَا ٱلشَّمْسُ يَنۢبَغِى لَهَآ أَن تُدْرِكَ ٱلْقَمَرَ وَلَا ٱلَّيْلُ سَابِقُ ٱلنَّهَارِ",
    link: "/app/tracker",
};

export const recentActivityItems: RecentActivityItem[] = [
    { surah: "Al-Baqarah", verse: "Verse 255 (Ayatul Kursi)", time: "2 hours ago" },
    { surah: "Yaseen", verse: "Verse 1-10", time: "Yesterday" },
    { surah: "Al-Mulk", verse: "Completed", time: "2 days ago" },
];

// ── Landing Page ─────────────────────────────────────────

export const socialProofStats = [
    ["1k+", "Users Joined"],
    ["500+", "Khatams Completed"],
    ["10K+", "Verses Read"],
];

export const communityStats = [
    ["12,400+", "Active Users", "reveal-d1"],
    ["8,250+", "Khatams Done", "reveal-d2"],
    ["1.5M+", "Verses Memorized", "reveal-d3"],
    ["98%", "Consistency Rate", "reveal-d4"],
];

// ── Donation ─────────────────────────────────────────────

export const monthlyPresets: DonationPreset[] = [
    { value: "25000", label: "25K" },
    { value: "50000", label: "50K" },
    { value: "100000", label: "100K" },
    { value: "250000", label: "250K" },
];

export const yearlyPresets: DonationPreset[] = [
    { value: "200000", label: "200K" },
    { value: "500000", label: "500K" },
    { value: "1000000", label: "1M" },
    { value: "2500000", label: "2.5M" },
];

export const sadaqahPresets: DonationPreset[] = [
    { value: "20000", label: "20K" },
    { value: "50000", label: "50K" },
    { value: "100000", label: "100K" },
    { value: "500000", label: "500K" },
];
