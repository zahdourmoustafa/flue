CREATE TYPE "public"."difficulty" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TABLE "sentence_lessons" (
	"id" text PRIMARY KEY NOT NULL,
	"unit_id" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"order_index" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sentence_units" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"difficulty" "difficulty" NOT NULL,
	"order_index" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sentences" (
	"id" text PRIMARY KEY NOT NULL,
	"lesson_id" text NOT NULL,
	"text" text NOT NULL,
	"translation" text NOT NULL,
	"difficulty" integer DEFAULT 1,
	"audio_url" varchar(255),
	"order_index" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_sentence_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"unit_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"sentence_id" text NOT NULL,
	"completed" boolean DEFAULT false,
	"pronunciation_score" integer,
	"attempts" integer DEFAULT 0,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sentence_lessons" ADD CONSTRAINT "sentence_lessons_unit_id_sentence_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."sentence_units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sentences" ADD CONSTRAINT "sentences_lesson_id_sentence_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."sentence_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sentence_progress" ADD CONSTRAINT "user_sentence_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sentence_progress" ADD CONSTRAINT "user_sentence_progress_unit_id_sentence_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."sentence_units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sentence_progress" ADD CONSTRAINT "user_sentence_progress_lesson_id_sentence_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."sentence_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sentence_progress" ADD CONSTRAINT "user_sentence_progress_sentence_id_sentences_id_fk" FOREIGN KEY ("sentence_id") REFERENCES "public"."sentences"("id") ON DELETE cascade ON UPDATE no action;