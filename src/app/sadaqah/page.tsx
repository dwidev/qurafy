"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Heart,
    ArrowRight,
    ChevronLeft,
    HandHeart,
    CheckCircle2,
    Sparkles,
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SadaqahPage() {
    const [amount, setAmount] = useState<string>("50000");
    const [customAmount, setCustomAmount] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const presets = [
        { value: "20000", label: "20K" },
        { value: "50000", label: "50K" },
        { value: "100000", label: "100K" },
        { value: "500000", label: "500K" },
    ];

    const handleDonate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert("Alhamdulillah! 100% of your Sadaqah is being securely processed.");
        }, 1500);
    };

    const displayAmount = customAmount || amount;

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-6 selection:bg-emerald-500/10 overflow-hidden relative">

            {/* ── MINIMAL BACKGROUND ──────────────────── */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[15%] w-64 h-64 bg-emerald-500/10 rounded-full blur-[120px]" />
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
                            <div className="absolute -inset-4 bg-emerald-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-card border border-border shadow-sm">
                                <HandHeart className="h-7 w-7 text-foreground" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <h1 className="text-2xl font-black tracking-tight text-foreground">Pure Sadaqah</h1>
                            <p className="text-[14px] text-muted-foreground font-medium leading-relaxed max-w-[300px] mx-auto text-balance">
                                Your entire contribution goes directly <br />
                                to those in need, <span className="text-emerald-600 font-bold italic text-[13px] tracking-tight">no platform fees.</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── DONATION CARD ─────────────────────── */}
                <div className="w-full bg-card border border-border/80 rounded-[2.5rem] p-8 shadow-2xl shadow-black/[0.03] space-y-8">

                    <form onSubmit={handleDonate} className="space-y-8">

                        {/* Preset Selection - Unified Sizing */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Select Amount</label>
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600/70 uppercase tracking-tighter">
                                    <Shield className="h-2.5 w-2.5" /> 100% Impact
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
                                        <span className="text-[9px] font-bold opacity-40 mr-1">IDR</span>{p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Input - Unified Sizing */}
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center text-[10px] font-bold tracking-widest text-muted-foreground/30 group-focus-within/input:text-emerald-600 transition-colors uppercase">
                                IDR
                            </div>
                            <input
                                type="number"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                placeholder="Other amount"
                                className="w-full h-14 bg-secondary/20 border border-transparent focus:bg-background focus:border-foreground/10 rounded-2xl pl-16 pr-6 text-sm font-black focus:outline-hidden transition-all placeholder:text-muted-foreground/40 text-foreground"
                            />
                        </div>

                        {/* Summary Block - Adjusted to match Donate positioning/sizing */}
                        {Number(displayAmount) > 0 ? (
                            <div className="pt-2">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Total Pure Sadaqah</p>
                                        <p className="text-2xl font-black tracking-tight text-foreground">IDR {Number(displayAmount).toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5 pb-1">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/5 text-emerald-600/80 border border-emerald-500/10">
                                            <CheckCircle2 className="h-2.5 w-2.5" />
                                            <span className="text-[8px] font-black uppercase tracking-tighter">Zero Fees</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[52px]" /> /* Placeholder to maintain fixed layout height */
                        )}

                        {/* Action Button - Unified Sizing */}
                        <button
                            type="submit"
                            disabled={isLoading || Number(displayAmount) <= 0}
                            className="w-full h-16 bg-foreground text-background rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-foreground/5 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:translate-y-0 group"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            ) : (
                                <>
                                    Confirm Sadaqah <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* ── FOOTER ────────────────────────────── */}
                <div className="text-center space-y-6">
                    <Link href="/donate" className="inline-flex items-center gap-2.5 text-[11px] font-bold text-muted-foreground/60 transition-all hover:text-foreground group/link">
                        <Sparkles className="h-3.5 w-3.5 text-rose-500" />
                        Support the platform? <span className="text-rose-500 font-extrabold underline underline-offset-4 decoration-rose-500/30 group-hover:decoration-rose-500 transition-all ml-1 text-[10px]">Get Qurafy Pro</span>
                    </Link>

                    <div className="flex items-center justify-center gap-4 text-[9px] text-muted-foreground/20 font-black uppercase tracking-[0.4em]">
                        <div className="h-px w-8 bg-current" />
                        Qurafy Digital
                        <div className="h-px w-8 bg-current" />
                    </div>
                </div>
            </div>
        </div>
    );
}
