-- CreateIndex
CREATE INDEX "activities_card_id_idx" ON "activities"("card_id");

-- CreateIndex
CREATE INDEX "activities_user_id_idx" ON "activities"("user_id");

-- CreateIndex
CREATE INDEX "cards_list_id_idx" ON "cards"("list_id");

-- CreateIndex
CREATE INDEX "cards_user_id_idx" ON "cards"("user_id");

-- CreateIndex
CREATE INDEX "checklist_items_checklist_id_idx" ON "checklist_items"("checklist_id");

-- CreateIndex
CREATE INDEX "checklist_items_user_id_idx" ON "checklist_items"("user_id");

-- CreateIndex
CREATE INDEX "checklists_card_id_idx" ON "checklists"("card_id");

-- CreateIndex
CREATE INDEX "checklists_user_id_idx" ON "checklists"("user_id");

-- CreateIndex
CREATE INDEX "lists_board_id_idx" ON "lists"("board_id");

-- CreateIndex
CREATE INDEX "lists_user_id_idx" ON "lists"("user_id");

-- CreateIndex
CREATE INDEX "stacks_user_id_idx" ON "stacks"("user_id");
