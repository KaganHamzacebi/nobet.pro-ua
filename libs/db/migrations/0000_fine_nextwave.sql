CREATE TABLE IF NOT EXISTS "todo" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"assistant_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
