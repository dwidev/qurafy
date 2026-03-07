ALTER TABLE "memorization_progress" ADD COLUMN "day_number" integer;--> statement-breakpoint
ALTER TABLE "memorization_progress" ADD COLUMN "start_verse" integer;--> statement-breakpoint
ALTER TABLE "memorization_progress" ADD COLUMN "end_verse" integer;--> statement-breakpoint
ALTER TABLE "memorization_progress" ADD COLUMN "verses_count" integer;--> statement-breakpoint
WITH per_goal AS (
  SELECT
    mp.goal_id,
    COUNT(*)::integer AS total_verses,
    GREATEST(1, mg.target_days) AS target_days
  FROM "memorization_progress" mp
  INNER JOIN "memorization_goals" mg ON mg.id = mp.goal_id
  GROUP BY mp.goal_id, mg.target_days
),
annotated AS (
  SELECT
    mp.id,
    mp.goal_id,
    mp.verse_number,
    mp.is_completed,
    LEAST(
      pg.target_days,
      ((mp.verse_number - 1) / GREATEST(1, CEIL(pg.total_verses::numeric / pg.target_days)::integer)) + 1
    )::integer AS day_number
  FROM "memorization_progress" mp
  INNER JOIN per_goal pg ON pg.goal_id = mp.goal_id
),
grouped AS (
  SELECT
    a.id,
    a.day_number,
    MIN(a.verse_number) OVER (PARTITION BY a.goal_id, a.day_number) AS start_verse,
    MAX(a.verse_number) OVER (PARTITION BY a.goal_id, a.day_number) AS end_verse,
    COUNT(*) OVER (PARTITION BY a.goal_id, a.day_number) AS verses_count,
    BOOL_AND(a.is_completed) OVER (PARTITION BY a.goal_id, a.day_number) AS is_completed
  FROM annotated a
)
UPDATE "memorization_progress" mp
SET
  "day_number" = g.day_number,
  "start_verse" = g.start_verse,
  "end_verse" = g.end_verse,
  "verses_count" = g.verses_count,
  "is_completed" = g.is_completed
FROM grouped g
WHERE mp.id = g.id;--> statement-breakpoint
DELETE FROM "memorization_progress" mp
USING (
  SELECT id
  FROM (
    SELECT
      id,
      ROW_NUMBER() OVER (PARTITION BY goal_id, day_number ORDER BY start_verse, id) AS row_number
    FROM "memorization_progress"
  ) ranked
  WHERE ranked.row_number > 1
) duplicates
WHERE mp.id = duplicates.id;--> statement-breakpoint
ALTER TABLE "memorization_progress" ALTER COLUMN "day_number" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "memorization_progress" ALTER COLUMN "start_verse" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "memorization_progress" ALTER COLUMN "end_verse" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "memorization_progress" ALTER COLUMN "verses_count" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "memorization_progress" ALTER COLUMN "verses_count" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "memorization_progress" DROP COLUMN "verse_number";--> statement-breakpoint
CREATE INDEX "memorization_progress_goal_day_idx" ON "memorization_progress" USING btree ("goal_id","day_number");
