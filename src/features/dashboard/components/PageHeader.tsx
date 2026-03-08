import { DashboardDateInfo } from "../types";

interface PageHeaderProps {
    displayName: string;
    dateInfo: DashboardDateInfo;
}

export function PageHeader({ displayName, dateInfo }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight flex items-center gap-2.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 shadow-inner">
                        <span className="text-primary text-xl">👋</span>
                    </span>
                    Assalamu&apos;alaikum, {displayName}
                </h1>
                <p className="text-sm text-muted-foreground mt-1.5 font-medium">
                    {dateInfo.gregorian} • {dateInfo.hijri}
                </p>
            </div>
        </div>
    );
}