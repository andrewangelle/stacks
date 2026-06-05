# E2E testing findings (Stacks)

Reference doc for mocked Playwright E2E tests and CI. Last updated from implementation work in 2026.

## Philosophy

- **Default:** Playwright E2E from the user’s perspective (`data-testid`, roles, visible text).
- **No test conditionals in `src/`** — mocks live under `tests/` and `vite.config.e2e.ts` only.
- **Do not change app implementation to make tests pass.** Fix test infra, selectors, or timing; app bugs are app bugs.
- **Verify incrementally** — one layer / one test file at a time. Avoid running the full suite on repeat with CI retries while debugging.

## Is it possible?

| Scope | Status |
|--------|--------|
| CI E2E without Clerk/Postgres credentials | **Yes** |
| Smoke: auth redirect → `/boards` | **Passing** |
| Boards: seeded data appears in UI | **Passing** (via test seed API) |
| Create board via Radix popover UI | **Not verified** in headless |
| Board page: add list + card | **Skipped** — Add List UI not opening in headless |

## Architecture

```text
Production          E2E only
──────────          ────────
vite.config.ts      vite.config.e2e.ts  (port 3100, aliases, reset plugin)
pnpm dev :3000      pnpm dev:e2e :3100
real Prisma/Clerk   tests/mocks/memoryPrisma.ts, clerkServer.ts, clerkClient.tsx
```

Playwright (`playwright.config.ts`):

- `baseURL`: `http://localhost:3100`
- `webServer.command`: `pnpm dev:e2e`
- `reuseExistingServer`: `true` locally, `false` when `CI=true`
- `workers: 1`, `fullyParallel: false` (shared in-memory DB)
- `retries: 0` (fail fast while suite grows)

### Why port 3100?

Avoids colliding with normal `pnpm dev` on 3000. If Playwright reuses whatever is on the port, it might attach to the **wrong** server (real DB/auth) and tests hang or fail mysteriously.

## Test-only infrastructure

| Piece | Path | Role |
|--------|------|------|
| Memory Prisma | `tests/mocks/memoryPrisma.ts` | Replaces `~/db/prisma` via alias |
| Clerk server mock | `tests/mocks/clerkServer.ts` | Replaces `@clerk/tanstack-react-start/server` |
| Clerk client mock | `tests/mocks/clerkClient.tsx` | Replaces `@clerk/tanstack-react-start` |
| Constants | `tests/mocks/constants.ts` | `TEST_USER_ID`, fake Clerk user |
| Reset + seed HTTP | `tests/plugins/e2eResetPlugin.ts` | `POST /__test/reset`, `POST /__test/seed-board` |
| E2E Vite config | `vite.config.e2e.ts` | Aliases + plugin + `server.port: 3100` |

### Critical: one shared in-memory store

Vite can load `memoryPrisma.ts` **twice** (dev middleware vs SSR/server-fn bundle). A module-level `const store = {}` meant:

- Seed wrote to store A
- `getBoards` read from store B → empty UI

**Fix:** persist data on `globalThis.__stacksE2EStore` (see `getStore()` in `memoryPrisma.ts`).

### Health checks (manual)

```bash
pnpm dev:e2e
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/          # expect 307
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3100/__test/reset   # 204
curl -s -X POST http://localhost:3100/__test/seed-board \
  -H "Content-Type: application/json" \
  -d '{"boardTitle":"Test"}'   # 200 + JSON board
```

## Tests (current)

| File | CI | Notes |
|------|-----|------|
| `tests/index.test.ts` | Yes | `/` → `/boards`, `BoardsContainer` visible |
| `tests/boards.test.ts` | Yes | `reset` → `seed-board` → `goto /boards` → `BoardCardTitle` text |
| `tests/board.test.ts` | **Skipped** | Add list/card; enable after headed check of Add List UI |

Helpers:

- `tests/helpers/resetDb.ts` — `POST /__test/reset`
- `tests/helpers/seed.ts` — `POST /__test/seed-board`

### Run incrementally

```bash
# Optional: warm server
pnpm dev:e2e

pnpm exec playwright test tests/index.test.ts --project=chromium
pnpm exec playwright test tests/boards.test.ts --project=chromium

# CI subset (~20s cold)
CI=true pnpm test tests/index.test.ts tests/boards.test.ts --project=chromium
```

Full `pnpm test` includes skipped `board.test.ts` and all browser projects — slower.

## CI (`.github/workflows/ci.yml`)

1. `pnpm install --frozen-lockfile`
2. `pnpm db:generate` with dummy `DATABASE_URL` (generate only)
3. `pnpm lint:check`
4. `pnpm test:types`
5. `playwright install --with-deps chromium`
6. `pnpm test tests/index.test.ts tests/boards.test.ts --project=chromium` with `CI=true`

No GitHub secrets for the test job.

## What went wrong earlier (lessons)

1. **Running full suite + `retries: 2` + 60s timeouts** → ~4 minute “stall” loops. Use single-file runs and `retries: 0` while building.
2. **`reuseExistingServer` + port 3000** → wrong dev server. Port 3100 + e2e-only config fixes this.
3. **Changing `CreateBoard.tsx`** to satisfy tests — wrong; reverted. Popover still unreliable in headless with original controlled `open` + card `onClick`.
4. **Seed after `goto` + `reload`** — React Query had already loaded empty boards. **Seed before `goto`** instead.
5. **Assuming one module instance for memory DB** — required `globalThis` shared store.

## Next increments (suggested order)

1. **Headed:** `pnpm test:headed tests/board.test.ts` — confirm whether “+ Add a list” opens `AddListInput` (app/interaction issue vs test issue).
2. **Create board UI:** same headed pass on `CreateBoardCard` / popover — only add E2E when reliable without `src/` hacks.
3. **Enable `board.test.ts`** in CI after step 1 passes.
4. **Grow `memoryPrisma.ts`** only for Prisma calls new journeys need.
5. Re-enable Playwright retries in CI once the suite is stable.

## Related docs

- User-facing: [`tests/README.md`](../tests/README.md)
- Root: [`README.md`](../README.md) Testing section
- Workspace types: `pnpm test:types`
