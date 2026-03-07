import Link from "next/link";
import { History } from "lucide-react";
import type { RecentActivityItem } from "@/types";

interface RecentActivityProps {
    items: RecentActivityItem[];
}

export function RecentActivity({ items }: RecentActivityProps) {
    const hasNoItems = items.length === 0;

    return (
        <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-bold">Jump Back In</h2>
                <Link href="/app/read" className="text-sm text-primary hover:underline font-medium">View History</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                {hasNoItems ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-10 px-4 text-center rounded-3xl border border-dashed border-border bg-card/50">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground mb-3">
                            <History className="h-6 w-6" />
                        </div>
                        <p className="text-base font-semibold text-foreground">No recent activity</p>
                        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                            Your reading history will appear here once you start exploring the Quran.
                        </p>
                    </div>
                ) : (
                    items.map((item) => (
                        <Link key={`${item.surah}-${item.time}`} href="/app/read" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-md transition-all group">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <History className="h-5 w-5" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-semibold text-sm truncate">{item.surah}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs text-muted-foreground truncate mr-2">{item.verse}</p>
                                    <p className="text-[10px] text-muted-foreground/50 whitespace-nowrap font-medium">{item.time}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
