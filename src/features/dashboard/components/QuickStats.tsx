import { quickStats as quickStatsTemplate } from "@/features/dashboard/constants/mock-data";
import type { DashboardQuickStats } from "@/features/dashboard/types";

interface QuickStatsProps {
    stats: DashboardQuickStats;
    isNewUser: boolean;
}

export function QuickStats({ stats, isNewUser }: QuickStatsProps) {
    const items = quickStatsTemplate(isNewUser).map((item) => {
        if (item.label === "Current Streak") {
            return { ...item, value: `${stats.streakDays} Days` };
        }
        if (item.label === "Time Read") {
            return { ...item, value: stats.timeReadLabel };
        }
        if (item.label === "Verses Read") {
            return { ...item, value: stats.versesRead.toLocaleString() };
        }
        if (item.label === "Weekly Goal") {
            return { ...item, value: `${stats.weeklyGoalPct}%` };
        }
        return item;
    });

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {items.map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                        <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground leading-none">{label}</p>
                        <p className="text-lg font-bold leading-tight mt-0.5">{value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
