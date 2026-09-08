ALTER TYPE "paument_type" RENAME TO "payment_type";--> statement-breakpoint
ALTER TABLE "recurring_transactions" ADD COLUMN "category" integer;--> statement-breakpoint
ALTER TABLE "wishlists" ADD COLUMN "category" integer;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "balance" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "category" integer;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "operation_amount" double precision;--> statement-breakpoint
ALTER TABLE "budgets" ALTER COLUMN "category" SET DATA TYPE integer USING "category"::integer;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_category_categories_id_fkey" FOREIGN KEY ("category") REFERENCES "categories"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_category_categories_id_fkey" FOREIGN KEY ("category") REFERENCES "categories"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_category_categories_id_fkey" FOREIGN KEY ("category") REFERENCES "categories"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_categories_id_fkey" FOREIGN KEY ("category") REFERENCES "categories"("id") ON DELETE CASCADE;