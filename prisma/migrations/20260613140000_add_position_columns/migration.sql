ALTER TABLE "lists" ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;

WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY board_id ORDER BY created_at) - 1 AS pos
  FROM "lists"
)
UPDATE "lists" l SET "position" = o.pos FROM ordered o WHERE l.id = o.id;

ALTER TABLE "cards" ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;

WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY list_id ORDER BY created_at) - 1 AS pos
  FROM "cards"
)
UPDATE "cards" c SET "position" = o.pos FROM ordered o WHERE c.id = o.id;

ALTER TABLE "checklist_items" ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;

WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY checklist_id ORDER BY created_at) - 1 AS pos
  FROM "checklist_items"
)
UPDATE "checklist_items" ci SET "position" = o.pos FROM ordered o WHERE ci.id = o.id;
