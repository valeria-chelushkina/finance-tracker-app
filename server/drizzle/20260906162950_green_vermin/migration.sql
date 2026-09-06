ALTER TYPE "type" ADD VALUE 'madeInUkraine';--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "card_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "type" DROP NOT NULL;