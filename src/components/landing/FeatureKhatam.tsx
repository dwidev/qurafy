import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    Calendar,
    CheckCircle,
} from "lucide-react";

export function FeatureKhatam() {
    return (
        <section className="relative py-20 md:py-28 px-4 overflow-hidden bg-linear-to-br from-orange-950/30 via-card to-card dark:from-orange-950/20 dark:via-background dark:to-background">
            {/* Decorative floating orbs */}
            <div className="absolute top-10 -left-10 w-72 h-72 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-60 h-60 bg-amber-500/8 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-orange-400/5 dark:bg-orange-400/3 rounded-full blur-3xl pointer-events-none" />
            <div className="container relative z-10 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    {/* text side */}
                    <div className="reveal reveal-left space-y-6">
                        <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-700 dark:text-orange-400">
                            <Calendar className="h-3.5 w-3.5 mr-1.5" /> Khatam Tracker
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                            Finish the Quran<br />on your schedule.
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Whether you want to finish in 30 days for Ramadan or 90 days at your own pace, Qurafy calculates your exact daily reading target and keeps you on track.
                        </p>
                        <ul className="space-y-3">
                            {[
                                [Calendar, "Set any Khatam timeline"],
                                [BookOpen, "Daily Surah & verse range guidance"],
                                [CheckCircle, "One-tap progress check-off"],
                            ].map(([Icon, text]) => (
                                <li key={text as string} className="flex items-center gap-3 text-sm font-medium">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/10">
                                        <Icon className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                                    </div>
                                    {text as string}
                                </li>
                            ))}
                        </ul>
                        <Link href="/app/tracker" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                            Plan your Khatam <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {/* image side */}
                    <div className="reveal reveal-right reveal-d2 relative">
                        <div className="absolute -inset-4 rounded-3xl bg-orange-500/5 -z-10" />
                        <div className="relative rounded-2xl shadow-xl border border-border bg-card p-6 md:p-8 overflow-hidden w-full min-h-[400px] flex flex-col justify-center">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl opacity-60 z-0" />
                            <div className="relative z-10 flex flex-col gap-4 pointer-events-none select-none">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                                            <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-lg leading-tight">Ramadan Plan</span>
                                            <p className="text-xs text-muted-foreground mt-0.5">30 days to completion</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-orange-600 dark:text-orange-400">Juz 8</span>
                                        <p className="text-xs text-muted-foreground mt-0.5">Day 8 / 30</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2 mb-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-foreground">Overall Progress</span>
                                        <span className="text-orange-600 dark:text-orange-400">26%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                                        <div className="h-full bg-orange-500 rounded-full w-[26%]"></div>
                                    </div>
                                </div>

                                {/* Daily Target */}
                                <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-sm">Today&apos;s Target</h4>
                                        <span className="rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2.5 py-0.5 text-xs font-medium">12 Pages Left</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between group border border-border/50 rounded-lg p-3 bg-secondary/30">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-card border border-border text-[10px] text-muted-foreground">
                                                    1
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Al-An&apos;am (6:111 - 6:140)</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">Pages 142 - 146</p>
                                                </div>
                                            </div>
                                            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-orange-500/50 text-orange-500 bg-orange-500/10">
                                                <CheckCircle className="h-3 w-3" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between group border border-border/50 rounded-lg p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-[10px] text-muted-foreground">
                                                    2
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Al-An&apos;am (6:141 - 6:165)</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">Pages 147 - 150</p>
                                                </div>
                                            </div>
                                            <div className="h-5 w-5 rounded-full border border-border bg-card" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
