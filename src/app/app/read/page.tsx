import { BookOpen } from "lucide-react";

export default function ReadQuranPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 flex h-16 items-center border-b border-border bg-background/80 px-6 backdrop-blur-md">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" /> Read Quran
        </h1>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex bg-muted rounded-full p-1">
            <button className="px-4 py-1.5 text-sm font-medium rounded-full bg-background shadow-sm">Surah</button>
            <button className="px-4 py-1.5 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground">Juz</button>
          </div>
          <input 
            type="text" 
            placeholder="Search surah..." 
            className="h-9 w-64 rounded-full border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(114)].map((_, i) => (
            <div key={i} className="group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">Al-Fatihah</h3>
                  <p className="text-xs text-muted-foreground">The Opener • 7 Verses</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold font-serif opacity-80 group-hover:opacity-100 transition-opacity">الفاتحة</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
