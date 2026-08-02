CREATE TYPE "bank_name" AS ENUM('monobank');--> statement-breakpoint
CREATE TYPE "cashback_type" AS ENUM('None', 'UAH', 'Miles');--> statement-breakpoint
CREATE TYPE "frequency_type" AS ENUM('number_of_days', 'date_of_month');--> statement-breakpoint
CREATE TYPE "paument_type" AS ENUM('card', 'cash');--> statement-breakpoint
CREATE TYPE "type" AS ENUM('black', 'white', 'platinum', 'iron', 'fop', 'yellow', 'eAid');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "accounts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"bankName" "bank_name" DEFAULT 'monobank'::"bank_name" NOT NULL,
	"card_id" varchar(255) UNIQUE,
	"send_id" varchar(255) UNIQUE,
	"currency_code" integer DEFAULT 980,
	"cashbackType" "cashback_type",
	"balance" double precision,
	"credit_limit" double precision,
	"masked_pan" varchar(19)[] DEFAULT '{}'::varchar(19)[] NOT NULL,
	"type" "type" DEFAULT 'black'::"type" NOT NULL,
	"iban" varchar(34),
	CONSTRAINT "accounts_currency_code_check" CHECK ("currency_code" IN (784, 971, 8, 51, 532, 973, 32, 36, 533, 944, 977, 52, 50, 975, 48, 108, 60, 96, 68, 986, 44, 64, 72, 933, 84, 124, 976, 756, 152, 156, 170, 188, 931, 192, 132, 203, 262, 208, 214, 12, 818, 232, 230, 978, 242, 238, 826, 981, 936, 292, 270, 324, 320, 328, 344, 340, 191, 332, 348, 360, 376, 356, 368, 364, 352, 388, 400, 392, 404, 417, 116, 174, 408, 410, 414, 136, 398, 418, 422, 144, 430, 426, 434, 504, 498, 969, 807, 104, 496, 446, 929, 480, 462, 454, 484, 458, 943, 516, 566, 558, 578, 524, 554, 512, 590, 604, 598, 608, 586, 985, 600, 634, 946, 941, 643, 646, 682, 90, 690, 938, 752, 702, 654, 694, 706, 968, 728, 930, 222, 760, 748, 764, 972, 934, 788, 776, 949, 780, 901, 834, 980, 800, 840, 858, 860, 928, 704, 548, 882, 950, 951, 952, 953, 886, 710, 967, 932)),
	CONSTRAINT "cashback_type_card" CHECK (("cashbackType" = 'Miles' AND ("type" = 'platinum' OR "type" = 'iron')) OR ("cashbackType" <> 'Miles' OR "cashbackType" IS NULL))
);
--> statement-breakpoint
CREATE TABLE "budgets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "budgets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"category" varchar(255),
	"items" jsonb,
	"limit_amount" double precision,
	"month" integer,
	"year" integer NOT NULL,
	CONSTRAINT "unique_budget" UNIQUE("category","month","year"),
	CONSTRAINT "month_budget_check" CHECK ("month" BETWEEN 1 AND 12),
	CONSTRAINT "limit_amount_check" CHECK ("limit_amount" >= 0)
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"name" varchar(255) NOT NULL UNIQUE,
	"color" varchar(7),
	"icon" varchar(255),
	"is_composite" boolean DEFAULT false NOT NULL,
	"mcc_codes" integer[] DEFAULT ARRAY[]::integer[],
	"included_categories" integer[] DEFAULT ARRAY[]::integer[]
);
--> statement-breakpoint
CREATE TABLE "jars" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "jars_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"jar_id" varchar NOT NULL UNIQUE,
	"send_id" varchar NOT NULL UNIQUE,
	"title" varchar(255),
	"length: 255" varchar,
	"currency_code" integer DEFAULT 980,
	"balance" double precision,
	"goal" double precision,
	CONSTRAINT "jars_currency_code_check" CHECK ("currency_code" IN (784, 971, 8, 51, 532, 973, 32, 36, 533, 944, 977, 52, 50, 975, 48, 108, 60, 96, 68, 986, 44, 64, 72, 933, 84, 124, 976, 756, 152, 156, 170, 188, 931, 192, 132, 203, 262, 208, 214, 12, 818, 232, 230, 978, 242, 238, 826, 981, 936, 292, 270, 324, 320, 328, 344, 340, 191, 332, 348, 360, 376, 356, 368, 364, 352, 388, 400, 392, 404, 417, 116, 174, 408, 410, 414, 136, 398, 418, 422, 144, 430, 426, 434, 504, 498, 969, 807, 104, 496, 446, 929, 480, 462, 454, 484, 458, 943, 516, 566, 558, 578, 524, 554, 512, 590, 604, 598, 608, 586, 985, 600, 634, 946, 941, 643, 646, 682, 90, 690, 938, 752, 702, 654, 694, 706, 968, 728, 930, 222, 760, 748, 764, 972, 934, 788, 776, 949, 780, 901, 834, 980, 800, 840, 858, 860, 928, 704, 548, 882, 950, 951, 952, 953, 886, 710, 967, 932))
);
--> statement-breakpoint
CREATE TABLE "recurring_transactions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "recurring_transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL UNIQUE,
	"amount" double precision NOT NULL,
	"currency_code" integer DEFAULT 980,
	"next_due_date" date,
	"fruequencyType" "frequency_type" DEFAULT 'number_of_days'::"frequency_type",
	"frequency" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "recurring_transactions_currency_code_check" CHECK ("currency_code" IN (784, 971, 8, 51, 532, 973, 32, 36, 533, 944, 977, 52, 50, 975, 48, 108, 60, 96, 68, 986, 44, 64, 72, 933, 84, 124, 976, 756, 152, 156, 170, 188, 931, 192, 132, 203, 262, 208, 214, 12, 818, 232, 230, 978, 242, 238, 826, 981, 936, 292, 270, 324, 320, 328, 344, 340, 191, 332, 348, 360, 376, 356, 368, 364, 352, 388, 400, 392, 404, 417, 116, 174, 408, 410, 414, 136, 398, 418, 422, 144, 430, 426, 434, 504, 498, 969, 807, 104, 496, 446, 929, 480, 462, 454, 484, 458, 943, 516, 566, 558, 578, 524, 554, 512, 590, 604, 598, 608, 586, 985, 600, 634, 946, 941, 643, 646, 682, 90, 690, 938, 752, 702, 654, 694, 706, 968, 728, 930, 222, 760, 748, 764, 972, 934, 788, 776, 949, 780, 901, 834, 980, 800, 840, 858, 860, 928, 704, 548, 882, 950, 951, 952, 953, 886, 710, 967, 932))
);
--> statement-breakpoint
CREATE TABLE "statistics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "statistics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"categories" jsonb,
	"month" integer,
	"year" integer,
	"amount" double precision,
	"currency_code" integer DEFAULT 980,
	CONSTRAINT "statistics_currency_code_check" CHECK ("currency_code" IN (784, 971, 8, 51, 532, 973, 32, 36, 533, 944, 977, 52, 50, 975, 48, 108, 60, 96, 68, 986, 44, 64, 72, 933, 84, 124, 976, 756, 152, 156, 170, 188, 931, 192, 132, 203, 262, 208, 214, 12, 818, 232, 230, 978, 242, 238, 826, 981, 936, 292, 270, 324, 320, 328, 344, 340, 191, 332, 348, 360, 376, 356, 368, 364, 352, 388, 400, 392, 404, 417, 116, 174, 408, 410, 414, 136, 398, 418, 422, 144, 430, 426, 434, 504, 498, 969, 807, 104, 496, 446, 929, 480, 462, 454, 484, 458, 943, 516, 566, 558, 578, 524, 554, 512, 590, 604, 598, 608, 586, 985, 600, 634, 946, 941, 643, 646, 682, 90, 690, 938, 752, 702, 654, 694, 706, 968, 728, 930, 222, 760, 748, 764, 972, 934, 788, 776, 949, 780, 901, 834, 980, 800, 840, 858, 860, 928, 704, 548, 882, 950, 951, 952, 953, 886, 710, 967, 932)),
	CONSTRAINT "month_statistics_check" CHECK ("month" BETWEEN 1 AND 12)
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"paymentType" "paument_type" DEFAULT 'card'::"paument_type",
	"account_id" integer,
	"transaction_id" varchar(255) UNIQUE,
	"transaction_time" timestamp,
	"description" varchar(255),
	"amount" double precision NOT NULL,
	"currency_code" integer DEFAULT 980,
	"commission_rate" double precision,
	"cashback_amount" double precision,
	"comment" varchar(255),
	CONSTRAINT "transactions_currency_code_check" CHECK ("currency_code" IN (784, 971, 8, 51, 532, 973, 32, 36, 533, 944, 977, 52, 50, 975, 48, 108, 60, 96, 68, 986, 44, 64, 72, 933, 84, 124, 976, 756, 152, 156, 170, 188, 931, 192, 132, 203, 262, 208, 214, 12, 818, 232, 230, 978, 242, 238, 826, 981, 936, 292, 270, 324, 320, 328, 344, 340, 191, 332, 348, 360, 376, 356, 368, 364, 352, 388, 400, 392, 404, 417, 116, 174, 408, 410, 414, 136, 398, 418, 422, 144, 430, 426, 434, 504, 498, 969, 807, 104, 496, 446, 929, 480, 462, 454, 484, 458, 943, 516, 566, 558, 578, 524, 554, 512, 590, 604, 598, 608, 586, 985, 600, 634, 946, 941, 643, 646, 682, 90, 690, 938, 752, 702, 654, 694, 706, 968, 728, 930, 222, 760, 748, 764, 972, 934, 788, 776, 949, 780, 901, 834, 980, 800, 840, 858, 860, 928, 704, 548, 882, 950, 951, 952, 953, 886, 710, 967, 932))
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" varchar(255) NOT NULL UNIQUE,
	"password_hash" varchar(255),
	"name" varchar(255),
	"profilePicture" text,
	"bank_token" varchar(255) UNIQUE,
	"expected_salary" double precision,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "salary_check" CHECK ("expected_salary" > 0)
);
--> statement-breakpoint
CREATE TABLE "wishlists" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wishlists_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"name" varchar(255),
	"amount" double precision,
	"currency_code" integer DEFAULT 980,
	"url" text,
	CONSTRAINT "unique_wishlist_item" UNIQUE("name","amount","url"),
	CONSTRAINT "wishlists_currency_code_check" CHECK ("currency_code" IN (784, 971, 8, 51, 532, 973, 32, 36, 533, 944, 977, 52, 50, 975, 48, 108, 60, 96, 68, 986, 44, 64, 72, 933, 84, 124, 976, 756, 152, 156, 170, 188, 931, 192, 132, 203, 262, 208, 214, 12, 818, 232, 230, 978, 242, 238, 826, 981, 936, 292, 270, 324, 320, 328, 344, 340, 191, 332, 348, 360, 376, 356, 368, 364, 352, 388, 400, 392, 404, 417, 116, 174, 408, 410, 414, 136, 398, 418, 422, 144, 430, 426, 434, 504, 498, 969, 807, 104, 496, 446, 929, 480, 462, 454, 484, 458, 943, 516, 566, 558, 578, 524, 554, 512, 590, 604, 598, 608, 586, 985, 600, 634, 946, 941, 643, 646, 682, 90, 690, 938, 752, 702, 654, 694, 706, 968, 728, 930, 222, 760, 748, 764, 972, 934, 788, 776, 949, 780, 901, 834, 980, 800, 840, 858, 860, 928, 704, 548, 882, 950, 951, 952, 953, 886, 710, 967, 932))
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "jars" ADD CONSTRAINT "jars_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "statistics" ADD CONSTRAINT "statistics_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;