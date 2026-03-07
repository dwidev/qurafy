CREATE TABLE "user_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"location" text NOT NULL,
	"bio" text NOT NULL,
	"daily_goal" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profile_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;