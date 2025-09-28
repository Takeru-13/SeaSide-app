-- AlterTable
ALTER TABLE "public"."Record" ADD COLUMN     "exercise" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "memo" JSONB NOT NULL DEFAULT '{}';
