const MS_PER_DAY = 86_400_000;

export function startOfUtcDay(input: Date) {
  return new Date(Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate()));
}

export function addUtcDays(input: Date, days: number) {
  const next = new Date(input);
  next.setUTCDate(next.getUTCDate() + days);
  return startOfUtcDay(next);
}

export function toUtcDateKey(input: Date) {
  const normalized = startOfUtcDay(input);
  const year = normalized.getUTCFullYear();
  const month = String(normalized.getUTCMonth() + 1).padStart(2, "0");
  const day = String(normalized.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromUtcDateKey(dateKey: string) {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

function uniqueSortedDateKeys(dateKeys: string[]) {
  return Array.from(new Set(dateKeys)).sort((left, right) => left.localeCompare(right));
}

export function computeCurrentStreak(dateKeys: string[], anchorDate = new Date()) {
  const uniqueKeys = new Set(uniqueSortedDateKeys(dateKeys));
  let streak = 0;
  let cursor = startOfUtcDay(anchorDate);

  while (uniqueKeys.has(toUtcDateKey(cursor))) {
    streak += 1;
    cursor = addUtcDays(cursor, -1);
  }

  return streak;
}

export function computeBestStreak(dateKeys: string[]) {
  const uniqueKeys = uniqueSortedDateKeys(dateKeys);

  if (uniqueKeys.length === 0) {
    return 0;
  }

  let best = 1;
  let current = 1;

  for (let index = 1; index < uniqueKeys.length; index += 1) {
    const previous = fromUtcDateKey(uniqueKeys[index - 1]).getTime();
    const currentDate = fromUtcDateKey(uniqueKeys[index]).getTime();

    if (currentDate - previous === MS_PER_DAY) {
      current += 1;
      best = Math.max(best, current);
      continue;
    }

    current = 1;
  }

  return best;
}

export function buildStreakSummary(dateKeys: string[], anchorDate = new Date()) {
  const uniqueKeys = uniqueSortedDateKeys(dateKeys);
  const lastDateKey = uniqueKeys.at(-1) ?? null;

  return {
    currentStreak: computeCurrentStreak(uniqueKeys, anchorDate),
    bestStreak: computeBestStreak(uniqueKeys),
    lastCompletedAt: lastDateKey ? fromUtcDateKey(lastDateKey) : null,
  };
}
