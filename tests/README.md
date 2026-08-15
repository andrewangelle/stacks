# Playwright E2E Tests

End-to-end tests drive the real app in a browser and assert what a user sees and can do. This is the primary test layer for this repo—reach for E2E first; isolated unit tests are only for cases that cannot reasonably be exercised through the UI. There is no unit test runner installed.

Tests run against `pnpm dev:e2e`, which starts Vite on **port 3100**. Only Clerk is mocked (`tests/mocks/`, wired through the aliases in `vite.config.e2e.ts`); **Prisma and the database are real**. `pnpm test:db:setup` brings up the Postgres container from `docker-compose.yml` and applies migrations to it, and `dev:e2e` points `DATABASE_URL` at it — so Docker has to be running, but no `.env` is needed. Production `pnpm dev` on port 3000 is unchanged.

## Running tests

```bash
# Run all tests (starts the DB and dev:e2e on :3100 automatically)
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

### One file at a time while developing

```bash
pnpm exec playwright test tests/index.test.ts --project=chromium
pnpm exec playwright test tests/activity.test.ts --project=chromium --grep "adds a comment"
```

Playwright starts its own server on every run (`reuseExistingServer: false` with `strictPort: true`), so **do not leave `pnpm dev:e2e` running yourself** — port 3100 already being taken fails the run before any test executes. Cold start is ~30s, most of which is the dev server booting.

## Test layout

| Path | Purpose |
|------|---------|
| `index.test.ts` | Auth redirect to boards |
| `boards.test.ts` | Boards page: seeded board appears, create a board |
| `board.test.ts` | Add list and card on a board, edit the board name |
| `list.test.ts` | The list surface: rename and delete, card fronts and completion, checklist rollups, moving lists |
| `card.test.ts` | Card modal: title, description, completion, delete, moving cards |
| `checklist.test.ts` | Checklists and checklist items in the card modal |
| `activity.test.ts` | Comments, the activity feed, copy-link deep links, the details toggle |
| `drag.test.ts` | Drag and drop: reordering lists, moving cards, moving checklist items |
| `fixtures.ts` | The `test` export every spec imports (clamps the mobile viewport) |
| `fixtures/` | Server-side seed + reset routines, loaded by the dev server |
| `helpers/` | Test-side helpers: `resetDb`, seed request wrappers, hydration waits |
| `mocks/` | Clerk doubles and the test user constants |
| `plugins/` | Vite plugins for e2e: the `/__test/*` endpoints, log suppression |

Every test resets the database first — most call `resetDb(request)` as their first line, `index.test.ts` does it in a `beforeEach` — so journeys stay independent. `resetDB` truncates every table in FK-safe order and recreates the test user. Tests run with **one worker** (`fullyParallel: false`) because that database is shared across the whole run.

## Adding a user-journey test

1. Create `tests/<feature>.test.ts`, importing `test`/`expect` from `~test/fixtures`.
2. Call `await resetDb(request)` first, then seed through the helpers in `~test/helpers/seed`.
3. Add a fixture in `tests/fixtures/` and an endpoint in `tests/plugins/resetDB.ts` if you need to seed something new.
4. Prefer existing `data-testid`s, roles, and visible text—avoid asserting implementation details.
5. SSR paints controls before React attaches handlers, so a click can be dropped. Route actions that must land through `waitForHydratedAction` / `waitForInteractiveTrigger`.
6. Run `pnpm test --project=chromium` locally before opening a PR.

## Configuration

- Playwright: `playwright.config.ts` (base URL `http://localhost:3100`, `webServer.command`: `pnpm test:db:setup && pnpm dev:e2e`)
- E2E Vite config and Clerk aliases: `vite.config.e2e.ts`
- Test database: `docker-compose.yml` (`postgres:16-alpine`, `postgresql://test:test@localhost:5432/test`)
- E2E-only endpoints (`tests/plugins/resetDB.ts`): `GET /__test/health`, `POST /__test/reset`, `POST /__test/seed-board`, `POST /__test/seed-card`, `POST /__test/seed-list-card`, `POST /__test/seed-activities`

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs `pnpm db:generate`, `pnpm lint:check`, `pnpm test:types`, then the suite against chromium split across 3 shards (one runner each, one worker per runner). Each shard uploads a blob report; a `merge-reports` job stitches them into a single HTML report artifact. A `workflow_dispatch` input runs the other browser projects. No secrets are required for the test job.
