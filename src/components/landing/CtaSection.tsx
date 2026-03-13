import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
    return (
        <section className="py-24 md:py-32 px-4">
            <div className="reveal reveal-scale container max-w-4xl mx-auto text-center space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Start your Quran journey<br />today — for free.
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Start free with reading, memorization, and khatam tools. Upgrade later only if you want deeper Pro support.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/app" className="inline-flex items-center justify-center gap-2 h-13 rounded-full bg-foreground text-background px-10 py-3.5 text-base font-semibold hover:bg-foreground/90 transition-colors shadow">
                        Get Started Free <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
