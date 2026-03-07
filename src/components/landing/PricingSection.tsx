import Link from "next/link";
import {
    CheckCircle,
    Sparkles,
    Heart,
} from "lucide-react";

export function PricingSection() {
    return (
        <section id="pricing" className="py-24 md:py-32 px-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />

            <div className="container max-w-6xl mx-auto space-y-16">
                <div className="reveal reveal-up text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight">Support Our Mission</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
                        Qurafy is built by a small team dedicated to helping Muslims worldwide build better habits. Support us to keep the be app better.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* Pro Plan */}
                    <div className="reveal reveal-scale flex flex-col justify-between p-8 rounded-[2.5rem] border border-border bg-card shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 px-4 py-1.5 bg-secondary text-muted-foreground text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                            Sadaqah
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <Sparkles className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black">Qurafy Pro</h3>
                                <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-medium">Sustain the app and build a better future for the Ummah. 30% of your support goes directly to Sadaqah.</p>
                            </div>
                            <div className="flex items-baseline gap-1 pt-2">
                                <span className="text-4xl font-black">Any Amount</span>
                                <span className="text-muted-foreground text-sm font-bold">/ month</span>
                            </div>
                            <div className="space-y-3">
                                {[
                                    "Unlimited Memorization Goals",
                                    "Advanced Analytics & Charts",
                                    "Exclusive Premium Reciters",
                                    "Custom Theme Personalization",
                                    "Support our Mission",
                                ].map((feat) => (
                                    <div key={feat} className="flex items-center gap-3 text-sm font-bold">
                                        <CheckCircle className="h-4 w-4 text-primary" /> {feat}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Link href="/donate" className="w-full h-12 rounded-full border-2 border-primary/20 bg-primary/5 text-primary font-black text-sm hover:bg-primary hover:text-white transition-all mt-10 flex items-center justify-center">
                            Donate to Unlock Pro
                        </Link>
                    </div>

                    {/* Lifetime Supporter */}
                    <div className="reveal reveal-scale md:reveal-d2 flex flex-col justify-between p-8 rounded-[2.5rem] border-2 border-amber-500 bg-amber-500/5 shadow-2xl shadow-amber-500/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                            Lifetime
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                                <Heart className="h-7 w-7 fill-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black">Lifetime Supporter</h3>
                                <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-medium">Be a pillar of our community. A one-time fixed contribution for permanent founding status.</p>
                            </div>
                            <div className="flex items-baseline gap-1 pt-2">
                                <span className="text-4xl font-black">IDR 200K</span>
                                <span className="text-muted-foreground text-sm font-bold">/ year</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm font-bold">
                                    <CheckCircle className="h-4 w-4 text-amber-500" /> Everything in Pro Access
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold">
                                    <CheckCircle className="h-4 w-4 text-amber-500" /> Exclusive &apos;Founding&apos; Badge
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold">
                                    <CheckCircle className="h-4 w-4 text-amber-500" /> Private Discord Channel
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold">
                                    <CheckCircle className="h-4 w-4 text-amber-500" /> Future Beta Access
                                </div>
                            </div>
                        </div>
                        <Link href="/donate" className="w-full h-11 rounded-full bg-amber-500 text-white font-black text-xs hover:bg-amber-600 hover:shadow-xl hover:-translate-y-0.5 transition-all mt-10 flex items-center justify-center">
                            Become a Supporter
                        </Link>
                    </div>

                    {/* Direct Sadaqah */}
                    <div className="reveal reveal-scale md:reveal-d3 flex flex-col justify-between p-8 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                            Sadaqah
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                                <Heart className="h-7 w-7 fill-emerald-600/10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black">Direct Sadaqah</h3>
                                <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">100% Pure Charitable Gift. Every single IDR goes directly to those in need. No fees, no overhead.</p>
                            </div>
                            <div className="flex items-baseline gap-1 pt-2">
                                <span className="text-3xl font-black">100%</span>
                                <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">To Causes</span>
                            </div>
                            <div className="space-y-2">
                                {[
                                    "Mosque Construction",
                                    "Humanitarian Aid",
                                    "Islamic Education",
                                    "Purely Not-for-Profit",
                                ].map((feat) => (
                                    <div key={feat} className="flex items-center gap-2.5 text-xs font-bold">
                                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> {feat}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Link href="/sadaqah" className="w-full h-11 rounded-full border-2 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 font-black text-xs hover:bg-emerald-600 hover:text-white transition-all mt-10 flex items-center justify-center">
                            Donate Sadaqah
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
