ALTER TABLE "memorization_goals" ADD COLUMN IF NOT EXISTS "expires_at" timestamp;
--> statement-breakpoint
ALTER TABLE "khatam_plans" ADD COLUMN IF NOT EXISTS "expires_at" timestamp;
--> statement-breakpoint
UPDATE "memorization_goals"
SET "expires_at" = "deleted_at" + interval '7 days'
WHERE "deleted_at" IS NOT NULL AND "expires_at" IS NULL;
--> statement-breakpoint
UPDATE "khatam_plans"
SET "expires_at" = "deleted_at" + interval '7 days'
WHERE "deleted_at" IS NOT NULL AND "expires_at" IS NULL;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memorization_goals_user_expires_idx" ON "memorization_goals" USING btree ("user_id","expires_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "khatam_plans_user_expires_idx" ON "khatam_plans" USING btree ("user_id","expires_at");
