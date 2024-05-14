/*
  Warnings:

  - You are about to drop the column `comment_id` on the `Votes` table. All the data in the column will be lost.
  - You are about to drop the column `post_id` on the `Votes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,likeable_id,likeable_type]` on the table `Votes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `likeable_id` to the `Votes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likeable_type` to the `Votes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LikeableTypes" AS ENUM ('POST', 'COMMENT');

-- DropForeignKey
ALTER TABLE "Votes" DROP CONSTRAINT "Votes_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "Votes" DROP CONSTRAINT "Votes_post_id_fkey";

-- DropIndex
DROP INDEX "Votes_user_id_comment_id_key";

-- DropIndex
DROP INDEX "Votes_user_id_post_id_key";

-- AlterTable
ALTER TABLE "Votes" DROP COLUMN "comment_id",
DROP COLUMN "post_id",
ADD COLUMN     "likeable_id" INTEGER NOT NULL,
ADD COLUMN     "likeable_type" "LikeableTypes" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Votes_user_id_likeable_id_likeable_type_key" ON "Votes"("user_id", "likeable_id", "likeable_type");

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "post_likeable_id" FOREIGN KEY ("likeable_id") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "comment_likeable_id" FOREIGN KEY ("likeable_id") REFERENCES "Comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
