import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LandingCursor } from "@/components/shared/LandingCursor";
import ScrollAnimator from "@/components/shared/ScrollAnimator";
import { StarryBackground } from "@/components/shared/StarryBackground";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="landing-cursor-area flex min-h-screen flex-col overflow-x-hidden bg-background font-sans text-foreground">
            <LandingCursor />
            <StarryBackground />
            <ScrollAnimator />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
