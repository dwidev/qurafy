DO $$
BEGIN
	CREATE TYPE "public"."habit_routine" AS ENUM('morning', 'afternoon', 'evening', 'anytime');
EXCEPTION
	WHEN duplicate_object THEN NULL;
END
$$;
--> statement-breakpoint
DO $$
BEGIN
	CREATE TYPE "public"."habit_type" AS ENUM('boolean', 'quantitative');
EXCEPTION
	WHEN duplicate_object THEN NULL;
END
$$;
--> statement-breakpoint
DO $$
BEGIN
	IF to_regclass('public.habbit') IS NOT NULL AND to_regclass('public.habits') IS NULL THEN
		ALTER TABLE "public"."habbit" RENAME TO "habits";
	END IF;
END
$$;
--> statement-breakpoint
DO $$
BEGIN
	IF to_regclass('public.habbit_entries') IS NOT NULL AND to_regclass('public.habit_entries') IS NULL THEN
		ALTER TABLE "public"."habbit_entries" RENAME TO "habit_entries";
	END IF;
END
$$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "habits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"color" text DEFAULT 'emerald' NOT NULL,
	"icon_name" text,
	"type" "habit_type" DEFAULT 'boolean' NOT NULL,
	"routine" "habit_routine" DEFAULT 'anytime' NOT NULL,
	"target" integer DEFAULT 1 NOT NULL,
	"unit" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"archived_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN IF NOT EXISTS "icon_name" text;
--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN IF NOT EXISTS "archived_at" timestamp;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "habit_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"habit_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"value" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint c
		JOIN pg_class t ON t.oid = c.conrelid
		JOIN pg_namespace n ON n.oid = t.relnamespace
		WHERE n.nspname = 'public'
		  AND t.relname = 'habits'
		  AND c.contype = 'f'
		  AND pg_get_constraintdef(c.oid) LIKE '%("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE%'
	) THEN
		ALTER TABLE "habits"
			ADD CONSTRAINT "habits_user_id_user_id_fk"
			FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END
$$;
--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint c
		JOIN pg_class t ON t.oid = c.conrelid
		JOIN pg_namespace n ON n.oid = t.relnamespace
		WHERE n.nspname = 'public'
		  AND t.relname = 'habit_entries'
		  AND c.contype = 'f'
		  AND pg_get_constraintdef(c.oid) LIKE '%("habit_id") REFERENCES "public"."habits"("id") ON DELETE CASCADE%'
	) THEN
		ALTER TABLE "habit_entries"
			ADD CONSTRAINT "habit_entries_habit_id_habits_id_fk"
			FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END
$$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "habits_user_id_idx" ON "habits" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "habits_user_archived_idx" ON "habits" USING btree ("user_id","archived_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "habits_user_routine_idx" ON "habits" USING btree ("user_id","routine");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "habit_entries_habit_id_idx" ON "habit_entries" USING btree ("habit_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "habit_entries_date_idx" ON "habit_entries" USING btree ("date");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "habit_entries_habit_date_unique_idx" ON "habit_entries" USING btree ("habit_id","date");
