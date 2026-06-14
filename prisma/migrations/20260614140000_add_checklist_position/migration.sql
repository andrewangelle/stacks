ALTER TABLE "checklists" ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;

WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY card_id ORDER BY created_at) - 1 AS pos
  FROM "checklists"
)
UPDATE "checklists" c SET "position" = o.pos FROM ordered o WHERE c.id = o.id;
