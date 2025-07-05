CREATE TABLE "daily_goals" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"goal_date" date NOT NULL,
	"minutes_completed" integer DEFAULT 0 NOT NULL,
	"goal_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "user_date_unique" UNIQUE("user_id","goal_date")
);
--> statement-breakpoint
ALTER TABLE "user_stats" ADD COLUMN "last_streak_date" date;--> statement-breakpoint
ALTER TABLE "daily_goals" ADD CONSTRAINT "daily_goals_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;