import { Quote } from "lucide-react";

export function DailyInspiration() {
    return (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden group hover:border-primary/20 transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-primary transition-opacity group-hover:opacity-10">
                <Quote className="h-32 w-32 -rotate-6" />
            </div>
            <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Quote className="h-5 w-5" />
            </div>
            <div className="space-y-3 flex-1 z-10 w-full text-center md:text-left">
                <p className="text-xl md:text-2xl font-serif text-foreground/90 font-medium leading-loose md:leading-loose" dir="rtl">
                    فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا
                </p>
                <div className="space-y-1">
                    <p className="text-sm font-medium italic text-muted-foreground">
                        &quot;For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.&quot;
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider pt-1">
                        — Surah Ash-Sharh (94:5-6)
                    </p>
                </div>
            </div>
        </div>
    );
}
