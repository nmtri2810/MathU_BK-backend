/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `username` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "reputation" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "username" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");
