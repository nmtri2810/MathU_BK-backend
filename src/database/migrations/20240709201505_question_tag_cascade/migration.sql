-- DropForeignKey
ALTER TABLE "QuestionsTags" DROP CONSTRAINT "QuestionsTags_question_id_fkey";

-- DropForeignKey
ALTER TABLE "QuestionsTags" DROP CONSTRAINT "QuestionsTags_tag_id_fkey";

-- AddForeignKey
ALTER TABLE "QuestionsTags" ADD CONSTRAINT "QuestionsTags_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionsTags" ADD CONSTRAINT "QuestionsTags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
