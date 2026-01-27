-- AlterEnum
ALTER TYPE "SuggestionStatus" ADD VALUE 'IN_PROGRESS';

-- AlterTable
ALTER TABLE "Suggestion" ADD COLUMN     "assigneeId" TEXT,
ADD COLUMN     "response" TEXT;

-- AddForeignKey
ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
