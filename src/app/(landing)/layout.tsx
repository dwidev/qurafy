import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ScrollAnimator from "@/components/shared/ScrollAnimator";
import { StarryBackground } from "@/components/shared/StarryBackground";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
            <StarryBackground />
            <ScrollAnimator />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
