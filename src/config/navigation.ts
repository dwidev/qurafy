import {
    BookOpen,
    Calendar,
    LayoutDashboard,
    Target,
    Settings,
    User,
} from "lucide-react";
import type { NavItem } from "@/types";

export const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/app",
        icon: LayoutDashboard,
    },
    {
        title: "Read Quran",
        href: "/app/read",
        icon: BookOpen,
    },
    {
        title: "Memorization",
        href: "/app/memorize",
        icon: Target,
    },
    {
        title: "Khatam Tracker",
        href: "/app/tracker",
        icon: Calendar,
    },
];

export const utilityNavItems: NavItem[] = [
    {
        title: "Settings",
        href: "/app/settings",
        icon: Settings,
    },
];

export const mobileNavItems: NavItem[] = [
    ...mainNavItems,
    {
        title: "Profile",
        href: "/app/profile",
        icon: User,
    },
    ...utilityNavItems,
];
