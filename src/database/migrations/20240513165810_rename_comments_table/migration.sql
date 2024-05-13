/*
  Warnings:

  - You are about to drop the column `post_comment_id` on the `Votes` table. All the data in the column will be lost.
  - You are about to drop the `PostComments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,comment_id]` on the table `Votes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PostComments" DROP CONSTRAINT "PostComments_post_id_fkey";

-- DropForeignKey
ALTER TABLE "Votes" DROP CONSTRAINT "Votes_post_comment_id_fkey";

-- DropIndex
DROP INDEX "Votes_user_id_post_comment_id_key";

-- AlterTable
ALTER TABLE "Votes" DROP COLUMN "post_comment_id",
ADD COLUMN     "comment_id" INTEGER;

-- DropTable
DROP TABLE "PostComments";

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Comments_id_key" ON "Comments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Votes_user_id_comment_id_key" ON "Votes"("user_id", "comment_id");

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
