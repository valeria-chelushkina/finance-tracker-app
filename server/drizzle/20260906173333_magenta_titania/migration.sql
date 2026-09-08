ALTER TABLE "categories" DROP CONSTRAINT "categories_name_key";--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "short_description_en" varchar(255);--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "short_description_ua" varchar(255);--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "full_description_en" text;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "full_description_ua" text;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "unique_user_category_name" UNIQUE("user_id","name");-->statement-breakpoint
CREATE UNIQUE INDEX "unique_system_category_name" ON "categories" ("name") WHERE "user_id" IS NULL;