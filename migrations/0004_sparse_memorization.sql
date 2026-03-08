ALTER TABLE "memorization_goals" ADD COLUMN "total_verses" integer;
--> statement-breakpoint
UPDATE "memorization_goals" mg
SET "total_verses" = COALESCE(src.total_verses, 0)
FROM (
  SELECT "goal_id", SUM("verses_count")::integer AS total_verses
  FROM "memorization_progress"
  GROUP BY "goal_id"
) AS src
WHERE src."goal_id" = mg."id";
--> statement-breakpoint
UPDATE "memorization_goals"
SET "total_verses" = 1
WHERE "total_verses" IS NULL OR "total_verses" <= 0;
--> statement-breakpoint
ALTER TABLE "memorization_goals" ALTER COLUMN "total_verses" SET NOT NULL;
--> statement-breakpoint
WITH ranked AS (
  SELECT
    ctid,
    ROW_NUMBER() OVER (
      PARTITION BY "goal_id", "day_number"
      ORDER BY "is_completed" DESC, ctid DESC
    ) AS row_num
  FROM "memorization_progress"
)
DELETE FROM "memorization_progress" mp
USING ranked r
WHERE mp.ctid = r.ctid
  AND r.row_num > 1;
--> statement-breakpoint
DROP INDEX IF EXISTS "memorization_progress_goal_day_idx";
--> statement-breakpoint
CREATE UNIQUE INDEX "memorization_progress_goal_day_unique_idx" ON "memorization_progress" USING btree ("goal_id","day_number");
