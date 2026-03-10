CREATE TABLE IF NOT EXISTS "user_login_days" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action,
	"date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_login_days_user_id_idx" ON "user_login_days" USING btree ("user_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_login_days_user_date_unique_idx" ON "user_login_days" USING btree ("user_id","date");
--> statement-breakpoint
ALTER TABLE "khatam_plan_progress" ADD COLUMN IF NOT EXISTS "current_streak" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "khatam_plan_progress" ADD COLUMN IF NOT EXISTS "best_streak" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "khatam_plan_progress" ADD COLUMN IF NOT EXISTS "last_completed_at" timestamp;
--> statement-breakpoint
ALTER TABLE "memorization_progress" ADD COLUMN IF NOT EXISTS "current_streak" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "memorization_progress" ADD COLUMN IF NOT EXISTS "best_streak" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "memorization_progress" ADD COLUMN IF NOT EXISTS "last_completed_at" timestamp;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "memorization_day_completions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"goal_id" uuid NOT NULL REFERENCES "public"."memorization_goals"("id") ON DELETE cascade ON UPDATE no action,
	"day_number" integer NOT NULL,
	"date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memorization_day_completions_goal_id_idx" ON "memorization_day_completions" USING btree ("goal_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "memorization_day_completions_goal_date_unique_idx" ON "memorization_day_completions" USING btree ("goal_id","date");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "memorization_day_completions_goal_day_unique_idx" ON "memorization_day_completions" USING btree ("goal_id","day_number");
--> statement-breakpoint
UPDATE "khatam_plan_progress" kpp
SET "last_completed_at" = latest.latest_date
FROM (
  SELECT "plan_id", MAX("date") AS latest_date
  FROM "khatam_progress"
  WHERE "is_done" = true
  GROUP BY "plan_id"
) latest
WHERE latest."plan_id" = kpp."plan_id"
  AND (kpp."last_completed_at" IS NULL OR kpp."last_completed_at" <> latest.latest_date);
