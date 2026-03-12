CREATE TYPE "public"."reader_mode" AS ENUM('verse', 'mushaf');
--> statement-breakpoint
CREATE TYPE "public"."theme_preference" AS ENUM('light', 'dark', 'system');
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"theme" "theme_preference" DEFAULT 'system' NOT NULL,
	"reader_mode" "reader_mode" DEFAULT 'verse' NOT NULL,
	"arabic_font_size" integer DEFAULT 4 NOT NULL,
	"show_translation" boolean DEFAULT true NOT NULL,
	"show_transliteration" boolean DEFAULT true NOT NULL,
	"reading_reminders" boolean DEFAULT true NOT NULL,
	"hifz_repetitions" boolean DEFAULT true NOT NULL,
	"khatam_daily" boolean DEFAULT true NOT NULL,
	"marketing" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
