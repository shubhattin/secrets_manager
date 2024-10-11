CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"description_encrypted" text NOT NULL,
	"text_encrypted" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"username" varchar(25) NOT NULL,
	"password_hash" char(96) NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
