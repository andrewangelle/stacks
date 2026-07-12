-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "expanded_checklist_id" TEXT,
ADD COLUMN     "is_checklists_expanded" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_expanded_checklist_id_fkey" FOREIGN KEY ("expanded_checklist_id") REFERENCES "checklists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
