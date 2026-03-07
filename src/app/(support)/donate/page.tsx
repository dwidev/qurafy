"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Heart,
    ArrowRight,
    ChevronLeft,
    Calendar,
    Zap,
    Info,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { monthlyPresets, yearlyPresets } from "@/constants/mock-data";

export default function DonatePage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [amount, setAmount] = useState<string>("50000");
    const [customAmount, setCustomAmount] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const presets = billingCycle === "monthly" ? monthlyPresets : yearlyPresets;

    const handleDonate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert(`Redirecting to secure gateway for your ${billingCycle} subscription...`);
        }, 1500);
    };

    const displayAmount = customAmount || amount;
    const operationsAmount = Math.floor(Number(displayAmount) * 0.7);
    const socialAmount = Math.floor(Number(displayAmount) * 0.3);

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-6 selection:bg-rose-500/10 overflow-hidden relative">

            {/* ── MINIMAL BACKGROUND ──────────────────── */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-rose-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[15%] w-64 h-64 bg-rose-500/5 rounded-full blur-[120px]" />
            </div>

            {/* ── BACK BUTTON ─────────────────────────── */}
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 group text-muted-foreground hover:text-foreground transition-all z-20">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background shadow-sm hover:shadow-md transition-all">
                    <ChevronLeft className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">Exit</span>
            </Link>

            <div className="w-full max-w-[400px] flex flex-col items-center justify-center space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 relative z-10">

                {/* ── HEADER ────────────────────────────── */}
                <div className="text-center space-y-4">
                    <div className="inline-flex flex-col items-center gap-6">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-rose-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-card border border-border shadow-sm">
                                <Heart className="h-7 w-7 text-rose-500 fill-rose-500/10" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <h1 className="text-2xl font-black tracking-tight text-foreground">Qurafy Pro</h1>
                            <p className="text-[14px] text-muted-foreground font-medium leading-relaxed max-w-[300px] mx-auto text-balance">
                                Subscribe to sustain our <span className="text-rose-500 font-bold italic text-[13px] tracking-tight">ad-free mission</span> <br />
                                and automate your Sadaqah.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── DONATION CARD ─────────────────────── */}
                <div className="w-full bg-card border border-border/80 rounded-[2.5rem] p-8 shadow-2xl shadow-black/3 space-y-6">

                    <form onSubmit={handleDonate} className="space-y-6">

                        {/* Billing Toggle */}
                        <div className="flex p-1 bg-secondary/30 rounded-2xl w-full border border-border/50">
                            <button
                                type="button"
                                onClick={() => { setBillingCycle("monthly"); setAmount("50000"); }}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                                    billingCycle === "monthly" ? "bg-background shadow-sm text-foreground border border-border/50" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Calendar className="h-3.5 w-3.5" /> Monthly
                            </button>
                            <button
                                type="button"
                                onClick={() => { setBillingCycle("yearly"); setAmount("500000"); }}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all relative",
                                    billingCycle === "yearly" ? "bg-background shadow-sm text-foreground border border-border/50" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Zap className="h-3.5 w-3.5 text-amber-500" /> Yearly
                                <span className="absolute -top-2 -right-1.5 bg-rose-500 text-[6px] text-white px-1.5 py-0.5 rounded-full transform rotate-12 font-black shadow-lg shadow-rose-500/20 whitespace-nowrap">
                                    SAVE 17%
                                </span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Select Amount</label>
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-rose-500/70 uppercase tracking-tighter">
                                    <ShieldCheck className="h-2.5 w-2.5" /> Pro Tier
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {presets.map((p) => (
                                    <button
                                        key={p.value}
                                        type="button"
                                        onClick={() => { setAmount(p.value); setCustomAmount(""); }}
                                        className={cn(
                                            "h-14 rounded-2xl border-2 font-black text-sm transition-all duration-300 flex items-center justify-center gap-1.5",
                                            amount === p.value && !customAmount
                                                ? "bg-foreground text-background border-foreground shadow-lg shadow-foreground/10"
                                                : "bg-background border-border/50 hover:border-foreground/10 text-muted-foreground"
                                        )}
                                    >
                                        <span className="text-[9px] font-bold opacity-40">IDR</span> {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Input */}
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center text-[10px] font-bold tracking-widest text-muted-foreground/30 group-focus-within/input:text-rose-500 transition-colors uppercase">
                                IDR
                            </div>
                            <input
                                type="number"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                placeholder="Other amount"
                                className="w-full h-14 bg-secondary/20 border border-transparent focus:bg-background focus:border-rose-500/10 rounded-2xl pl-16 pr-6 text-sm font-black focus:outline-hidden transition-all placeholder:text-muted-foreground/40 text-foreground"
                            />
                        </div>

                        {/* Allocation Summary */}
                        {Number(displayAmount) > 0 && (
                            <div className="space-y-3.5">
                                <div className="bg-secondary/20 rounded-2xl p-4.5 space-y-3 border border-border/40">
                                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.15em] text-muted-foreground/50">
                                        <span>70/30 Model</span>
                                        <span className="text-rose-500 flex items-center gap-1 font-black">Pro Benefits</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="flex items-center gap-1.5 opacity-70"><Info className="h-3 w-3" /> Ops (70%)</span>
                                            <span>IDR {operationsAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-black text-rose-500">
                                            <span className="flex items-center gap-1.5"><Heart className="h-3 w-3 fill-rose-500/10" /> Social (30%)</span>
                                            <span>IDR {socialAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground/60 leading-relaxed px-1 text-center font-medium italic text-balance">
                                    &quot;70% sustains platform infrastructure while 30% flows to our humanitarian network.&quot;
                                </p>
                            </div>
                        )}

                        {/* Action Button */}
                        <button
                            type="submit"
                            disabled={isLoading || Number(displayAmount) <= 0}
                            className="w-full h-16 bg-rose-500 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/5 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:translate-y-0 group"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Activate Pro <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* ── FOOTER ─────────────────────────── */}
                <div className="text-center space-y-6">
                    <Link href="/sadaqah" className="inline-flex items-center gap-2.5 text-[11px] font-bold text-muted-foreground/60 transition-all hover:text-foreground group/link">
                        <Heart className="h-3.5 w-3.5 text-emerald-500" />
                        Looking for 100% Sadaqah? <span className="text-emerald-500 font-extrabold underline underline-offset-4 decoration-emerald-500/30 group-hover:decoration-emerald-500 transition-all ml-1 text-[10px]">Pure Sadaqah</span>
                    </Link>

                    <div className="flex items-center justify-center gap-4 text-[9px] text-muted-foreground/20 font-black uppercase tracking-[0.4em]">
                        <div className="h-px w-8 bg-current" />
                        DIGITAL EXCELLENCE
                        <div className="h-px w-8 bg-current" />
                    </div>
                </div>
            </div>
        </div>
    );
}
