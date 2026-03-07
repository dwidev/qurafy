"use client";

import { useState } from "react";
import {
    User,
    Settings,
    Bell,
    Shield,
    Palette,
    Globe,
    Smartphone,
    ChevronRight,
    LogOut,
    HelpCircle,
    CreditCard,
    History,
    BookOpen,
    Lock
} from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");

    // Toggle states
    const [notifications, setNotifications] = useState({
        readingReminders: true,
        hifzRepetitions: true,
        khatamDaily: true,
        marketing: false
    });

    const [appearance, setAppearance] = useState({
        theme: "system", // "light", "dark", "system"
        mushafMode: true,
        fontSize: 4
    });

    const updateNotify = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 max-w-5xl mx-auto pb-32">

            {/* ── Page Header ─────────────────────────────────── */}
            <div>
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                        <Settings className="h-5 w-5 text-primary" />
                    </span>
                    Settings
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your account and app preferences.</p>
            </div>

            <div className="grid lg:grid-cols-[280px_1fr] gap-8">

                {/* ── Sidebar Navigation ──────────────────────────── */}
                <div className="space-y-2">
                    {[
                        { id: "general", label: "General", icon: Smartphone },
                        { id: "account", label: "Account", icon: User },
                        { id: "appearance", label: "Appearance", icon: Palette },
                        { id: "notifications", label: "Notifications", icon: Bell },
                        { id: "reading", label: "Reading Prefs", icon: BookOpen },
                        { id: "security", label: "Security", icon: Lock },
                        { id: "billing", label: "Billing", icon: CreditCard },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id
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
                        className="w-full rounded-b-[1.25rem] p-4 text-sm font-bold text-destructive hover:bg-muted/50 transition-colors"
                        iconClassName="h-4 w-4"
                    />
                </div>

                {/* ── Main Content Area ───────────────────────────── */}
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

                    {/* General Section */}
                    {activeTab === "general" && (
                        <div className="space-y-6">
                            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
                                <h3 className="text-xl font-bold">App Info</h3>
                                <div className="flex items-center justify-between py-2">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold">Version</p>
                                        <p className="text-xs text-muted-foreground">v2.4.0 (Stable)</p>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md">Up to date</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold">Workspace Storage</p>
                                        <p className="text-xs text-muted-foreground">Local cache: 14.2 MB</p>
                                    </div>
                                    <button className="text-xs font-bold text-primary hover:underline">Clear Cache</button>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
                                <h3 className="text-xl font-bold">Support</h3>
                                <div className="space-y-2">
                                    {[
                                        { label: "Help Center & FAQs", icon: HelpCircle },
                                        { label: "Give Feedback", icon: Globe },
                                        { label: "Terms of Service", icon: Shield },
                                        { label: "Privacy Policy", icon: Shield },
                                    ].map((item, i) => (
                                        <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors text-sm font-medium">
                                            <div className="flex items-center gap-3">
                                                <item.icon className="h-4 w-4 text-muted-foreground" />
                                                {item.label}
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Account Section */}
                    {activeTab === "account" && (
                        <div className="space-y-6">
                            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
                                <h3 className="text-xl font-bold">Personal Information</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                                        <input type="text" defaultValue="Ahmad Faris" className="w-full h-11 px-4 rounded-xl border border-border bg-transparent outline-none focus:border-primary font-medium text-sm" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                                        <input type="email" defaultValue="faris@qurafy.io" className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/50 outline-none font-medium text-sm" disabled />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
                                <h3 className="text-xl font-bold text-destructive">Danger Zone</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">Permanently delete your account and all your reading progress. This action cannot be undone.</p>
                                <button className="px-6 py-3 rounded-full bg-destructive/10 text-destructive text-sm font-bold hover:bg-destructive hover:text-white transition-all">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notifications Section */}
                    {activeTab === "notifications" && (
                        <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-8">
                            <h3 className="text-xl font-bold">Notification Prefs</h3>
                            <div className="space-y-6">
                                {[
                                    { id: "readingReminders", label: "Reading Reminders", desc: "Get reminded if you haven't read for a while." },
                                    { id: "hifzRepetitions", label: "Hifz Repetitions", desc: "Alerts for your scheduled hifz reviews." },
                                    { id: "khatamDaily", label: "Daily Khatam Update", desc: "Notification when it's time for your daily juz." },
                                    { id: "marketing", label: "Community & Updates", desc: "Stay informed about new app features." },
                                ].map((item) => (
                                    <label key={item.id} className="flex items-start justify-between cursor-pointer group">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold">{item.label}</p>
                                            <p className="text-xs text-muted-foreground max-w-sm">{item.desc}</p>
                                        </div>
                                        <div className="pt-1">
                                            <div
                                                onClick={() => updateNotify(item.id as keyof typeof notifications)}
                                                className={`w-12 h-6.5 rounded-full transition-all relative ${notifications[item.id as keyof typeof notifications] ? "bg-primary" : "bg-secondary"}`}
                                            >
                                                <div className={`absolute top-1 w-4.5 h-4.5 rounded-full bg-white transition-all ${notifications[item.id as keyof typeof notifications] ? "left-6.5" : "left-1"}`} />
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Appearance Section */}
                    {activeTab === "appearance" && (
                        <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-8">
                            <h3 className="text-xl font-bold">App Look & Feel</h3>

                            <div className="space-y-4">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Theme</p>
                                <div className="grid grid-cols-3 gap-4">
                                    {["light", "dark", "system"].map((t) => (
                                        <button
                                            key={t}
                                            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${appearance.theme === t ? "border-primary bg-primary/5 text-primary" : "border-border bg-card hover:bg-muted"}`}
                                            onClick={() => setAppearance({ ...appearance, theme: t })}
                                        >
                                            <Palette className="h-5 w-5" />
                                            <span className="text-xs font-bold capitalize">{t}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Arabic Reading Mode</p>
                                    <button
                                        onClick={() => setAppearance({ ...appearance, mushafMode: !appearance.mushafMode })}
                                        className="text-xs font-bold text-primary"
                                    >
                                        Change to {appearance.mushafMode ? "Verse" : "Mushaf"}
                                    </button>
                                </div>
                                <div className="p-6 rounded-2xl border border-border bg-muted/30 flex items-center justify-center text-center">
                                    <div className="space-y-2">
                                        <p className="text-2xl font-serif font-bold" dir="rtl">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                                        <p className="text-xs text-muted-foreground">Preview of current font size ({appearance.fontSize}/7)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {["reading", "security", "billing"].includes(activeTab) && (
                        <div className="flex flex-col items-center justify-center py-20 px-8 text-center rounded-3xl border border-dashed border-border bg-card/50">
                            <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                                <History className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-bold capitalize">{activeTab} coming soon</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mt-2">Our engineers are working hard to bring this feature to you as soon as possible.</p>
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
}
