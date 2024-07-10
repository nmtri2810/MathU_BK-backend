-- DropForeignKey
ALTER TABLE "Answers" DROP CONSTRAINT "Answers_parent_id_fkey";

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
