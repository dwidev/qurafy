ALTER TABLE "memorization_goals" ADD COLUMN "completed_days" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "memorization_goals" ADD COLUMN "completed_verses" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE "memorization_goals" mg
SET
  "completed_days" = COALESCE(src.completed_days, 0),
  "completed_verses" = COALESCE(src.completed_verses, 0)
FROM (
  SELECT
    "goal_id",
    COUNT(DISTINCT "day_number") FILTER (WHERE "is_completed" = true)::integer AS completed_days,
    COALESCE(SUM("verses_count") FILTER (WHERE "is_completed" = true), 0)::integer AS completed_verses
  FROM "memorization_progress"
  GROUP BY "goal_id"
) AS src
WHERE src."goal_id" = mg."id";--> statement-breakpoint
UPDATE "memorization_goals"
SET "completed_days" = GREATEST(0, LEAST("completed_days", LEAST("target_days", "total_verses")));--> statement-breakpoint
UPDATE "memorization_goals"
SET "completed_verses" = GREATEST(0, LEAST("completed_verses", "total_verses"));--> statement-breakpoint
UPDATE "memorization_goals"
SET "status" = 'completed'
WHERE "completed_days" >= LEAST("target_days", "total_verses");--> statement-breakpoint
DELETE FROM "memorization_progress";
