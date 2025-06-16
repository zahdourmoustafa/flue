CREATE TYPE "public"."sender_type" AS ENUM('user', 'ai');--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"sender_type" "sender_type" NOT NULL,
	"original_message" text NOT NULL,
	"corrected_message" text,
	"explanation" text,
	"audio_url" text,
	"has_errors" boolean DEFAULT false,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "translation_language" text NOT NULL;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;