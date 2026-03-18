UPDATE "memorization_goals"
SET "expires_at" = "deleted_at" + interval '7 days'
WHERE "deleted_at" IS NOT NULL;
--> statement-breakpoint
UPDATE "khatam_plans"
SET "expires_at" = "deleted_at" + interval '7 days'
WHERE "deleted_at" IS NOT NULL;
