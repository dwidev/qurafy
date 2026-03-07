import Link from "next/link";
import { ArrowRight, CheckCircle, Heart } from "lucide-react";
import { socialProofStats } from "@/constants/mock-data";

export function HeroSection() {
    return (
        <section className="flex flex-col items-center text-center px-4 pt-20 pb-8 md:pt-28 md:pb-12">
            {/* pill badge */}
            <div className="reveal reveal-up inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                Free to use — no ads, no distractions
            </div>

            {/* headline */}
            <h1 className="reveal reveal-up reveal-d1 text-5xl md:text-7xl font-bold tracking-tighter max-w-3xl leading-tight text-foreground">
                Read. Memorize.<br />
                <span className="text-primary">Complete the Quran.</span>
            </h1>

            {/* subtext */}
            <p className="reveal reveal-up reveal-d2 mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                Qurafy helps you build daily reading and memorization habits with automated planners, beautiful Uthmani script, and seamless progress tracking.
            </p>

            {/* CTAs */}
            <div className="reveal reveal-up reveal-d3 flex flex-col sm:flex-row gap-3 mt-8">
                <Link href="/app" className="inline-flex items-center justify-center gap-2 h-12 rounded-full bg-foreground text-background px-8 text-sm font-semibold hover:bg-foreground/90 transition-colors shadow">
                    Get Started — it&apos;s free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="#pricing" className="inline-flex items-center justify-center gap-2 h-12 rounded-full border border-input bg-card px-8 text-sm font-medium hover:bg-muted transition-colors shadow-sm">
                    <Heart className="h-4 w-4 text-rose-500 fill-rose-500/20" /> Support our Mission
                </Link>
            </div>

            {/* social proof stats */}
            <div className="reveal reveal-up reveal-d4 flex items-center gap-6 mt-8 text-sm text-muted-foreground">
                {socialProofStats.map(([n, l]) => (
                    <div key={l} className="flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span><strong className="text-foreground">{n}</strong> {l}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
