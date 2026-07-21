-- DropIndex
DROP INDEX "activities_card_id_idx";

-- CreateIndex
CREATE INDEX "activities_card_id_created_at_idx" ON "activities"("card_id", "created_at");
