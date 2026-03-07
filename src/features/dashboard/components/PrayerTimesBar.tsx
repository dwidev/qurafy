import { MapPin, Compass } from "lucide-react";
import { prayerTimes } from "@/features/dashboard/constants/mock-data";

export function PrayerTimesBar() {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-1 md:pr-4 rounded-4xl border border-border bg-card shadow-sm group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-3 bg-secondary/50 rounded-full px-4 py-2 self-start md:self-auto w-full md:w-auto">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold truncate">Jakarta, ID</span>
                <div className="h-4 w-px bg-border/50 mx-1" />
                <Compass className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-bold">295° NW</span>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8 overflow-x-auto no-scrollbar py-1">
                {prayerTimes.map((p) => (
                    <div key={p.name} className="flex flex-col items-center min-w-[50px]">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${p.active ? "text-primary" : "text-muted-foreground"}`}>{p.name}</span>
                        <span className={`text-sm font-black ${p.active ? "text-foreground" : "text-muted-foreground/60"}`}>{p.time}</span>
                        {p.active && <div className="h-1 w-4 bg-primary rounded-full mt-1 animate-pulse" />}
                    </div>
                ))}
            </div>
        </div>
    );
}
