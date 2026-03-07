import {
    Flame,
    Clock,
    BookOpen,
    TrendingUp,
    Target,
    Calendar,
    ChevronRight,
} from "lucide-react";

export function HeroMockup() {
    const stats = [
        { icon: Flame, label: "Current Streak", value: "16 Days", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
        { icon: Clock, label: "Time Read", value: "14h 20m", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10" },
        { icon: BookOpen, label: "Verses Read", value: "1,240", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
        { icon: TrendingUp, label: "Weekly Goal", value: "80%", color: "text-primary", bg: "bg-primary/10" },
    ];

    return (
        <section id="preview" className="flex justify-center px-4 pb-24">
            <div className="reveal reveal-scale relative w-full max-w-5xl">
                {/* Glow */}
                <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-primary/10 via-primary/5 to-transparent blur-3xl -z-10 scale-110" />
                <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden pointer-events-none select-none">
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/50">
                        <div className="h-3 w-3 rounded-full bg-red-400" />
                        <div className="h-3 w-3 rounded-full bg-yellow-400" />
                        <div className="h-3 w-3 rounded-full bg-green-400" />
                        <div className="flex-1 mx-4 h-6 rounded-md bg-secondary flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">qurafy.io/app</span>
                        </div>
                    </div>
                    <div className="p-6 md:p-8 bg-background flex flex-col gap-8 md:gap-10">
                        {/* Quick Stats Mock */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {stats.map(({ icon: Icon, label, value, color, bg }) => (
                                <div key={label} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3 shadow-sm">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                                        <Icon className={`h-5 w-5 ${color}`} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground leading-none">{label}</p>
                                        <p className="text-lg font-bold leading-tight mt-0.5">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Active Goals & Progress Mock */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold px-1">Your Progress</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Memorization Progress */}
                                <div className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 shadow-inner">
                                                <Target className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg leading-tight">Memorization</h3>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                    <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span> Active Target
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50/50 dark:bg-emerald-500/5 text-emerald-600">
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Surah An-Naba</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">Verses 1-15 memorized</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-emerald-600">38%</p>
                                            </div>
                                        </div>
                                        <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full w-[38%] relative">
                                                <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
                                            <span className="text-muted-foreground">Daily Goal: 5 Verses</span>
                                            <span className="font-medium text-emerald-600 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10">On Track</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Khatam Tracker */}
                                <div className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 shadow-inner">
                                                <Calendar className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg leading-tight">Khatam Progress</h3>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                    <span className="flex h-2 w-2 rounded-full bg-orange-500"></span> Ramadan Plan
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50/50 dark:bg-orange-500/5 text-orange-500">
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Juz 8</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">Day 8 of 30</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-orange-500">26%</p>
                                            </div>
                                        </div>
                                        <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                                            <div className="h-full bg-orange-500 rounded-full w-[26%] relative">
                                                <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
                                            <span className="text-muted-foreground">Today&apos;s Target: 20 Pages</span>
                                            <span className="font-medium text-orange-500 px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-500/10">12 Pages Left</span>
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
