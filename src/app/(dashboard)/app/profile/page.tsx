"use client";

import { useState } from "react";
import {
    MapPin,
    Edit3,
    Trophy,
    Medal,
    Flame,
    BookOpen,
    Calendar,
    Settings,
    Shield,
    Bell,
    ChevronRight,
    Camera,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default function ProfilePage() {
    const [, setIsEditing] = useState(false);

    // Mock user data
    const user = {
        name: "Ahmad Faris",
        username: "@ahmad_faris",
        email: "faris@qurafy.io",
        location: "Jakarta, Indonesia",
        bio: "Passionate about learning Quran and building habits. Currently on a journey to memorize Juz 30.",
        joinedDate: "October 2025",
        stats: {
            streak: 16,
            versesRead: 1240,
            khatamDone: 2,
            rank: "Hafiz Apprentice"
        },
        achievements: [
            { id: 1, title: "Early Bird", icon: Flame, color: "text-orange-500", bg: "bg-orange-50", desc: "Read Quran before dawn for 7 days" },
            { id: 2, title: "Century Club", icon: Medal, color: "text-blue-500", bg: "bg-blue-50", desc: "Read 100 verses in a single session" },
            { id: 3, title: "Khatam Master", icon: Trophy, color: "text-amber-500", bg: "bg-amber-50", desc: "Completed 2 full Khatam plans" }
        ]
    };

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 max-w-5xl mx-auto pb-24">

            {/* ── Profile Hero ─────────────────────────────────── */}
            <div className="relative rounded-[2.5rem] border border-border bg-card p-6 md:p-10 shadow-sm overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    {/* Avatar Container */}
                    <div className="relative">
                        <div className="h-32 w-32 md:h-40 md:w-40 rounded-4xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border-4 border-background shadow-xl overflow-hidden group/avatar">
                            <span className="text-5xl md:text-6xl font-black text-primary/40 selection:bg-transparent">
                                {user.name.charAt(0)}
                            </span>
                            <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity text-white">
                                <Camera className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary rounded-xl border-4 border-background flex items-center justify-center text-white shadow-lg">
                            <Shield className="h-5 w-5" />
                        </div>
                    </div>

                    {/* User Details */}
                    <div className="flex-1 flex flex-col items-center md:items-start space-y-4 text-center md:text-left">
                        <div className="space-y-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight">{user.name}</h1>
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
                                    {user.stats.rank}
                                </span>
                            </div>
                            <p className="text-muted-foreground font-medium">{user.username}</p>
                        </div>

                        <p className="text-foreground/80 leading-relaxed max-w-lg">
                            {user.bio}
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground pt-2">
                            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {user.location}</span>
                            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Joined {user.joinedDate}</span>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
                            >
                                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                            </button>
                            <button className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-bold hover:bg-muted transition-all">
                                Share Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Quick Stats Grid ─────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Day Streak", value: user.stats.streak, icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
                    { label: "Verses Read", value: user.stats.versesRead || "1,240", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Days Completed", value: user.stats.khatamDone, icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Achievements", value: user.achievements.length, icon: Trophy, color: "text-amber-500", bg: "bg-amber-50" },
                ].map((stat, i) => (
                    <div key={i} className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="absolute -right-4 -bottom-4 opacity-5 text-foreground transition-transform group-hover:scale-110 group-hover:-rotate-12">
                            <stat.icon className="h-24 w-24" />
                        </div>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} mb-4 shadow-inner`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <p className="text-3xl font-black leading-none">{stat.value}</p>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-2">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-3 gap-8 pt-4">
                {/* ── Achievements Column ─────────────────────────── */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-2xl font-black px-1 flex items-center gap-3">
                        Achievements
                        <span className="h-6 w-9 rounded-lg bg-secondary flex items-center justify-center text-[10px] font-black text-muted-foreground">
                            {user.achievements.length}
                        </span>
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {user.achievements.map((item) => (
                            <div key={item.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm hover:border-primary/20 transition-all flex gap-4 group">
                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.bg} ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-base leading-tight">{item.title}</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                        <button className="rounded-3xl border border-dashed border-border bg-secondary/5 p-5 flex flex-col items-center justify-center text-center gap-2 hover:bg-secondary/10 transition-all group">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground group-hover:text-primary transition-colors">
                                <Medal className="h-5 w-5" />
                            </div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">View All Badges</p>
                        </button>
                    </div>
                </div>

                {/* ── Settings Quick Menu ─────────────────────────── */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black px-1">Quick Actions</h2>
                    <div className="rounded-3xl border border-border bg-card p-2 shadow-sm divide-y divide-border/50">
                        {[
                            { label: "Account Settings", icon: Settings, href: "/app/settings", color: "text-foreground" },
                            { label: "Notification Prefs", icon: Bell, href: "/app/settings", color: "text-foreground" },
                            { label: "Privacy & Security", icon: Shield, href: "/app/settings", color: "text-foreground" },
                        ].map((item, i) => (
                            <Link
                                key={i}
                                href={item.href}
                                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors first:rounded-t-[1.25rem]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center bg-secondary/50 ${item.color}`}>
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <span className={`text-sm font-bold ${item.color}`}>{item.label}</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                            </Link>
                        ))}
                        <LogoutButton
                            showLabel
                            className="w-full rounded-b-[1.25rem] p-4 text-sm font-bold text-destructive hover:bg-muted/50 transition-colors"
                            iconClassName="h-4 w-4"
                        />
                    </div>

                    <div className="rounded-4xl bg-linear-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-8 shadow-xl shadow-primary/5 relative overflow-hidden group/pro">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover/pro:scale-150 transition-transform duration-700" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover/pro:rotate-12 transition-transform">
                                    <Sparkles className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black">Qurafy Pro</h3>
                                    <p className="text-xs font-bold text-primary/60 uppercase tracking-widest mt-0.5">Premium Features</p>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">Donate any amount as Sadaqah to unlock Pro features permanently.</p>

                            <div className="space-y-3">
                                {[
                                    "Donate Any Amount",
                                    "Permanent Pro Access",
                                    "Supporting Our Mission",
                                ].map((feat) => (
                                    <div key={feat} className="flex items-center gap-2.5 text-xs font-bold text-foreground/80">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        {feat}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2 space-y-3">
                                <button className="w-full h-12 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-black shadow-sm hover:bg-primary/10 transition-all">
                                    Donate to Unlock Pro
                                </button>
                                <button className="w-full h-12 rounded-full bg-amber-500 text-white text-sm font-black shadow-lg shadow-amber-500/20 hover:bg-amber-600 hover:-translate-y-0.5 transition-all">
                                    Lifetime Supporter ($49)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
