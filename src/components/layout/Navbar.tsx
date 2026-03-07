import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
    return (
        <>
            <header className="sticky top-4 z-50 flex justify-center px-4">
                <div className="w-full max-w-5xl flex items-center justify-between rounded-2xl border border-border bg-card/80 backdrop-blur-md px-5 py-3 shadow-sm">
                    <Link href="/" className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span className="text-lg font-bold tracking-tight">Qurafy</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
                        <Link href="#preview" className="hover:text-foreground transition-colors">Preview</Link>
                        <Link href="/app/read" className="hover:text-foreground transition-colors">Quran</Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="hidden sm:block text-sm font-medium border border-border rounded-full px-4 py-2 hover:bg-muted transition-colors">
                            Login
                        </Link>
                        <Link href="/app" className="flex items-center gap-1.5 text-sm font-semibold bg-foreground text-background rounded-full px-4 py-2 hover:bg-foreground/90 transition-colors">
                            Register <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Fixed Theme Toggle (bottom-right) */}
            <ThemeToggle showLabel={true} className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full border border-border bg-card/80 backdrop-blur-md text-muted-foreground hover:bg-muted hover:text-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all" />
        </>
    );
}
