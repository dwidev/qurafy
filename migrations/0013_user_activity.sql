CREATE TABLE "user_activity" (
	"user_id" text PRIMARY KEY NOT NULL,
	"last_activity_date" timestamp,
	"last_login_time" timestamp,
	"last_logout_time" timestamp,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"best_streak" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "user_activity_last_activity_date_idx" ON "user_activity" USING btree ("last_activity_date");
--> statement-breakpoint
WITH ordered_days AS (
	SELECT
		"user_id",
		"date"::date AS "activity_day",
		ROW_NUMBER() OVER (PARTITION BY "user_id" ORDER BY "date"::date) AS "seq"
	FROM "user_login_days"
	GROUP BY "user_id", "date"::date
),
grouped_streaks AS (
	SELECT
		"user_id",
		"activity_day",
		"activity_day" - ("seq" * INTERVAL '1 day') AS "streak_group"
	FROM ordered_days
),
streaks AS (
	SELECT
		"user_id",
		MAX("activity_day")::timestamp AS "last_activity_date",
		COUNT(*)::integer AS "streak_length"
	FROM grouped_streaks
	GROUP BY "user_id", "streak_group"
),
summary AS (
	SELECT
		"user_id",
		MAX("last_activity_date") AS "last_activity_date",
		MAX("streak_length")::integer AS "best_streak"
	FROM streaks
	GROUP BY "user_id"
),
latest_streak AS (
	SELECT DISTINCT ON ("user_id")
		"user_id",
		"streak_length"::integer AS "current_streak"
	FROM streaks
	ORDER BY "user_id", "last_activity_date" DESC
)
INSERT INTO "user_activity" (
	"user_id",
	"last_activity_date",
	"last_login_time",
	"last_logout_time",
	"current_streak",
	"best_streak",
	"created_at",
	"updated_at"
)
SELECT
	summary."user_id",
	summary."last_activity_date",
	summary."last_activity_date",
	NULL,
	latest_streak."current_streak",
	GREATEST(summary."best_streak", latest_streak."current_streak"),
	now(),
	now()
FROM summary
INNER JOIN latest_streak ON latest_streak."user_id" = summary."user_id";
--> statement-breakpoint
DROP TABLE "user_login_days";
