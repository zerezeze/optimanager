-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OPERATOR');

-- AlterTable (Add columns as nullable initially)
ALTER TABLE "clients" ADD COLUMN "user_id" TEXT;
ALTER TABLE "users" ADD COLUMN "name" VARCHAR(255);
ALTER TABLE "users" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'OPERATOR';

-- Update existing users to have a default name
UPDATE "users" SET "name" = 'Administrador' WHERE "name" IS NULL;

-- Update existing admin user role to ADMIN
UPDATE "users" SET "role" = 'ADMIN' WHERE "email" = 'admin@optimanager.com';

-- Update existing clients to belong to the admin user
UPDATE "clients" SET "user_id" = (SELECT id FROM "users" WHERE "email" = 'admin@optimanager.com' LIMIT 1) WHERE "user_id" IS NULL;

-- Alter columns to be NOT NULL now that they contain data
ALTER TABLE "clients" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE INDEX "clients_user_id_idx" ON "clients"("user_id");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
