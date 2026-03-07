import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border bg-card py-10">
            <div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-bold text-lg">Qurafy.io</span>
                </div>
                <p className="text-sm text-muted-foreground">Built for better Quran habits. © 2026 Qurafy.</p>
                <div className="flex gap-5 text-sm text-muted-foreground">
                    <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
                    <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
                </div>
            </div>
        </footer>
    );
}
