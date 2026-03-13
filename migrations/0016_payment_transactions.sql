CREATE TYPE "public"."payment_transaction_kind" AS ENUM('subscription', 'donation');
--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('manual_bank_transfer');
--> statement-breakpoint
CREATE TYPE "public"."payment_transaction_status" AS ENUM('pending_payment', 'pending_review', 'approved', 'rejected', 'expired');
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"supporter_subscription_id" uuid,
	"donation_id" uuid,
	"kind" "payment_transaction_kind" NOT NULL,
	"payment_method" "payment_method" DEFAULT 'manual_bank_transfer' NOT NULL,
	"amount" bigint NOT NULL,
	"currency" text DEFAULT 'IDR' NOT NULL,
	"billing_cycle" "billing_cycle",
	"status" "payment_transaction_status" DEFAULT 'pending_payment' NOT NULL,
	"reference_code" text NOT NULL,
	"proof_url" text,
	"notes" text,
	"expires_at" timestamp,
	"submitted_at" timestamp,
	"approved_at" timestamp,
	"rejected_at" timestamp,
	"reviewed_by_user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_transactions_reference_code_unique" UNIQUE("reference_code")
);
--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_supporter_subscription_id_supporter_subs_fk" FOREIGN KEY ("supporter_subscription_id") REFERENCES "public"."supporter_subscriptions"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_donation_id_donations_id_fk" FOREIGN KEY ("donation_id") REFERENCES "public"."donations"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_reviewed_by_user_id_user_id_fk" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "payment_transactions_user_id_idx" ON "payment_transactions" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "payment_transactions_status_idx" ON "payment_transactions" USING btree ("status");
--> statement-breakpoint
CREATE INDEX "payment_transactions_subscription_id_idx" ON "payment_transactions" USING btree ("supporter_subscription_id");
--> statement-breakpoint
CREATE INDEX "payment_transactions_donation_id_idx" ON "payment_transactions" USING btree ("donation_id");
