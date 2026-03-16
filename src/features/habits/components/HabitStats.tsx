import { Activity, CheckCircle2, Flame, Sparkles } from "lucide-react";
import type { HabitSummary } from "@/features/habits/types";

interface HabitStatsProps {
  summary: HabitSummary;
}

export function HabitStats({ summary }: HabitStatsProps) {
  const cards = [
    {
      label: "Today",
      value: `${summary.completedToday}/${summary.totalHabits}`,
      hint: `${summary.completionRateToday}% complete`,
      icon: CheckCircle2,
      tone: "text-emerald-500",
    },
    {
      label: "Perfect streak",
      value: `${summary.currentStreak}d`,
      hint: `Best ${summary.bestStreak} days`,
      icon: Flame,
      tone: "text-amber-500",
    },
    {
      label: "Consistency",
      value: `${summary.consistencyScore}%`,
      hint: "Last 7 days",
      icon: Sparkles,
      tone: "text-rose-500",
    },
    {
      label: "Check-ins",
      value: `${summary.totalCheckIns}`,
      hint: "Completed entries",
      icon: Activity,
      tone: "text-blue-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card p-5 shadow-sm"
          >
            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-secondary/60 blur-3xl" />
            <div className="relative space-y-5">
              <div className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] ${card.tone}`}>
                <Icon className="h-4 w-4" />
                {card.label}
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black tracking-tight text-foreground">{card.value}</p>
                <p className="text-sm font-medium text-muted-foreground">{card.hint}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
