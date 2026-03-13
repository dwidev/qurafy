CREATE TYPE "public"."supporter_subscription_status" AS ENUM('pending', 'active', 'canceled');
--> statement-breakpoint
CREATE TABLE "supporter_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"amount" bigint NOT NULL,
	"billing_cycle" "billing_cycle" NOT NULL,
	"status" "supporter_subscription_status" DEFAULT 'pending' NOT NULL,
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"canceled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "supporter_subscription_id" uuid;
--> statement-breakpoint
ALTER TABLE "supporter_subscriptions" ADD CONSTRAINT "supporter_subscriptions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_supporter_subscription_id_supporter_subscriptions_id_fk" FOREIGN KEY ("supporter_subscription_id") REFERENCES "public"."supporter_subscriptions"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "supporter_subscriptions_user_id_idx" ON "supporter_subscriptions" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "supporter_subscriptions_user_status_idx" ON "supporter_subscriptions" USING btree ("user_id","status");
