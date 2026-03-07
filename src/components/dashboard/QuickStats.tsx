import { quickStats } from "@/constants/mock-data";

interface QuickStatsProps {
    isNewUser: boolean;
}

export function QuickStats({ isNewUser }: QuickStatsProps) {
    const stats = quickStats(isNewUser);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${bg}`}>
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
