import { CheckCircle2, MoreVertical, PlayCircle, Target } from "lucide-react";

export default function MemorizePage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" /> Memorization
        </h2>
        <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-sm">
          New Goal
        </button>
      </div>

      {/* Progress Overview Card */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="space-y-4 flex-1 text-center md:text-left">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Active Goal
          </div>
          <div>
            <h3 className="text-2xl font-bold">Juz 30 (Amma)</h3>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Target completion: 30 Days • 14 days remaining
            </p>
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5 mt-4">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: "55%" }}></div>
          </div>
          <p className="text-xs text-muted-foreground text-right pl-2">55% Completed (310/564 Ayahs)</p>
        </div>
        
        {/* Placeholder for Circular Progress or Illustration */}
        <div className="hidden md:flex relative h-32 w-32 items-center justify-center rounded-full border-8 border-secondary border-t-primary border-r-primary">
          <div className="text-2xl font-bold text-primary">55%</div>
        </div>
      </div>

      {/* Today's Target */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Today's Target: Surah An-Naba, 1-10</h3>
        <p className="text-muted-foreground mb-6 text-sm">Memorize and review these verses. Check them off as you complete them.</p>

        <div className="space-y-4">
          {[
            { a: "عَمَّ يَتَسَآءَلُونَ", t: "What are they asking one another about?", n: 1, checked: true },
            { a: "عَنِ ٱلنَّبَإِ ٱلْعَظِيمِ", t: "About the great news,", n: 2, checked: true },
            { a: "ٱلَّذِى هُمْ فِيهِ مُخْتَلِفُونَ", t: "over which they disagree.", n: 3, checked: false },
            { a: "كَلَّا سَيَعْلَمُونَ", t: "No! They will come to know.", n: 4, checked: false },
          ].map((verse, i) => (
            <div 
              key={i} 
              className={`flex items-start md:items-center gap-4 rounded-xl border p-4 transition-colors ${
                verse.checked 
                  ? "border-primary/50 bg-primary/5 opacity-70" 
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <button className="mt-1 md:mt-0 flex-shrink-0 text-muted-foreground hover:text-primary transition-colors">
                <CheckCircle2 className={`h-6 w-6 ${verse.checked ? "text-primary fill-primary/20" : ""}`} />
              </button>
              
              <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
                    78:{verse.n}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground max-w-md hidden md:block">
                    {verse.t}
                  </div>
                </div>
                
                <div className="text-right text-2xl font-serif font-bold text-foreground/90 pb-2 md:pb-0" dir="rtl">
                  {verse.a}
                </div>
                
                <div className="text-sm md:text-base text-muted-foreground block md:hidden mt-2">
                  {verse.t}
                </div>
              </div>
              
              <div className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                <button className="rounded-full p-2 hover:bg-muted text-muted-foreground hover:text-foreground">
                  <PlayCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
