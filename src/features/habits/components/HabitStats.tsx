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
      bgTone: "bg-emerald-500/10",
      glow: "bg-emerald-500",
    },
    {
      label: "Perfect streak",
      value: `${summary.currentStreak}d`,
      hint: `Best ${summary.bestStreak} days`,
      icon: Flame,
      tone: "text-amber-500",
      bgTone: "bg-amber-500/10",
      glow: "bg-amber-500",
    },
    {
      label: "Consistency",
      value: `${summary.consistencyScore}%`,
      hint: "Last 7 days",
      icon: Sparkles,
      tone: "text-rose-500",
      bgTone: "bg-rose-500/10",
      glow: "bg-rose-500",
    },
    {
      label: "Check-ins",
      value: `${summary.totalCheckIns}`,
      hint: "Completed entries",
      icon: Activity,
      tone: "text-blue-500",
      bgTone: "bg-blue-500/10",
      glow: "bg-blue-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className="flex items-center gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.bgTone} ${card.tone}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-bold tracking-tight text-foreground leading-none mb-1">{card.value}</p>
              <p className="text-[11px] font-medium text-muted-foreground">{card.hint}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
