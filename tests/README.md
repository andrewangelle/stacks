# Playwright E2E Tests

End-to-end tests drive the real app in a browser and assert what a user sees and can do. This is the primary test layer for this repo—reach for E2E first; isolated unit tests are only for cases that cannot reasonably be exercised through the UI.

Tests run against `pnpm dev:e2e`, which starts Vite on **port 3100** with mocked Prisma and Clerk (no `.env` or live database required). Production `pnpm dev` on port 3000 is unchanged.

## Running tests

```bash
# Run all tests (starts dev:e2e on :3100 automatically)
pnpm test

# Chromium only (matches CI)
pnpm test --project=chromium

# Interactive / debug
pnpm test:ui
pnpm test:headed
pnpm test:debug
pnpm test:report
```

### Specific files or patterns

```bash
pnpm test tests/boards.test.ts
pnpm test --grep "creates a board"
```

## Verified incrementally (run one file at a time while developing)

```bash
pnpm dev:e2e   # optional: start server yourself on :3100
pnpm exec playwright test tests/index.test.ts --project=chromium   # ~1s with warm server
pnpm exec playwright test tests/boards.test.ts --project=chromium  # ~20s cold start
```

CI runs the whole suite against chromium, split across 3 shards (one runner each, one worker per runner). Each shard uploads a blob report; a `merge-reports` job stitches them into a single HTML report artifact.

## Test layout

| Path | Status | Purpose |
|------|--------|---------|
| `index.test.ts` | Passing | Auth redirect to boards |
| `boards.test.ts` | Passing | Seeded board appears on boards page |
| `board.test.ts` | Passing | Add list and card on a board, edit board name |
| `helpers/resetDb.ts` | Clears in-memory DB between tests |
| `mocks/` | Prisma + Clerk doubles (wired via `vite.config.e2e.ts`) |

Each test calls `resetDb()` in `beforeEach` so journeys stay independent. Tests run with **one worker** because the in-memory database is shared on the dev server.

## Adding a user-journey test

1. Add or extend support in `tests/mocks/memoryPrisma.ts` if the flow hits new Prisma calls.
2. Create `tests/<feature>.test.ts` with `resetDb` in `beforeEach`.
3. Prefer existing `data-testid`s, roles, and visible text—avoid asserting implementation details.
4. Run `pnpm test --project=chromium` locally before opening a PR.

## Configuration

- Playwright: `playwright.config.ts` (base URL `http://localhost:3100`, `webServer.command`: `pnpm dev:e2e`)
- E2E Vite aliases: `vite.config.e2e.ts`
- DB reset endpoint (e2e only): `POST /__test/reset`

## CI

GitHub Actions runs `pnpm lint:check`, `pnpm test:types`, and `pnpm test --project=chromium`. No secrets are required for the test job.
