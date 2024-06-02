/*
  Warnings:

  - The values [POST,COMMENT] on the enum `VoteableTypes` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostsTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VoteableTypes_new" AS ENUM ('QUESTION', 'ANSWER');
ALTER TABLE "Votes" ALTER COLUMN "voteable_type" TYPE "VoteableTypes_new" USING ("voteable_type"::text::"VoteableTypes_new");
ALTER TYPE "VoteableTypes" RENAME TO "VoteableTypes_old";
ALTER TYPE "VoteableTypes_new" RENAME TO "VoteableTypes";
DROP TYPE "VoteableTypes_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_post_id_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "PostsTags" DROP CONSTRAINT "PostsTags_post_id_fkey";

-- DropForeignKey
ALTER TABLE "PostsTags" DROP CONSTRAINT "PostsTags_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "Votes" DROP CONSTRAINT "comment_voteable_id";

-- DropForeignKey
ALTER TABLE "Votes" DROP CONSTRAINT "post_voteable_id";

-- DropTable
DROP TABLE "Comments";

-- DropTable
DROP TABLE "Posts";

-- DropTable
DROP TABLE "PostsTags";

-- CreateTable
CREATE TABLE "Questions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answers" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "question_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP,

    CONSTRAINT "Answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionsTags" (
    "question_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP,

    CONSTRAINT "QuestionsTags_pkey" PRIMARY KEY ("question_id","tag_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Questions_id_key" ON "Questions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Questions_title_key" ON "Questions"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Answers_id_key" ON "Answers"("id");

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionsTags" ADD CONSTRAINT "QuestionsTags_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionsTags" ADD CONSTRAINT "QuestionsTags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "question_voteable_id" FOREIGN KEY ("voteable_id") REFERENCES "Questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "answer_voteable_id" FOREIGN KEY ("voteable_id") REFERENCES "Answers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
