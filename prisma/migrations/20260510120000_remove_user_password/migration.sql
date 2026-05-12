-- Drop local credential column; Neon Auth owns passwords.
ALTER TABLE "users" DROP COLUMN IF EXISTS "password";

ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;
