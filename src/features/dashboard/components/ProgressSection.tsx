import Link from "next/link";
import { Target, Calendar, ChevronRight } from "lucide-react";
import type { DashboardProgressCard } from "@/features/dashboard/types";

interface ProgressSectionProps {
    isNewUser: boolean;
    memorizationCard: DashboardProgressCard | null;
    khatamCard: DashboardProgressCard | null;
}

export function ProgressSection({ isNewUser, memorizationCard, khatamCard }: ProgressSectionProps) {
    return (
        <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold px-1">Your Progress</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {/* Memorization Progress */}
                {isNewUser || !memorizationCard ? (
                    <div className="group flex flex-col justify-center items-center text-center rounded-3xl border border-dashed border-border bg-card/50 p-6 md:p-8 hover:bg-card hover:border-emerald-500/30 transition-all min-h-[240px]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                            <Target className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Start Memorizing</h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-[200px]">
                            Set a daily target and track your Quran memorization journey.
                        </p>
                        <Link href="/app/memorize" className="inline-flex h-10 items-center justify-center rounded-full bg-emerald-500/10 px-6 text-sm font-semibold text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all">
                            Set Target
                        </Link>
                    </div>
                ) : (
                    <Link href="/app/memorize" className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner">
                                    <Target className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">Memorization</h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                        <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span> Active Target
                                    </p>
                                </div>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50/50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <ChevronRight className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{memorizationCard.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{memorizationCard.subtitle}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-emerald-600">{memorizationCard.progressPct}%</p>
                                </div>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-in-out relative"
                                    style={{ width: `${memorizationCard.progressPct}%` }}
                                >
                                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
                                <span className="text-muted-foreground">{memorizationCard.targetLabel}</span>
                                <span className="font-medium text-emerald-600 px-2 py-0.5 rounded bg-emerald-50">{memorizationCard.statusLabel}</span>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Khatam Tracker */}
                {isNewUser || !khatamCard ? (
                    <div className="group flex flex-col justify-center items-center text-center rounded-3xl border border-dashed border-border bg-card/50 p-6 md:p-8 hover:bg-card hover:border-orange-500/30 transition-all min-h-[240px]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 mb-4">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Start a Khatam Plan</h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-[200px]">
                            Plan your reading to completely finish the Quran in your preferred time.
                        </p>
                        <Link href="/app/tracker" className="inline-flex h-10 items-center justify-center rounded-full bg-orange-500/10 px-6 text-sm font-semibold text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                            Create Plan
                        </Link>
                    </div>
                ) : (
                    <Link href="/app/tracker" className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm hover:shadow-md hover:border-orange-500/30 transition-all">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 shadow-inner">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">Khatam Progress</h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                        <span className="flex h-2 w-2 rounded-full bg-orange-500"></span> Ramadan Plan
                                    </p>
                                </div>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50/50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                <ChevronRight className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{khatamCard.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{khatamCard.subtitle}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-orange-500">{khatamCard.progressPct}%</p>
                                </div>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                                <div
                                    className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-in-out relative"
                                    style={{ width: `${khatamCard.progressPct}%` }}
                                >
                                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
                                <span className="text-muted-foreground">{khatamCard.targetLabel}</span>
                                <span className="font-medium text-orange-500 px-2 py-0.5 rounded bg-orange-50">{khatamCard.statusLabel}</span>
                            </div>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}
