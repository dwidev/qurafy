import { communityStats } from "@/constants/mock-data";

export function CommunityStats() {
    return (
        <section className="py-16 bg-background border-y border-border/40">
            <div className="container max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {communityStats.map(([num, label, delay]) => (
                        <div key={label} className={`reveal reveal-up ${delay} space-y-1`}>
                            <p className="text-4xl font-bold text-primary">{num}</p>
                            <p className="text-sm text-muted-foreground font-medium">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
