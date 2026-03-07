"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Search,
    X,
    Book,
    Target,
    Calendar,
    Command,
    ArrowRight,
    Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data for search results
const QUICK_LINKS = [
    { id: "read", title: "Read Quran", icon: Book, href: "/app/read", category: "App" },
    { id: "memorize", title: "Memorization", icon: Target, href: "/app/memorize", category: "App" },
    { id: "tracker", title: "Khatam Tracker", icon: Calendar, href: "/app/tracker", category: "App" },
];

const SURAHS = [
    { n: 1, en: "Al-Fatihah", ar: "الفاتحة", href: "/app/read/surah-1" },
    { n: 18, en: "Al-Kahf", ar: "الكهف", href: "/app/read/surah-18" },
    { n: 36, en: "Ya-Sin", ar: "يس", href: "/app/read/surah-36" },
    { n: 67, en: "Al-Mulk", ar: "الملك", href: "/app/read/surah-67" },
];

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    // Handle shortcut (CMD+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const navigate = useCallback((href: string) => {
        setIsOpen(false);
        setQuery("");
        router.push(href);
    }, [router]);

    if (!isOpen) return null;

    const filteredLinks = QUICK_LINKS.filter(l => l.title.toLowerCase().includes(query.toLowerCase()));
    const filteredSurahs = SURAHS.filter(s => s.en.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="fixed inset-0 z-100 flex items-start justify-center pt-20 px-4">
            <div
                className="absolute inset-0 bg-background/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={() => setIsOpen(false)}
            />

            <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl shadow-primary/10 overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300">
                {/* Search Input Area */}
                <div className="flex items-center gap-4 px-6 py-5 border-b border-border bg-muted/20">
                    <Search className="h-5 w-5 text-primary animate-pulse" />
                    <input
                        autoFocus
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search surahs, verses, or app features..."
                        className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-muted-foreground font-medium"
                    />
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:flex items-center gap-1 rounded px-1.5 py-0.5 border border-border bg-background text-[10px] font-bold text-muted-foreground uppercase">
                            ESC
                        </span>
                        <button onClick={() => setIsOpen(false)}>
                            <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto p-3 space-y-6">

                    {/* Recent / Suggested */}
                    {query === "" && (
                        <div className="space-y-4 p-3">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                <Sparkles className="h-3 w-3" /> Quick Access
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {QUICK_LINKS.map((link) => (
                                    <button
                                        key={link.id}
                                        onClick={() => navigate(link.href)}
                                        className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-muted/10 hover:bg-primary/5 hover:border-primary/20 transition-all group"
                                    >
                                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-background shadow-sm text-muted-foreground group-hover:text-primary transition-colors">
                                            <link.icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-xs font-bold">{link.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search Results */}
                    {(filteredLinks.length > 0 || filteredSurahs.length > 0) ? (
                        <div className="space-y-4 p-1">
                            {filteredLinks.length > 0 && (
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4 mb-2">Features</p>
                                    {filteredLinks.map((link) => (
                                        <button
                                            key={link.id}
                                            onClick={() => navigate(link.href)}
                                            className="w-full flex items-center justify-between p-3.5 px-4 rounded-xl hover:bg-primary/5 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary text-muted-foreground group-hover:text-primary transition-colors">
                                                    <link.icon className="h-5 w-5" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-bold group-hover:text-primary transition-colors">{link.title}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-black">{link.category}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {filteredSurahs.length > 0 && (
                                <div className="space-y-1 pt-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4 mb-2">Surahs</p>
                                    {filteredSurahs.map((s) => (
                                        <button
                                            key={s.n}
                                            onClick={() => navigate(s.href)}
                                            className="w-full flex items-center justify-between p-3.5 px-4 rounded-xl hover:bg-primary/5 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-background border border-border text-[10px] font-black text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-all">
                                                    {s.n}
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-bold group-hover:text-primary transition-colors">{s.en}</p>
                                                    <p className="text-xs text-muted-foreground">Quran Chapter {s.n}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-lg font-serif opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" dir="rtl">{s.ar}</span>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : query !== "" && (
                        <div className="py-20 flex flex-col items-center text-center space-y-4">
                            <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center">
                                <Search className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <div>
                                <p className="text-base font-bold">No results found for &quot;{query}&quot;</p>
                                <p className="text-sm text-muted-foreground max-w-xs mt-1">Try searching for a surah name (e.g. Al-Fatihah) or an app feature.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <span className="flex items-center gap-1"><Command className="h-3 w-3" /> K to Open</span>
                        <span className="flex items-center gap-1"><ArrowRight className="h-3 w-3 rotate-90" /> Navigate</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Qurafy Search</p>
                </div>
            </div>
        </div>
    );
}
