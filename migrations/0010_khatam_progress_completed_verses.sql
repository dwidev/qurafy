ALTER TABLE "khatam_progress" ADD COLUMN IF NOT EXISTS "completed_verses" integer DEFAULT 0 NOT NULL;
