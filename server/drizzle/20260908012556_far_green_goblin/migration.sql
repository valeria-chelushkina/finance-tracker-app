ALTER TABLE "transactions" DROP CONSTRAINT IF EXISTS "transactions_account_id_accounts_id_fkey";

ALTER TABLE "transactions" DROP CONSTRAINT IF EXISTS "transactions_jar_id_jars_id_fkey";

--> statement-breakpoint

ALTER TABLE "accounts" ALTER COLUMN "id" DROP IDENTITY IF EXISTS;
ALTER TABLE "jars" ALTER COLUMN "id" DROP IDENTITY IF EXISTS;
ALTER TABLE "transactions" ALTER COLUMN "id" DROP IDENTITY IF EXISTS;

--> statement-breakpoint

ALTER TABLE "accounts" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;
ALTER TABLE "jars" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;
ALTER TABLE "transactions" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;
ALTER TABLE "transactions" ALTER COLUMN "account_id" SET DATA TYPE text USING "account_id"::text;

--> statement-breakpoint

ALTER TABLE "transactions" 
  ADD CONSTRAINT "transactions_account_id_accounts_id_fkey" 
  FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE;
