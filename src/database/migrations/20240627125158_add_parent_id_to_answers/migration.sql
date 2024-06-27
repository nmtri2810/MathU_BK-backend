-- AlterTable
ALTER TABLE "Answers" ADD COLUMN     "parent_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Answers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
