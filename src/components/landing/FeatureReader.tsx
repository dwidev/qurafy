import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    Globe,
    Headphones,
    Bookmark,
} from "lucide-react";

export function FeatureReader() {
    return (
        <section id="features" className="relative py-20 md:py-28 px-4 overflow-hidden bg-gradient-to-br from-blue-950/40 via-card to-card dark:from-blue-950/30 dark:via-background dark:to-background">
            {/* Decorative floating orbs */}
            <div className="absolute top-10 -left-20 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-0 w-56 h-56 bg-indigo-500/8 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 dark:bg-blue-400/3 rounded-full blur-3xl pointer-events-none" />
            <div className="container relative z-10 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    {/* text side */}
                    <div className="reveal reveal-left space-y-6">
                        <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                            <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Beautiful Reader
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                            Read with clarity,<br />in any language.
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Authentic Uthmani script beautifully rendered. Toggle translations in your language, play audio for any verse, and bookmark your last position — across all your devices.
                        </p>
                        <ul className="space-y-3">
                            {[
                                [Globe, "Multi-language translations"],
                                [Headphones, "Verse-by-verse audio playback"],
                                [Bookmark, "Sync bookmarks via Supabase"],
                            ].map(([Icon, text]) => (
                                <li key={text as string} className="flex items-center gap-3 text-sm font-medium">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10">
                                        <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    {text as string}
                                </li>
                            ))}
                        </ul>
                        <Link href="/app/read" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                            Open the Reader <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {/* image side */}
                    <div className="reveal reveal-right reveal-d2 relative">
                        <div className="absolute -inset-4 rounded-3xl bg-blue-500/5 -z-10" />
                        <div className="relative rounded-2xl shadow-xl border border-border bg-card p-6 md:p-8 overflow-hidden w-full min-h-[400px] flex flex-col justify-center">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-60 z-0" />
                            <div className="relative z-10 flex flex-col gap-4 pointer-events-none select-none">
                                {/* Header */}
                                <div className="flex items-center gap-3 border-b border-border pb-4 mb-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-lg leading-tight">Surah Al-Kahf</span>
                                        <p className="text-xs text-muted-foreground mt-0.5">Verses 1-10</p>
                                    </div>
                                </div>

                                {/* Ayah 1 */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground mt-1">
                                            1
                                        </div>
                                        <p className="text-2xl font-serif text-right leading-loose" dir="rtl">
                                            ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَٰبَ وَلَمْ يَجْعَل لَّهُۥ عِوَجًا ۜ
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground pl-12 leading-relaxed">
                                        [All] praise is [due] to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.
                                    </p>
                                </div>

                                {/* Ayah 2 */}
                                <div className="space-y-3 pt-4 border-t border-border/50">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground mt-1">
                                            2
                                        </div>
                                        <p className="text-2xl font-serif text-right leading-loose" dir="rtl">
                                            قَيِّمًا لِّيُنذِرَ بَأْسًا شَدِيدًا مِّن لَّدُنْهُ وَيُبَشِّرَ ٱلْمُؤْمِنِينَ ٱلَّذِينَ يَعْمَلُونَ ٱلصَّٰلِحَٰتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground pl-12 leading-relaxed">
                                        [He has made it] straight, to warn of severe punishment from Him and to give good tidings to the believers who do righteous deeds that they will have a good reward.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
