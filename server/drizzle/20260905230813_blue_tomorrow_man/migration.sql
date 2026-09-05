ALTER TABLE "jars" RENAME COLUMN "length: 255" TO "description";--> statement-breakpoint
ALTER TABLE "jars" ALTER COLUMN "description" SET DATA TYPE varchar(255) USING "description"::varchar(255);