CREATE TABLE "khatam_plan_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"completed_days" integer DEFAULT 0 NOT NULL,
	"completed_juz" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "khatam_plan_progress" ADD CONSTRAINT "khatam_plan_progress_plan_id_khatam_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."khatam_plans"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
DELETE FROM "khatam_progress" a
USING "khatam_progress" b
WHERE a."plan_id" = b."plan_id"
  AND a."date" = b."date"
  AND a.ctid < b.ctid;
--> statement-breakpoint
CREATE UNIQUE INDEX "khatam_progress_plan_date_unique_idx" ON "khatam_progress" USING btree ("plan_id","date");
--> statement-breakpoint
CREATE UNIQUE INDEX "khatam_plan_progress_plan_unique_idx" ON "khatam_plan_progress" USING btree ("plan_id");
--> statement-breakpoint
INSERT INTO "khatam_plan_progress" ("plan_id", "completed_days", "completed_juz")
SELECT
  kp."id",
  COUNT(*) FILTER (WHERE kg."is_done")::integer,
  0
FROM "khatam_plans" kp
LEFT JOIN "khatam_progress" kg ON kg."plan_id" = kp."id"
GROUP BY kp."id"
ON CONFLICT ("plan_id") DO NOTHING;
