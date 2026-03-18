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
      cardClass: "border-border/70 bg-card/80",
      iconClass: "border-emerald-500/15 bg-linear-to-br from-emerald-400/20 to-emerald-500/5 text-emerald-600",
      valueClass: "text-foreground",
    },
    {
      label: "Perfect streak",
      value: `${summary.currentStreak}d`,
      hint: `Best ${summary.bestStreak} days`,
      icon: Flame,
      cardClass: "border-border/70 bg-card/80",
      iconClass: "border-amber-500/15 bg-linear-to-br from-amber-400/20 to-amber-500/5 text-amber-600",
      valueClass: "text-foreground",
    },
    {
      label: "Consistency",
      value: `${summary.consistencyScore}%`,
      hint: "Last 7 days",
      icon: Sparkles,
      cardClass: "border-border/70 bg-card/80",
      iconClass: "border-violet-500/15 bg-linear-to-br from-violet-400/20 to-violet-500/5 text-violet-600",
      valueClass: "text-foreground",
    },
    {
      label: "Check-ins",
      value: `${summary.totalCheckIns}`,
      hint: "Completed entries",
      icon: Activity,
      cardClass: "border-border/70 bg-card/80",
      iconClass: "border-sky-500/15 bg-linear-to-br from-sky-400/20 to-sky-500/5 text-sky-600",
      valueClass: "text-foreground",
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className={`rounded-[1.75rem] border p-5 shadow-sm ${card.cardClass}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  {card.label}
                </p>
                <p className={`mt-4 text-3xl font-semibold tracking-tight ${card.valueClass}`}>{card.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${card.iconClass}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
