ALTER TABLE "memorization_progress" ADD COLUMN "completed_days" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "memorization_progress" ADD COLUMN "completed_verses" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
DELETE FROM "memorization_progress";
--> statement-breakpoint
DROP INDEX IF EXISTS "memorization_progress_goal_completed_idx";
--> statement-breakpoint
DROP INDEX IF EXISTS "memorization_progress_goal_day_unique_idx";
--> statement-breakpoint
DROP INDEX IF EXISTS "memorization_progress_goal_id_idx";
--> statement-breakpoint
DROP INDEX IF EXISTS "memorization_progress_goal_unique_idx";
--> statement-breakpoint
ALTER TABLE "memorization_progress" DROP COLUMN "day_number";
--> statement-breakpoint
ALTER TABLE "memorization_progress" DROP COLUMN "start_verse";
--> statement-breakpoint
ALTER TABLE "memorization_progress" DROP COLUMN "end_verse";
--> statement-breakpoint
ALTER TABLE "memorization_progress" DROP COLUMN "verses_count";
--> statement-breakpoint
ALTER TABLE "memorization_progress" DROP COLUMN "is_completed";
--> statement-breakpoint
CREATE UNIQUE INDEX "memorization_progress_goal_unique_idx" ON "memorization_progress" USING btree ("goal_id");
--> statement-breakpoint
INSERT INTO "memorization_progress" ("goal_id", "completed_days", "completed_verses")
SELECT "id", COALESCE("completed_days", 0), COALESCE("completed_verses", 0)
FROM "memorization_goals";
--> statement-breakpoint
ALTER TABLE "memorization_goals" DROP COLUMN "completed_days";
--> statement-breakpoint
ALTER TABLE "memorization_goals" DROP COLUMN "completed_verses";
