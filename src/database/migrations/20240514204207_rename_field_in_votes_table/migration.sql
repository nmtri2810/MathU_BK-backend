/*
  Warnings:

  - You are about to drop the column `likeable_id` on the `Votes` table. All the data in the column will be lost.
  - You are about to drop the column `likeable_type` on the `Votes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,voteable_id,voteable_type]` on the table `Votes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `voteable_id` to the `Votes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voteable_type` to the `Votes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoteableTypes" AS ENUM ('POST', 'COMMENT');

-- DropForeignKey
ALTER TABLE "Votes" DROP CONSTRAINT "comment_likeable_id";

-- DropForeignKey
ALTER TABLE "Votes" DROP CONSTRAINT "post_likeable_id";

-- DropIndex
DROP INDEX "Votes_user_id_likeable_id_likeable_type_key";

-- AlterTable
ALTER TABLE "Votes" DROP COLUMN "likeable_id",
DROP COLUMN "likeable_type",
ADD COLUMN     "voteable_id" INTEGER NOT NULL,
ADD COLUMN     "voteable_type" "VoteableTypes" NOT NULL;

-- DropEnum
DROP TYPE "LikeableTypes";

-- CreateIndex
CREATE UNIQUE INDEX "Votes_user_id_voteable_id_voteable_type_key" ON "Votes"("user_id", "voteable_id", "voteable_type");

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "post_voteable_id" FOREIGN KEY ("voteable_id") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "comment_voteable_id" FOREIGN KEY ("voteable_id") REFERENCES "Comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
