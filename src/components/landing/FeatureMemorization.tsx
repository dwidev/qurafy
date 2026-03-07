import Link from "next/link";
import {
    ArrowRight,
    Target,
    CheckCircle,
    BarChart2,
    Calendar,
    Play,
} from "lucide-react";

export function FeatureMemorization() {
    return (
        <section className="relative py-20 md:py-28 px-4 overflow-hidden bg-linear-to-bl from-emerald-950/30 via-card to-card dark:from-emerald-950/20 dark:via-background dark:to-background">
            {/* Decorative floating orbs */}
            <div className="absolute top-20 right-0 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-64 h-64 bg-teal-500/8 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-400/5 dark:bg-emerald-400/3 rounded-full blur-3xl pointer-events-none" />
            <div className="container relative z-10 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    {/* image side */}
                    <div className="reveal reveal-left reveal-d2 relative order-2 md:order-1">
                        <div className="absolute -inset-4 rounded-3xl bg-emerald-500/5 -z-10" />
                        <div className="relative rounded-2xl shadow-xl border border-border bg-card p-6 md:p-8 overflow-hidden w-full min-h-[400px] flex flex-col justify-center">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl opacity-60 z-0" />
                            <div className="relative z-10 flex flex-col">
                                {/* Header */}
                                <div className="flex items-center gap-2 mb-4 pointer-events-none">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                                        <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-lg leading-tight">Memorization</span>
                                        <p className="text-xs text-muted-foreground mt-0.5">Track your progress</p>
                                    </div>
                                </div>

                                {/* Active Goal */}
                                <div className="rounded-xl border border-border bg-linear-to-br from-card to-emerald-500/5 p-4 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-14 h-14 shrink-0">
                                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                                <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="12" className="text-secondary" />
                                                <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor"
                                                    strokeWidth="12" className="text-emerald-500" strokeDasharray="180 276.46" strokeLinecap="round" />
                                            </svg>
                                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold mt-1">65%</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" /> Active Goal
                                            </div>
                                            <h4 className="font-bold text-sm truncate">Surah An-Naba</h4>
                                            <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                                                <span>Day 16 of 30</span>
                                                <span className="font-medium text-emerald-600 dark:text-emerald-400">26/40 verses</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Today's Target Card */}
                                <div className="relative group rounded-xl border border-border bg-linear-to-br from-card to-background p-4 shadow-md flex items-center justify-between gap-4 mt-3">
                                    <div className="space-y-1">
                                        <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-muted-foreground mb-1">
                                            <Calendar className="h-3 w-3" /> Today
                                        </div>
                                        <h5 className="font-bold text-sm">Verses 27–30</h5>
                                        <p className="text-xs text-muted-foreground">4 verses • 3× reps</p>
                                    </div>
                                    <button className="h-12 w-12 rounded-full bg-emerald-500 text-white shadow-lg flex items-center justify-center shrink-0 transition-transform hover:scale-105 active:scale-95">
                                        <Play className="h-5 w-5 ml-1 fill-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* text side */}
                    <div className="reveal reveal-right space-y-6 order-1 md:order-2">
                        <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                            <Target className="h-3.5 w-3.5 mr-1.5" /> Memorization Planner
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                            Memorize smarter,<br />not harder.
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Pick any Surah or Juz to memorize, set your target deadline, and Qurafy automatically creates a daily verse plan — breaking impossible goals into simple daily check-offs.
                        </p>
                        <ul className="space-y-3">
                            {[
                                [Target, "Customizable memorization goals"],
                                [CheckCircle, "Daily verse check-off"],
                                [BarChart2, "Visual progress tracking"],
                            ].map(([Icon, text]) => (
                                <li key={text as string} className="flex items-center gap-3 text-sm font-medium">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10">
                                        <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    {text as string}
                                </li>
                            ))}
                        </ul>
                        <Link href="/app/memorize" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                            Start your plan <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
