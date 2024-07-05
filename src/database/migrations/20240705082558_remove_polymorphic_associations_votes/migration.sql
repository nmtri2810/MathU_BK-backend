/*
  Warnings:

  - You are about to drop the column `voteable_id` on the `Votes` table. All the data in the column will be lost.
  - You are about to drop the column `voteable_type` on the `Votes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,question_id]` on the table `Votes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,answer_id]` on the table `Votes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Votes" DROP CONSTRAINT "Votes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Votes" DROP CONSTRAINT "answer_voteable_id";

-- DropForeignKey
ALTER TABLE "Votes" DROP CONSTRAINT "question_voteable_id";

-- DropIndex
DROP INDEX "Votes_user_id_voteable_id_voteable_type_key";

-- AlterTable
ALTER TABLE "Votes" DROP COLUMN "voteable_id",
DROP COLUMN "voteable_type",
ADD COLUMN     "answer_id" INTEGER,
ADD COLUMN     "question_id" INTEGER;

-- DropEnum
DROP TYPE "VoteableTypes";

-- CreateIndex
CREATE UNIQUE INDEX "Votes_user_id_question_id_key" ON "Votes"("user_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "Votes_user_id_answer_id_key" ON "Votes"("user_id", "answer_id");

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "Answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
