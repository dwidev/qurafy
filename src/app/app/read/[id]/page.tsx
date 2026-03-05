import { ArrowLeft, Bookmark, PlayCircle, Settings, Share2 } from "lucide-react";
import Link from "next/link";

export default function SurahReaderPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/app/read" className="rounded-full p-2 hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold leading-tight">Al-Fatihah</h1>
            <p className="text-xs text-muted-foreground">The Opener • 7 Verses</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 hover:bg-muted transition-colors">
            <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      </div>

      {/* Bismillah */}
      <div className="py-8 text-center text-3xl font-serif text-foreground/90 font-bold border-b border-border/40">
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </div>

      {/* Verses */}
      <div className="flex-1 overflow-auto p-4 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
        {/* Verse 1 */}
        <div className="group rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              1:1
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="rounded-full p-2 hover:bg-muted hover:text-primary transition-colors">
                <PlayCircle className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 hover:bg-muted hover:text-primary transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 hover:bg-muted hover:text-primary transition-colors">
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="text-right text-4xl md:text-5xl font-serif leading-[2.5] mb-8 text-foreground/90 font-bold" dir="rtl">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </div>
          <div className="text-lg text-muted-foreground leading-relaxed">
            In the Name of Allah—the Most Compassionate, Most Merciful.
          </div>
        </div>

        {/* Verse 2 */}
        <div className="group rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              1:2
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="rounded-full p-2 hover:bg-muted hover:text-primary transition-colors">
                <PlayCircle className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 hover:bg-muted hover:text-primary transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 hover:bg-muted hover:text-primary transition-colors">
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="text-right text-4xl md:text-5xl font-serif leading-[2.5] mb-8 text-foreground/90 font-bold" dir="rtl">
            ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ
          </div>
          <div className="text-lg text-muted-foreground leading-relaxed">
            All praise is for Allah—Lord of all worlds,
          </div>
        </div>

        {/* Verse 3 */}
        <div className="group rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              1:3
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="rounded-full p-2 hover:bg-muted hover:text-primary transition-colors">
                <PlayCircle className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 hover:bg-muted hover:text-primary transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 hover:bg-muted hover:text-primary transition-colors">
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="text-right text-4xl md:text-5xl font-serif leading-[2.5] mb-8 text-foreground/90 font-bold" dir="rtl">
            ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </div>
          <div className="text-lg text-muted-foreground leading-relaxed">
            the Most Compassionate, Most Merciful,
          </div>
        </div>
      </div>
    </div>
  );
}
