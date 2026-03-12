import {
  Flame,
  Clock,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import type { PrayerTime, QuickStat, ReadingData, RecentActivityItem } from "@/types";

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
  readingType: "quran",
  surah: "Surah Al-Kahf",
  verse: "Verse 10 — The Cave",
  arabic: "إِذْ أَوَى ٱلْفِتْيَةُ إِلَى ٱلْكَهْفِ فَقَالُوا۟ رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةً",
  link: "/app/read",
};

export const khatamProgressData: ReadingData = {
  readingType: "khatam",
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
