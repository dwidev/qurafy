CREATE INDEX "khatam_plans_user_id_idx" ON "khatam_plans" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "khatam_plans_user_completed_idx" ON "khatam_plans" USING btree ("user_id","is_completed");--> statement-breakpoint
CREATE INDEX "khatam_progress_plan_id_idx" ON "khatam_progress" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "memorization_goals_user_id_idx" ON "memorization_goals" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "memorization_goals_user_status_idx" ON "memorization_goals" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "memorization_progress_goal_id_idx" ON "memorization_progress" USING btree ("goal_id");--> statement-breakpoint
CREATE INDEX "memorization_progress_goal_completed_idx" ON "memorization_progress" USING btree ("goal_id","is_completed");